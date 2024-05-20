import React, { useContext, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import MapView from 'react-native-map-clustering';
// import Icon from 'react-native-vector-icons/MaterialIcons';
import { getTypeIcon } from '../utils/icon_helper';
import StoryCard from '../components/StoryCard'; // Adjust the path as necessary
import { addStoryToPlaylist } from '../utils/playlistUtils';

import { Icon } from 'react-native-paper';
import { StoriesContext } from '../context/StoriesContext';
import { Marker } from 'react-native-maps';
import { FAB, useTheme } from 'react-native-paper';
import FiltersModal from '../components/FiltersModal';
import * as Location from 'expo-location';

const MapScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { filteredStories, setMapRegion, location, setLocation } = useContext(StoriesContext);
  const [mapType, setMapType] = useState('standard'); // New state for map type


  const [isFiltersModalVisible, setFiltersModalVisible] = useState(false);

  const openFiltersModal = () => setFiltersModalVisible(true);
  const closeFiltersModal = () => setFiltersModalVisible(false);

  const toggleMapType = () => {
    setMapType(mapType === 'standard' ? 'satellite' : 'standard');
  };

  const INITIAL_REGION = {
   latitude: 44.5588,
   longitude: -72.5778,
   latitudeDelta: 1,
   longitudeDelta: 1,
 };

 const [selectedStory, setSelectedStory] = useState(null);

  const onMarkerPress = (story) => {
    setSelectedStory(story);
  };

  const dismissStoryCard = () => {
    setSelectedStory(null);
  };


  const onRegionChangeComplete = async (region) => {
    setMapRegion(region);
    let address = await Location.reverseGeocodeAsync({
      latitude: region.latitude,
      longitude: region.longitude
    });
    if (address.length > 0) {
      if (address[0].city) {
        if (region.latitudeDelta < 0.5) {
          setLocation(`${address[0].city}, ${address[0].region}`);
        } else if (region.latitudeDelta < 3) {
          setLocation(`${address[0].subregion}, ${address[0].region}`);
        } else {
          setLocation(`${address[0].region}`);
        }
      } else if (address[0].name) {
        setLocation(`${address[0].name}`);
      } else {
        setLocation(null);
      };
    }
  };

  return (
    <View style={styles.container}>
      <FiltersModal
        visible={isFiltersModalVisible}
        hideModal={closeFiltersModal}
      />
      <MapView
        initialRegion={INITIAL_REGION}
        style={styles.map}
        mapType={mapType}
        clusterColor={colors.primary}
        onRegionChangeComplete={onRegionChangeComplete}
      >
        {filteredStories.filter(story => {
          return (story.precise === true)}).map(story => (
          <Marker
            key={story.id}
            coordinate={story.coordinates}
            onPress={() => onMarkerPress(story)}
            // onPress={() => navigation.navigate('Story', { story })}
          >
             <Icon 
              source={getTypeIcon(story.type)} 
              color={colors.primary}
              size={30} />
          </Marker>
        ))}
      </MapView>
      {selectedStory && (
        <TouchableOpacity style={styles.overlay} onPress={dismissStoryCard} activeOpacity={1}>
          <StoryCard
            story={selectedStory}
            navigation={navigation}
            buttonIcon={'playlist-plus'}
            onButtonPress={() => addStoryToPlaylist(selectedStory.id)}
          />
        </TouchableOpacity>
      )}
      {location && (
        <View style={styles.locationBox}>
          <Text style={styles.locationText}>{location}</Text>
        </View>
      )}
      <FAB
        style={styles.fab}
        icon="filter"
        onPress={openFiltersModal}
      />
      <FAB
        style={styles.satelliteFab} // New FAB for satellite view
        icon="satellite-variant" // Change to your preferred icon
        onPress={toggleMapType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    shadowColor: '#171717',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  map: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    bottom: 50,
    right: 50,
  },
  satelliteFab: {
    position: 'absolute',
    bottom: 50,
    left: 50, // Positioned symmetrically to the filter button
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Adjust color as needed
  },
  locationBox: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 6,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  locationText: {
    fontWeight: 'bold',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
  },
});

export default MapScreen;
