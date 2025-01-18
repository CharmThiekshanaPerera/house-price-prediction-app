import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import axios from 'axios';

export default function PredictionScreen() {
  const [inputs, setInputs] = useState({
    bedrooms: '',
    grade: '',
    has_basement: '',
    living_in_m2: '',
    renovated: '',
    nice_view: '',
    perfect_condition: '',
    real_bathrooms: '',
    has_lavatory: '',
    single_floor: '',
    month: '',
    quartile_zone: '',
    year: '',
  });
  const [result, setResult] = useState(null);

  const handleInputChange = (key, value) => {
    setInputs({ ...inputs, [key]: value });
  };

  const predictPrice = async () => {
    const requestData = {
      bedrooms: parseInt(inputs.bedrooms),
      grade: parseInt(inputs.grade),
      has_basement: parseInt(inputs.has_basement),
      living_in_m2: parseFloat(inputs.living_in_m2),
      renovated: parseInt(inputs.renovated),
      nice_view: parseInt(inputs.nice_view),
      perfect_condition: parseInt(inputs.perfect_condition),
      real_bathrooms: parseInt(inputs.real_bathrooms),
      has_lavatory: parseInt(inputs.has_lavatory),
      single_floor: parseInt(inputs.single_floor),
      month: parseInt(inputs.month),
      quartile_zone: parseInt(inputs.quartile_zone),
      year: parseInt(inputs.year),
    };

    console.log('Request Data:', requestData); // Log the data being sent to the backend

    try {
      const response = await axios.post('http://10.223.177.183:5000/predict', requestData);

      console.log('Server Response:', response.data); // Log the response from the server

      setResult(response.data.price);
    } catch (error) {
      console.error('Error fetching prediction:', error); // Log the error for debugging
      Alert.alert('Error', 'Failed to fetch prediction');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Enter House Details</Text>
        {Object.keys(inputs).map((key) => (
          <View key={key} style={styles.inputContainer}>
            <Text style={styles.label}>{key.replace('_', ' ').toUpperCase()}:</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={inputs[key]}
              onChangeText={(value) => handleInputChange(key, value)}
            />
          </View>
        ))}
        <Button title="Predict" onPress={predictPrice} />
        {result !== null && <Text style={styles.result}>Predicted Price: ${result}</Text>}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  result: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
    textAlign: 'center',
  },
});
