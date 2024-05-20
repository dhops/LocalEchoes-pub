// utils/mapHelpers.js
export const processClusterStories = (markers, stories) => {
  return markers.map(marker => stories.find(story => story.id === marker.id));
};

export default processClusterStories;
