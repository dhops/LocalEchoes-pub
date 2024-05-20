import React, { Component } from "react";
import { Animated, Dimensions, StyleSheet, View, ScrollView } from "react-native";
import { StoriesContext } from '../context/StoriesContext'; // Adjust the path as necessary
import ListItemButton from "./components/ListItemButton";
import StickyItemButton from "./components/StickyItemButton";

const FILTERS_ICON_WIDTH = 44;
const FILTERS_BUTTON_WIDTH = 100;
const SCREEN_WIDTH = Dimensions.get("screen").width;

export default class FilterComponent extends Component {
  static contextType = StoriesContext; // Use StoriesContext

  animatedWidth = new Animated.Value(FILTERS_BUTTON_WIDTH);
  scrollViewRef = React.createRef();

  onFiltersScroll = (event: *) => {
    const eventX = event.nativeEvent.contentOffset.x;

    const direction = eventX > 0 ? 1 : -1;
    const offsetX = Math.min(
      Math.abs(eventX),
      FILTERS_BUTTON_WIDTH - FILTERS_ICON_WIDTH
    );
    this.animatedWidth.setValue(FILTERS_BUTTON_WIDTH - offsetX * direction);
  };

  onScrollEndSnapToEdge = (event: *) => {
    const offsetX = event.nativeEvent.contentOffset.x;

    const maxOffset = FILTERS_BUTTON_WIDTH - FILTERS_ICON_WIDTH;
    const velocityFactor = Math.abs(event.nativeEvent.velocity.x * 30);

    if (offsetX > 0 && offsetX < maxOffset / 2 - velocityFactor) {
      this.scrollViewRef.scrollTo({ x: 0 });
    } else if (
      maxOffset / 2 + velocityFactor <= offsetX &&
      offsetX < maxOffset
    ) {
      this.scrollViewRef.scrollTo({
        x: FILTERS_BUTTON_WIDTH
      });
    }
  };

  render() {
    const { setFilter, setMinRating } = this.context;

    // Define your filters here
    const filters = [
      {
        name: "source",
        label: "Source",
        action: setFilter, // Function to call when this filter changes
        type: "MULTI_CHOICE" // Adjust according to your filter type
      },
      {
        name: "minRating",
        label: "Minimum Rating",
        action: setMinRating, // Function to call when this filter changes
        type: "RADIO_BUTTON" // Adjust according to your filter type
      }
      // Add more filters as needed
    ];

    return (
      <View style={styles.container}>
        <View style={styles.stickyItem}>
          <Animated.View
            style={[
              styles.stickyItemMask,
              {
                width: this.animatedWidth,
                maxWidth: FILTERS_BUTTON_WIDTH
              }
            ]}
          >
            <StickyItemButton activeFiltersCount={activeFiltersCount} />
          </Animated.View>
        </View>
        <ScrollView
          horizontal
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollViewContent,
            { paddingLeft: scrollViewPaddingLeft }
          ]}
          showsHorizontalScrollIndicator={false}
          onScroll={this.onFiltersScroll}
          onScrollEndDrag={this.onScrollEndSnapToEdge}
          scrollEventThrottle={16}
          ref={this.scrollViewRef}
        >
          {filters.map(filter => (
            <ListItemButton
              key={filter.name}
              active={activeFiltersMap[filter.name]}
              text={filter.label}
              icon={
                filter.type === "MULTI_CHOICE" && (
                  <DropDownIcon active={!!activeFiltersMap[filter.name]} />
                )
              }
            />
          ))}
        </ScrollView>
      </View>
    );
  }
}

const DropDownIcon = ({ active }: { active: boolean }) =>
  active ? (
    <IconSelectArrowDownBlue style={styles.dropDownIcon} />
  ) : (
    <IconSelectArrowDownWhite style={styles.dropDownIcon} />
  );

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    flexDirection: "row",
    paddingLeft: 10,
    backgroundColor: "#2252C7"
  },
  stickyItem: {
    position: "absolute",
    zIndex: 1,
    left: 10,
    paddingRight: 8,
    backgroundColor: "#2252C7"
  },
  stickyItemMask: {
    minWidth: FILTERS_ICON_WIDTH,
    marginLeft: -8,
    borderRadius: 8,
    overflow: "hidden"
  },
  scrollView: {
    marginLeft: 10
  },
  scrollViewContent: {
    paddingLeft: 100,
    paddingRight: 10,
    paddingBottom: 13
  },
  dropDownIcon: {
    marginRight: 6
  }
});

// ... existing DropDownIcon and styles ...
