import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, ScrollView } from 'react-native';
import axios from 'axios';

const PredictScreen = () => {
  const [formData, setFormData] = useState({
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

  const [prediction, setPrediction] = useState(null);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handlePredict = async () => {
    try {
      const response = await axios.post('http://10.155.2.16:5000/predict', formData);
      setPrediction(response.data.prediction);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch prediction');
      console.error(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Predict House Price</Text>
        {Object.keys(formData).map((key) => (
          <TextInput
            key={key}
            style={styles.input}
            placeholder={key.replace(/_/g, ' ')}
            value={formData[key]}
            onChangeText={(text) => handleInputChange(key, text)}
            keyboardType="numeric"
          />
        ))}
        <Button title="Predict Price" onPress={handlePredict} />
        {prediction && (
          <Text style={styles.result}>Predicted Price: ${prediction.toFixed(2)}</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  result: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PredictScreen;
