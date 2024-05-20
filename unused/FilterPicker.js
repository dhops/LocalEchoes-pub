import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const FilterPicker = ({ selectedValue, onValueChange }) => {
  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
      >
        <Picker.Item label="All" value="all" />
        <Picker.Item label="Wikipedia" value="wikipedia" />
        <Picker.Item label="Podcast" value="podcast" />
        <Picker.Item label="User-Generated" value="user" />
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Styles for the picker container
  },
});

export default FilterPicker;
