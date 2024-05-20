import React, { useContext, useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { StoriesContext } from '../context/StoriesContext';
import { FAB, Menu } from 'react-native-paper';
import FiltersModal from '../components/FiltersModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StoryCard from '../components/StoryCard'
import { addStoryToPlaylist } from '../utils/playlistUtils';

const ListScreen = ({ navigation }) => {
  const { filteredStories, location } = useContext(StoriesContext);
  const [isFiltersModalVisible, setFiltersModalVisible] = useState(false);
  const [isSortMenuVisible, setIsSortMenuVisible] = useState(false);
  const [sortedStories, setSortedStories] = useState(filteredStories);

  const [showMoreGeotagged, setShowMoreGeotagged] = useState(false);
  const [showMoreRegional, setShowMoreRegional] = useState(false);

  useEffect(() => {
    // Update sortedStories when filteredStories changes
    setSortedStories(filteredStories);
  }, [filteredStories]);

  const openFiltersModal = () => setFiltersModalVisible(true);
  const closeFiltersModal = () => setFiltersModalVisible(false);
  const openSortMenu = () => setIsSortMenuVisible(true);
  const closeSortMenu = () => setIsSortMenuVisible(false);

  const geotaggedStories = sortedStories.filter(story => story.precise);
  const regionalStories = sortedStories.filter(story => !story.precise);


  const handleSort = (sortOption) => {
    closeSortMenu();

    const sortedStories = [...filteredStories].sort((a, b) => {
      switch (sortOption) {
        case 'Interest to a Visitor':
          return b.visitor_interest - a.visitor_interest;
        case 'Interest to a Local':
          return b.local_interest - a.local_interest;
        case 'User Rating':
          return b.user_rating - a.user_rating;
        default:
          return 0;
      }
    });
    setSortedStories(sortedStories);
  };

  const renderStoryList = (stories, title, section) => {
    const isExpanded = section === 'geotagged' ? showMoreGeotagged : showMoreRegional;
    const visibleStories = stories.slice(0, isExpanded ? 20 : 3);
    return (
      <>
        <Text style={styles.sectionTitle}>{title}</Text>
        {visibleStories.map(story => (
          <StoryCard
            key={story.id}
            story={story}
            navigation={navigation}
            buttonIcon={'playlist-plus'}
            onButtonPress={() => addStoryToPlaylist(story.id)}
          />
        ))}
        {stories.length > 3 && renderSeeMoreLessButton(section)}
      </>
    );
  };

  const renderSeeMoreLessButton = (section) => {
    const isExpanded = section === 'geotagged' ? showMoreGeotagged : showMoreRegional;
    return (
      <TouchableOpacity
        onPress={() => section === 'geotagged' ? setShowMoreGeotagged(!showMoreGeotagged) : setShowMoreRegional(!showMoreRegional)}
        style={styles.seeMoreButton}
      >
        <Text style={styles.seeMoreText}>{isExpanded ? 'See Less' : 'See More'}</Text>
      </TouchableOpacity>
    );
   };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Stories in</Text>
        {location && (
          <TouchableOpacity
            style={styles.locationBox}
            onPress={() => navigation.navigate('MapScreen')} // Navigate back to MapScreen
          >
            <Text style={styles.locationText}>{location}</Text>
          </TouchableOpacity>
        )}
      </View>
      <FiltersModal
        visible={isFiltersModalVisible}
        hideModal={closeFiltersModal}
      />
     <ScrollView style={styles.scrollView}>
        <View style={styles.listContent}>
          {geotaggedStories.length > 0 ? renderStoryList(geotaggedStories, 'Geotagged Stories', 'geotagged') : 
          <Text style={styles.noStoriesText}>
            No geotagged stories in current map view.
          </Text>
          }
          {regionalStories.length > 0 && renderStoryList(regionalStories, 'Regional Stories', 'regional')}
        </View>
      </ScrollView>

      <View style={styles.menuContainer}>
        <Menu
          visible={isSortMenuVisible}
          onDismiss={closeSortMenu}
          anchorPosition="bottom"
          anchor={<FAB style={styles.sortFab} icon="sort" onPress={openSortMenu} />}
        >
          <Menu.Item onPress={() => handleSort('Interest to a Visitor')} title="Interest to a Visitor" />
          <Menu.Item onPress={() => handleSort('Interest to a Local')} title="Interest to a Local" />
          <Menu.Item onPress={() => handleSort('User Rating')} title="User Rating" />
        </Menu>
      </View>
      <FAB
        style={styles.filterFab}
        icon="filter"
        onPress={openFiltersModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 22,
  },
  scrollView: {
    flex: 1,
  },
  listContent: {
    flex: 1,
    alignItems: 'stretch', // Ensure full width
    padding: 20,
  },
  titleAndButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'normal',
    textDecorationLine: 'underline',
    padding: 10,
    backgroundColor: '#f0f0f0',
    marginTop: 0,
  },
  storyDescription: {
    fontSize: 14,
    color: 'gray',
    marginTop: 8,
  },
  noStoriesText: {
    margin: 20,
    textAlign: 'center',
  },
  filterFab: {
    position: 'absolute',
    bottom: 50,
    right: 50,
  },
  menuContainer: {
    position: 'absolute',
    bottom: 50,
    left: 50,
    zIndex: 1, // Ensure it's above other components
  },
  seeMoreButton: {
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 20,
  },
  seeMoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0000ff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0', // A light gray background, for example
    padding: 10,
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#d1d1d1', // A subtle border
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 3, // Elevation for Android
    zIndex: 1, // Ensure it's above the ScrollView
  },
  headerText: {
    fontSize: 24,
    marginRight: 10,
    alignItems: 'center',
  },
  locationBox: {
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
});

export default ListScreen;
