import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, IconButton, useTheme } from 'react-native-paper';
import { getTypeIcon } from '../utils/icon_helper';


const StoryCard = ({ story, navigation, onButtonPress, buttonIcon }) => {
  const { colors } = useTheme();

  const getFirst100Chars = (description) => {
    if (description.length <= 100) {
      return description;
    }
    return description.substring(0, 100) + '...';
  };

  return (
    <TouchableOpacity
      style={styles.storyItem}
      onPress={() => navigation.navigate('Story', { story })}
    >
      <View style={styles.titleRow}>
        <IconButton
          icon={getTypeIcon(story.type)}
          size={24}
          iconColor={colors.primary}
        />
        <Text style={styles.storyTitle}>{story.title}</Text>
        <IconButton
          icon={buttonIcon}
          size={24}
          iconColor={colors.primary}
          onPress={onButtonPress}
        />
      </View>
      <Text style={styles.storyDescription}>{getFirst100Chars(story.description)}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  storyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    flex: 1, // Allow title to take up remaining space
  },
  storyDescription: {
    fontSize: 14,
    color: 'gray',
    marginTop: 8,
  },
});

export default StoryCard;
