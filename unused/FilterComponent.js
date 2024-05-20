import React, { useContext } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import FilterPicker from './FilterPicker'; // Adjust the path as necessary
import { StoriesContext } from '../context/StoriesContext'; // Adjust the path as necessary

const FilterComponent = () => {
  const { filter, setFilter, minRating, setMinRating } = useContext(StoriesContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Source</Text>
      <FilterPicker
        selectedValue={filter}
        onValueChange={(itemValue) => setFilter(itemValue)}
      />
      <Text>Minimum Rating: {minRating}</Text>
      <Slider
        minimumValue={0}
        maximumValue={10}
        step={1}
        value={minRating}
        onValueChange={(value) => setMinRating(value)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Styling for the container
  },
  title: {
    // Styling for the title
  },
  // Add other styles as needed
});

export default FilterComponent;
