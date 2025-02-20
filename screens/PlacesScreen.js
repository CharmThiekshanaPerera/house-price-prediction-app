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
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  picker: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
  },
  searchButton: {
    backgroundColor: '#27ae60',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  resultItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  resultText: {
    fontSize: 16,
  },
});
