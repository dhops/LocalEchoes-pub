import React, { useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { List, FAB, Button, Menu } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStoriesByIds } from '../firebase/firebaseService';
import StoryCard from '../components/StoryCard'

const PlaylistScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [playlistStories, setPlaylistStories] = useState([]);

  useEffect(() => {
    if (isFocused) {
      const fetchPlaylistStories = async () => {
        try {
          const playlistIds = await AsyncStorage.getItem('userPlaylist');
          console.log(playlistIds)
          console.log('here')
          if (playlistIds !== null) {
            const stories = await getStoriesByIds(JSON.parse(playlistIds));
            setPlaylistStories(stories);
          }
        } catch (error) {
          console.error('Error fetching playlist stories:', error);
        }
      };
      fetchPlaylistStories();
    }
  }, [isFocused]);

  const removeFromPlaylist = async (storyId) => {
    try {
      const playlistIds = await AsyncStorage.getItem('userPlaylist');
      let newPlaylistIds = JSON.parse(playlistIds);
      newPlaylistIds = newPlaylistIds.filter(id => id !== storyId);
      await AsyncStorage.setItem('userPlaylist', JSON.stringify(newPlaylistIds));
      setPlaylistStories(playlistStories.filter(story => story.id !== storyId));
    } catch (error) {
      console.error('Error removing story from playlist:', error);
    }
  };

  const clearPlaylist = async () => {
    try {
      await AsyncStorage.removeItem('userPlaylist'); // Remove the playlist from storage
      setPlaylistStories([]); // Clear the playlist stories state
    } catch (error) {
      console.error('Error clearing the playlist:', error);
    }
  };
  

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
        <View style={styles.listContent}>
            {playlistStories.length > 0 ? (
              playlistStories.map(story => (
                <StoryCard
                  key={story.id}
                  story={story}
                  navigation={navigation}
                  buttonIcon="delete"
                  onButtonPress={() => removeFromPlaylist(story.id)}
                />
              ))
          ) : (
            <Text style={styles.noStoriesText}>
             Playlist is loading...Or there are no stories in your Playlist.
           </Text>
          )}
        </View>
      </ScrollView>
      <FAB
        style={styles.clearFab}
        icon="playlist-remove"
        onPress={clearPlaylist}
        label="Clear Playlist"
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
  storyItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  titleAndButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flexShrink: 1, // Ensure text doesn't push the button off-screen
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
  clearFab: {
    position: 'absolute',
    margin: 16,
    right: 50, // Align it with the existing FAB, or adjust as needed
    bottom: 50,
  },
  menuContainer: {
    position: 'absolute',
    bottom: 50,
    left: 50,
    zIndex: 1, // Ensure it's above other components
  },
  // Additional styles can be added here
});

export default PlaylistScreen;
