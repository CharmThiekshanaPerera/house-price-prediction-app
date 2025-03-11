import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MySavedScreen = () => {
  const [savedPredictions, setSavedPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch saved predictions from AsyncStorage
  const fetchSavedPredictions = async () => {
    try {
      setLoading(true);
      const jsonValue = await AsyncStorage.getItem('savedPredictions');
      const data = jsonValue ? JSON.parse(jsonValue) : [];
      setSavedPredictions(data);
    } catch (e) {
      console.error('Error fetching saved predictions:', e);
      Alert.alert('Error', 'Failed to load saved predictions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedPredictions();
  }, []);

  // Pull-to-refresh functionality
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSavedPredictions();
    setRefreshing(false);
  };

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

      {loading ? (
        <ActivityIndicator size="large" color="#034B63" style={styles.loader} />
      ) : savedPredictions.length === 0 ? (
        <Text style={styles.noDataText}>No saved predictions available.</Text>
      ) : (
        <FlatList
          data={savedPredictions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#034B63']} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAEAEA',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2DAA9E',
    textAlign: 'center',
    marginBottom: 20,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#2DAA9E',
    textAlign: 'center',
    marginTop: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  predictionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2DAA9E',
    marginBottom: 12,
  },
  inputData: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  deleteButton: {
    backgroundColor: '#FF7F7F',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  refreshControl: {
    backgroundColor: '#EAEAEA',
  },
});

export default MySavedScreen;
