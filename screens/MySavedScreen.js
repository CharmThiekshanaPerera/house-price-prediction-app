import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MySavedScreen = () => {
  const [savedPredictions, setSavedPredictions] = useState([]);

  // Fetch saved predictions from AsyncStorage
  useEffect(() => {
    const fetchSavedPredictions = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('savedPredictions');
        const data = jsonValue ? JSON.parse(jsonValue) : [];
        setSavedPredictions(data);
      } catch (e) {
        console.error('Error fetching saved predictions:', e);
      }
    };

    fetchSavedPredictions();
  }, []);

  // Delete a specific prediction
  const deletePrediction = async (index) => {
    try {
      const updatedPredictions = savedPredictions.filter((_, i) => i !== index);
      await AsyncStorage.setItem('savedPredictions', JSON.stringify(updatedPredictions));
      setSavedPredictions(updatedPredictions);
      Alert.alert('Success', 'Prediction deleted successfully');
    } catch (e) {
      console.error('Error deleting prediction:', e);
      Alert.alert('Error', 'Failed to delete prediction');
    }
  };

  // Render each saved prediction
  const renderItem = ({ item, index }) => (
    <View style={styles.card}>
      <Text style={styles.predictionTitle}>Predicted Price: Rs. {Number(item.prediction).toFixed(0)}.00/=</Text>
      {Object.entries(item).map(([key, value]) => {
        if (key !== 'prediction') {
          return (
            <Text key={key} style={styles.inputData}>
              {key.replace(/_/g, ' ')}: {value}
            </Text>
          );
        }
      })}
      <TouchableOpacity style={styles.deleteButton} onPress={() => deletePrediction(index)}>
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Saved Predictions</Text>
      {savedPredictions.length === 0 ? (
        <Text style={styles.noDataText}>No saved predictions available.</Text>
      ) : (
        <FlatList
          data={savedPredictions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#034B63',
  },
  noDataText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  predictionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 10,
  },
  inputData: {
    fontSize: 14,
    color: '#555',
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default MySavedScreen;
