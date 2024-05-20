import AsyncStorage from '@react-native-async-storage/async-storage';

export const addStoryToPlaylist = async (storyId) => {
  try {
    const existingPlaylist = await AsyncStorage.getItem('userPlaylist');
    let newPlaylist = existingPlaylist ? JSON.parse(existingPlaylist) : [];
    
    if (!newPlaylist.includes(storyId)) {
      newPlaylist.push(storyId);
      console.log(JSON.stringify(newPlaylist))
      await AsyncStorage.setItem('userPlaylist', JSON.stringify(newPlaylist));
    }
    console.log(newPlaylist)
  } catch (error) {
    console.error('Error adding story to playlist:', error);
  }
};