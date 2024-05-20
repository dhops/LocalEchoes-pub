import React, { createContext, useState, useEffect } from 'react';
import { getStories } from '../firebase/firebaseService';
import haversine from 'haversine';

export const StoriesContext = createContext();

export const StoriesProvider = ({ children }) => {
  const availableSources = ['wikipedia', 'podcast', 'oral-history', 'user'];
  const availableTypes = ['history', 'economy', 'culture', 'nature', 'legend', 'other'];
  const [location, setLocation] = useState(null); // New state for location


  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [filters, setFilters] = useState({
    selectedSources: {'wikipedia': true, 'podcast': true, 'oral-history': true, 'user': true},
    selectedTypes: {'history': true, 'economy': true, 'oral-history': true,'culture': true, 'nature': true, 'legend': true, 'other': true},
    minRating: 0,
  });
  const [mapRegion, setMapRegion] = useState(null);

  const REGIONAL_RADIUS = 200;

  useEffect(() => {
    const fetchStories = async () => {
      const data = await getStories('all');
      setStories(data);
    };
    fetchStories();
  }, [filters]);

  useEffect(() => {
    const calculateDistance = (storyCoords, regionCenter) => {
      return haversine(storyCoords, regionCenter, { unit: 'kilometer' });
    };


    if (mapRegion) {
      const regionCenter = {
        latitude: mapRegion.latitude,
        longitude: mapRegion.longitude
      };
      
      const newFilteredStories = stories
        .filter(story => {
          const isSelectedSource = filters.selectedSources[story.source];
          return (isSelectedSource === undefined || isSelectedSource);
        })
        .filter(story => {
          return (story.precise === true) ? isStoryVisible(story, mapRegion) :
            calculateDistance(story.coordinates, regionCenter) <= REGIONAL_RADIUS;
        })
        .filter(story => {
          const isSelectedType = filters.selectedTypes[story.type];
          return (isSelectedType === undefined || isSelectedType);
        });
  
      setFilteredStories(newFilteredStories);
    }
  }, [stories, filters, mapRegion]);

  const isStoryVisible = (story, region) => {
    if (!region) return true;
    return (
      story.coordinates.latitude >= region.latitude - region.latitudeDelta / 2 &&
      story.coordinates.latitude <= region.latitude + region.latitudeDelta / 2 &&
      story.coordinates.longitude >= region.longitude - region.longitudeDelta / 2 &&
      story.coordinates.longitude <= region.longitude + region.longitudeDelta / 2
    );
  };

  return (
    <StoriesContext.Provider value={{ filteredStories, filters, setFilters, availableSources, availableTypes, setMapRegion, location, setLocation }}>
      {children}
    </StoriesContext.Provider>
  );
};
