import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';

const CollapsiblePanel = ({ title, children }) => {
  const [expanded, setExpanded] = useState(false);
  const animationHeight = useRef(new Animated.Value(0)).current;
  const [measuredHeight, setMeasuredHeight] = useState(0);
  const [isHeightMeasured, setIsHeightMeasured] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    if (isHeightMeasured) {
      Animated.timing(animationHeight, {
        toValue: expanded ? measuredHeight : 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [expanded, measuredHeight, isHeightMeasured]);

  const measureHeight = (event) => {
    if (!isHeightMeasured) {
      setMeasuredHeight(event.nativeEvent.layout.height);
      setIsHeightMeasured(true);
    }
  };

  return (
    <View>
      <TouchableOpacity style={styles.header} onPress={toggleExpand}>
        <Text>{title}</Text>
      </TouchableOpacity>
      <View style={{...styles.hidden, ...(isHeightMeasured ? styles.hidden : {})}} onLayout={measureHeight}>
        {children}
      </View>
      {isHeightMeasured && (
        <Animated.View style={[styles.content, { height: animationHeight }]}>
          {expanded && children}
        </Animated.View>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',  // Semi-transparent
    padding: 50,
    // Additional styling for the header
  },
  content: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',  // Semi-transparent
    overflow: 'hidden',
    // Additional styling for the content
  },
  hidden: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: -5000, // Off-screen
    zIndex: -1,
  },
  // Additional styles
});

export default CollapsiblePanel;
