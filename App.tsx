import React, { useCallback, useState, useEffect } from "react";
import {
  Camera,
  CameraView,
  CameraType,
  useCameraPermissions,
  FlashMode,
} from "expo-camera";
import {
  Button,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Header from "./components/_layout";
import jsonData from "./assets/ticket_db.json";
import { MaterialIcons } from "@expo/vector-icons";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import TicketValidationModal from "./components/Modal";
import * as SplashScreen from "expo-splash-screen";
import { initialize } from "@embrace-io/react-native";

const loadFonts = async () => {
  await Font.loadAsync({
    "Concert-One": {
      uri: "https://github.com/google/fonts/raw/main/ofl/concertone/ConcertOne-Regular.ttf",
      display: Font.FontDisplay.FALLBACK,
    },
    "Poppins-Bold": {
      uri: "https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-Bold.ttf",
      display: Font.FontDisplay.FALLBACK,
    },
  });
};

const Home = () => {
  const [qrData, setQrData] = useState("");
  const [facing, setFacing] = useState<CameraType>("back");
  const [flashMode, setFlashMode] = useState<FlashMode>("on");
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [ticketId, setTicketId] = useState("");
  const [guestName, setGuestName] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        // await Font.loadAsync(Entypo.font);
        loadFonts().then(() => setFontsLoaded(true));
        if (qrData) {
          const parsedData = parseQrData(qrData);
          setTicketId(parsedData.ticketId);
          setGuestName(parsedData.guestName);
          const isValidTicket = validateTicket(
            jsonData,
            parsedData.ticketId,
            parsedData.guestName
          );
          setIsValid(isValidTicket);
          setModalVisible(true);
        }
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Remove this if you copy and paste the code!
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, [qrData]);

  const onLayoutRootView = useCallback(() => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      SplashScreen.hide();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }
  interface ParsedData {
    guestName: string;
    ticketId: string;
  }

  const parseQrData = (qrData: string): ParsedData => {
    if (qrData.startsWith("('") && qrData.endsWith(",)")) {
      qrData = qrData.slice(2, -3);
    }
    // console.log("QR Data:", qrData);
    const dataArray = qrData.split(",");

    let ticketId = "";
    let guestName = "";

    dataArray.forEach((item) => {
      if (item.includes("TicketId:")) {
        ticketId = item.split("TicketId: ")[1].trim();
      }
      if (item.includes("Guest Name:") || item.includes("Name:")) {
        guestName = item.split(":")[1].trim();
      }
    });

    //console.log("Parsed Data:", { ticketId, guestName });
    return { ticketId, guestName };
  };

  const validateTicket = (
    tickets: { [key: string]: any },
    ticketId: string,
    guestName: string
  ): boolean => {
    //console.log("Tickets:", tickets);
    //console.log("Ticket ID:", ticketId);
    //console.log("Guest Name:", guestName);

    const ticket = tickets[ticketId];
    if (!ticket) {
      // console.error("Ticket not found");
      return false;
    }

    // console.log("Found Ticket:", ticket);
    const isValid =
      ticketId === ticket.ticketId &&
      guestName.toLowerCase() === ticket.name.toLowerCase();
    //console.log("Validation Result:", isValid);
    return isValid;
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <Text style={styles.message}>
            We need your permission to show the camera
          </Text>
          <Button onPress={requestPermission} title="Grant Permission" />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const qrScanned = ({ data }: { data: string }) => {
    if (!scanned) {
      setScanned(true);

      setQrData(data);
      setTimeout(() => setScanned(false), 3000);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Header name="Ticket Scanner" />
        <View
          style={{
            backgroundColor: "#141b2b",
            marginTop: 25,
            borderRadius: 20,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", alignSelf: "center", padding: 8 }}>
            Place the ticket in the frame.
          </Text>

          {/* Camera Container */}
          <View style={styles.cameraContainer}>
            <CameraView
              style={styles.camera}
              facing={facing}
              onBarcodeScanned={scanned ? undefined : qrScanned}
              barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
              flashMode={flashMode}
            >
              {/* Overlay Border */}
              <View style={styles.borderOverlay}></View>
            </CameraView>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={toggleCameraFacing}
              style={styles.button}
            >
              <MaterialIcons
                name="flip-camera-android"
                size={24}
                color="white"
              />
              <Text style={styles.buttonText}>Flip Camera</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TicketValidationModal
          isVisible={modalVisible}
          onClose={() => setModalVisible(false)}
          name={guestName}
          ticketId={ticketId}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyItems: "center",
    backgroundColor: "black",
  },
  cameraContainer: {
    margin: 20,
    width: 300, // Square size
    height: 300, // Square size
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden", // Ensures it stays within bounds
    borderRadius: 20,
    backgroundColor: "#3a4245",
  },
  camera: {
    width: 300, // Matches container width
    height: 300, // Matches container height
  },

  message: {
    fontFamily: "Poppins-Bold",
    textAlign: "center",
    color: "white",
    paddingBottom: 5,
  },

  borderOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 2,
    borderColor: "#0b79d4", // Red glowing border
    borderWidth: 3,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 5,
    marginBottom: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E88E5",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    marginLeft: 8,
  },
});
export default Home;
