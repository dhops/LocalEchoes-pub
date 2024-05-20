import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Audio } from 'expo-av';
import * as Progress from 'react-native-progress';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firebase from '../firebase/firebaseConfig';

const { width: screenWidth } = Dimensions.get('window');
const progressBarWidth = screenWidth - 40;

const AudioPlayer = ({ audioSource }) => {
  const [sound, setSound] = useState(null);
  const [playbackStatus, setPlaybackStatus] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    loadAudio();
    Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

    return () => sound?.unloadAsync();
  }, [audioSource]);

  const loadAudio = async () => {
    setIsLoading(true);
    let audioUri = audioSource.isFirebase ? await fetchFirebaseAudioUrl(audioSource.uri) : audioSource.uri;

    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: false },
        onUpdateStatus
      );
      setSound(newSound);
    } catch (error) {
      console.error('Error creating audio sound:', error);
    }
    setIsLoading(false);
  };

  const fetchFirebaseAudioUrl = async (firebaseRef) => {
    try {
      return await firebase.storage().refFromURL(firebaseRef).getDownloadURL();
    } catch (error) {
      console.error('Error fetching audio URL:', error);
      return "";
    }
  };

  const getDownloadProgress = () => {
    if (playbackStatus.durationMillis && playbackStatus.playableDurationMillis) {
      return playbackStatus.playableDurationMillis / playbackStatus.durationMillis;
    }
    return 0;
  };

  const playPauseAudio = async () => {
    if (!sound) {
      console.log("Audio is not loaded yet");
      return;
    }
    try {
      const status = await sound.getStatusAsync();
      await (status.isPlaying ? sound.pauseAsync() : sound.playAsync());
      setIsPlaying(!status.isPlaying);
    } catch (error) {
      console.error("Error during play/pause:", error);
    }
  };


  const onUpdateStatus = (status) => {
    if (status.isLoaded) {
      setPlaybackStatus(status);
    }
  };

  const getProgress = () => {
    if (playbackStatus.durationMillis && playbackStatus.positionMillis) {
      return playbackStatus.positionMillis / playbackStatus.durationMillis;
    }
    return 0;
  };

  const formatTime = (millis) => {
    const totalSeconds = millis / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const skipForward = async () => {
    if (sound && playbackStatus.isLoaded && playbackStatus.playableDurationMillis) {
      const newPosition = playbackStatus.positionMillis + 30000; // 30 seconds
      if (newPosition < playbackStatus.playableDurationMillis) {
        await sound.setPositionAsync(newPosition);
      } else {
        // Handle case where the desired position isn't downloaded yet
        console.log("The audio hasn't been fully loaded to this point.");
      }
    }
  };
  
  const skipBackward = async () => {
    if (sound && playbackStatus.isLoaded) {
      const newPosition = playbackStatus.positionMillis - 30000; // 30 seconds
      if (newPosition > 0) {
        await sound.setPositionAsync(newPosition);
      } else {
        await sound.setPositionAsync(0);
      }
    }
  };

  const handleProgressBarPress = async (evt) => {
    const relativePosition = evt.nativeEvent.locationX;
    const newProgress = relativePosition / progressBarWidth;
    const newPositionMillis = newProgress * playbackStatus.durationMillis;
  
    if (newPositionMillis <= playbackStatus.playableDurationMillis) {
      await sound.setPositionAsync(newPositionMillis);
    } else {
      // Handle case where the desired position isn't downloaded yet
      console.log("The audio hasn't been fully loaded to this point.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <TouchableOpacity onPress={skipBackward} disabled={isLoading}>
          <Icon name="replay-30" size={50} color={isLoading ? 'gray' : 'black'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={playPauseAudio} disabled={isLoading}>
          <Icon name={isPlaying ? 'pause' : 'play-arrow'} size={50} color={isLoading ? 'gray' : 'black'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={skipForward} disabled={isLoading}>
          <Icon name="forward-30" size={50} color={isLoading ? 'gray' : 'black'} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.progressBarTouchable}
        onPress={(evt) => handleProgressBarPress(evt)}
        activeOpacity={1}
      >
        {/* Download progress bar (lighter color) */}
        <Progress.Bar
          progress={getDownloadProgress()}
          width={progressBarWidth}
          height={30}
          color="#D3D3D3" // Light gray for download progress
          style={styles.progressBar}
          useNativeDriver={true}
          unfilledColor="transparent" // Make unfilled part transparent
        />
        {/* Playback progress bar */}
        <Progress.Bar
          progress={getProgress()}
          width={progressBarWidth}
          height={30}
          color="#007bff" // Main color for playback progress
          style={[styles.progressBar, StyleSheet.absoluteFill]}
          useNativeDriver={true}
          unfilledColor="transparent" // Make unfilled part transparent
        />
      </TouchableOpacity>
      
      {/* <TouchableOpacity
        style={styles.progressBarTouchable}
        onPress={(evt) => handleProgressBarPress(evt)}
        activeOpacity={1}
      >
        <Progress.Bar
          progress={getProgress()}
          width={progressBarWidth}
          height={30}
          style={styles.progressBar}
        />
      </TouchableOpacity> */}
      <Text style={styles.time}>
        {formatTime(playbackStatus.positionMillis || 0)} / {formatTime(playbackStatus.durationMillis || 0)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5', // A light grey background, for example
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  progressBarTouchable: {
    // Style to make the touchable area larger if needed
    width: progressBarWidth, // Make sure this matches the width of your Progress.Bar
    // Add padding or height as needed
  },
  progressBar: {
    marginTop: 10,
    borderRadius: 5,
  },
  time: {
    marginTop: 10,
    color: '#007bff', // Example: Bright blue color for visibility
    fontSize: 16,
    fontWeight: 'bold', // Make the font bold
    // Add more styling as needed
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  // Additional styling as needed
});


export default AudioPlayer;
