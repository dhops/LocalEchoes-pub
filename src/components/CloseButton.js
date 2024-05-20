import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // If you want to use an icon

const CloseButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Icon name="close" size={24} color="black" />
      <Text style={styles.text}>Close</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    elevation: 2,
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
  },
  text: {
    marginLeft: 5, // Add space between the icon and text
    fontSize: 16,
    color: '#000',
  },
});

export default CloseButton;
