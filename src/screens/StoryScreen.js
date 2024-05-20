import React from 'react';
import { ScrollView, Text, TextInput, StyleSheet } from 'react-native';
import AudioPlayer from '../components/AudioPlayer';

const StoryScreen = ({ route, navigation }) => {
  const story = route.params.story;

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{story ? story.title : ''}</Text>

      {story.audioRef && <AudioPlayer audioSource={{ uri: story.audioRef, isFirebase: story.local }} />}

      <TextInput
        style={styles.description}
        editable={false}
        multiline
        value={story ? story.description : ''}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    padding: 10,
    margin: 20,
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 16, // Adjusted for readability
  },
  // Add additional styling as needed
});

export default StoryScreen;
