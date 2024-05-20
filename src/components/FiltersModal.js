import React, { useContext, useState, useEffect } from 'react';
import { Modal, Portal, Button } from 'react-native-paper';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { StoriesContext } from '../context/StoriesContext';
import { Checkbox } from 'react-native-paper';

const FiltersModal = ({ visible, hideModal }) => {
  const { filters, setFilters, availableSources, availableTypes } = useContext(StoriesContext);
  const [tempFilters, setTempFilters] = useState(filters);

  const applyFilters = () => {
    setFilters(tempFilters);
    hideModal();
  };

  const toggleSource = (source) => {
    setTempFilters({
      ...tempFilters,
      selectedSources: {
        ...tempFilters.selectedSources,
        [source]: !tempFilters.selectedSources[source],
      },
    });
  };

  const toggleType = (type) => {
    setTempFilters({
      ...tempFilters,
      selectedTypes: {
        ...tempFilters.selectedTypes,
        [type]: !tempFilters.selectedTypes[type],
      },
    });
  };

  useEffect(() => {
    setTempFilters(filters);
  }, [filters]);

  return (
    <Portal>
      <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modal}>
        <View style={styles.container}>
          <Text style={styles.title}>Source</Text>
          {availableSources.map((source) => (
            <View key={source} style={styles.checkboxContainer}>
              <Checkbox.Item
                label={source}
                status={tempFilters.selectedSources[source] ? 'checked' : 'unchecked'}
                onPress={() => toggleSource(source)}
              />
            </View>
          ))}
          <Text style={styles.title}>Type</Text>
          {availableTypes.map((type) => (
            <View key={type} style={styles.checkboxContainer}>
              <Checkbox.Item
                label={type}
                status={tempFilters.selectedTypes[type] ? 'checked' : 'unchecked'}
                onPress={() => toggleType(type)}
              />
            </View>
          ))}
          <Text>Minimum Rating: {tempFilters.minRating}</Text>
          <Slider
            minimumValue={0}
            maximumValue={10}
            step={1}
            value={tempFilters.minRating}
            onValueChange={(value) =>
              setTempFilters({ ...tempFilters, minRating: value })
            }
          />
        </View>
        <Button onPress={applyFilters}>Apply Filters</Button>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  // ... other styles
});

export default FiltersModal;
