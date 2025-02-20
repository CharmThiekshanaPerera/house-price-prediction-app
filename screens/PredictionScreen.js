import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, ScrollView, Modal, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const PredictScreen = ({ navigation }) => {
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
  const [modalVisible, setModalVisible] = useState(false);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handlePredict = async () => {
    try {
      const response = await axios.post('http://192.168.8.143:5000/predict', formData, {
        headers: { 'Content-Type': 'application/json' }
      });
      setPrediction(response.data.prediction);
      setModalVisible(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch prediction');
      console.error(error);
    }
  };

  const handleSave = async () => {
    try {
      const savedData = {
        prediction,
        ...formData,
      };
      const existingData = await AsyncStorage.getItem('savedPredictions');
      const updatedData = existingData ? [...JSON.parse(existingData), savedData] : [savedData];
      await AsyncStorage.setItem('savedPredictions', JSON.stringify(updatedData));
      setModalVisible(false);
      Alert.alert('Success', 'Prediction saved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save data');
      console.error(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <Text style={styles.title}>Predict House Price</Text>
        {Object.keys(formData).map((key) => (
          <View key={key} style={styles.inputContainer}>
            <Text style={styles.label}>{key.replace(/_/g, ' ').toUpperCase()}</Text>
            <TextInput
              style={styles.input}
              placeholder={`Enter ${key.replace(/_/g, ' ')}`}
              value={formData[key]}
              onChangeText={(text) => handleInputChange(key, text)}
              keyboardType="numeric"
            />
          </View>
        ))}
        <Button title="Predict Price" onPress={handlePredict} />

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Predicted Price</Text>
              {prediction && (
                <Text style={styles.result}>Rs. {prediction.toFixed(0)}.00/=</Text>
              )}
              <Text style={styles.modalSubtitle}>Summary of Input Data:</Text>
              {Object.entries(formData).map(([key, value]) => (
                <Text key={key} style={styles.modalText}>{`${key.replace(/_/g, ' ')}: ${value}`}</Text>
              ))}
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#034B63',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#034B63',
  },
  modalSubtitle: {
    fontSize: 18,
    marginTop: 10,
    color: '#555',
  },
  modalText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'left',
  },
  result: {
    fontSize: 20,
    color: '#27ae60',
    marginVertical: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#27ae60',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  closeButton: {
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default PredictScreen;
