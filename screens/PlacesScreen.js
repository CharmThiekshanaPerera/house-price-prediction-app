import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import houseData from '../components/houseData.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PlacesScreen() {
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState('');
  const [savedPredictions, setSavedPredictions] = useState([]);

  useEffect(() => {
    fetchSavedPredictions();
  }, []);

  const fetchSavedPredictions = async () => {
    try {
      const data = await AsyncStorage.getItem('savedPredictions');
      if (data !== null) {
        setSavedPredictions(JSON.parse(data));
      }
    } catch (error) {
      console.error('Failed to fetch saved predictions', error);
    }
  };

  const handleSearch = () => {
    const filtered = houseData.filter((house) => {
      const priceDifference = Math.abs(parseFloat(house.price) - parseFloat(selectedPrice));
      return (
        (!searchText || house.province.toLowerCase().includes(searchText.toLowerCase())) &&
        (!selectedPrice || priceDifference <= 5000000) // Allow price difference within 5 million
      );
    });
    setFilteredData(filtered);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Nearby Houses</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Province"
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />

      <Picker
        selectedValue={selectedPrice}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedPrice(itemValue)}
      >
        <Picker.Item label="Select Predicted Price" value="" />
        {savedPredictions.map((item, index) => (
          <Picker.Item
            key={index}
            label={`Rs. ${item.prediction}`}
            value={item.prediction}
          />
        ))}
      </Picker>

      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>

      <FlatList
        data={filteredData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.resultItem}>
            <Text style={styles.resultText}>Province: {item.province}</Text>
            <Text style={styles.resultText}>Price: Rs. {item.price}</Text>
            <Text style={styles.resultText}>Bedrooms: {item.bedrooms}</Text>
            <Text style={styles.resultText}>Bathrooms: {item.real_bathrooms}</Text>
          </View>
        )}
      />
    </View>
  );
}

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
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E3D2C3',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  picker: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E3D2C3',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#2DAA9E',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  resultItem: {
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
  resultText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
});

