import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MySavedScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>My Saved Predictions</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
  },
});
