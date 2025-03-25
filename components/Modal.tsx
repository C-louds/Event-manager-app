import React from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface TicketValidationModalProps {
  isVisible: boolean;
  onClose: () => void;
  ticketId?: string;
  name?: string;
}

const TicketValidationModal: React.FC<TicketValidationModalProps> = ({ 
  isVisible, 
  onClose, 
  ticketId,
  name
}) => {
  // Check if ticket is valid
  const isValidTicket = !!(ticketId && name);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[
          styles.modalContainer, 
          !isValidTicket && styles.invalidTicketContainer
        ]}>
          {/* Header */}
          <View style={[
            styles.validTicketHeader, 
            !isValidTicket && styles.invalidTicketHeader
          ]}>
            <Text style={styles.validTicketText}>
              {isValidTicket ? 'Valid Ticket' : 'Invalid Ticket'}
            </Text>
          </View>

          {isValidTicket ? (
            <>
              {/* User Profile */}
              <View style={styles.profileContainer}>
                <View>
                  <Text style={styles.userName}>{name}</Text>
                  <Text style={styles.userPass}>Farewell 2024-2025</Text>
                </View>
              </View>

              {/* Ticket Details */}
              <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Ticket ID</Text>
                  <Text style={styles.detailValue}>{ticketId}</Text>
                </View>
              </View>

              {/* QR Code */}
              <View style={styles.qrContainer}>
                <View style={styles.qrCodeWrapper}>
                  <QRCode
                    value={ticketId}
                    size={200}
                  />
                </View>
              </View>

              {/* Approve Entry Button */}
              <TouchableOpacity 
                style={styles.approveButton} 
                onPress={onClose}
              >
                <Text style={styles.approveButtonText}>Approve Entry</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.invalidTicketContent}>
              <Text style={styles.invalidTicketMessage}>
                This ticket is not valid. Please check the ticket details.
              </Text>
            </View>
          )}

          {/* Close Button */}
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    overflow: 'hidden',
  },
  invalidTicketContainer: {
    backgroundColor: '#333',
  },
  validTicketHeader: {
    backgroundColor: '#2ECC71',
    padding: 15,
    alignItems: 'center',
  },
  invalidTicketHeader: {
    backgroundColor: '#E74C3C',
  },
  validTicketText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  userName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userPass: {
    color: '#888',
    fontSize: 14,
  },
  detailsContainer: {
    padding: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailLabel: {
    color: '#888',
    fontSize: 14,
  },
  detailValue: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
  },
  qrCodeWrapper: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
  },
  approveButton: {
    backgroundColor: '#2ECC71',
    padding: 15,
    alignItems: 'center',
  },
  approveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#333',
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  invalidTicketContent: {
    padding: 20,
    alignItems: 'center',
  },
  invalidTicketMessage: {
    color: '#E74C3C',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default TicketValidationModal;