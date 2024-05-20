import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FilterPicker from '../components/FilterPicker';

const ClusterListScreen = ({ route, navigation }) => {
  const [filter, setFilter] = useState('all');
  const [filteredStories, setFilteredStories] = useState([]);
  const storiesInCluster = route.params.storiesInCluster;
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredStories(storiesInCluster);
    } else {
      const filtered = storiesInCluster.filter(story => story.source === filter);
      setFilteredStories(filtered);
    }
  }, [filter, storiesInCluster]);

  return (
    <ScrollView style={styles.container}>
      <FilterPicker
        selectedValue={filter}
        onValueChange={(itemValue) => setFilter(itemValue)}
      />
      <View style={styles.listContent}>
      {filteredStories
        .filter(story => (story.visitor_interest+story.local_interest) >= minRating)
        .map(story => (
          <TouchableOpacity
            key={story.id}
            style={styles.storyItem}
            onPress={() => navigation.navigate('Story', { story })}
          >
            <Text style={styles.storyTitle}>{story.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 22,
  },
  listContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  storyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Additional styles can be added here
});

export default ClusterListScreen;
