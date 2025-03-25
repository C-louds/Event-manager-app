import React,{useState, useEffect} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';

type screenName = {
  name: string;
};

const loadFonts = async () => {
  await Font.loadAsync({
    'Concert-One': {
      uri: 'https://github.com/google/fonts/raw/main/ofl/concertone/ConcertOne-Regular.ttf',
      display: Font.FontDisplay.FALLBACK,
    },
    'Poppins-Bold': {
      uri: 'https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-Bold.ttf',
      display: Font.FontDisplay.FALLBACK,
    },
  });
};



const Header = (props: screenName) => {

  const [fontsLoaded,setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.content}>
        {props.name}
      </Text>
    </View>
        
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#141b2b',
    elevation: 30,
    shadowColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    width: '100%',
    flexShrink: 0, // Prevents it from collapsing
  },
  content: {
    color: '#ffffff',
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
  }
})
export default Header;