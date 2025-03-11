import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, ScrollView, Modal, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

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
  const [instructionModal, setInstructionModal] = useState(false);
  const [featuresModal, setFeaturesModal] = useState(false);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handlePredict = async () => {
    try {
      const response = await axios.post('http://192.168.8.143:5000/predict', formData, {
        headers: { 'Content-Type': 'application/json' }
      });
      const adjustedPrediction = response.data.prediction * 100;
      setPrediction(adjustedPrediction);
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
      <View style={styles.header}>
        <Text style={styles.title}>Predict House Price</Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => setInstructionModal(true)}>
            <Ionicons name="information-circle-outline" size={28} color="#1E90FF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFeaturesModal(true)}>
            <Ionicons name="bulb-outline" size={28} color="#FFD700" style={styles.iconSpacing} />
          </TouchableOpacity>
        </View>
      </View>

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

      <TouchableOpacity style={styles.predictButton} onPress={handlePredict}>
        <Text style={styles.buttonText}>Predict Price</Text>
      </TouchableOpacity>

      {/* Prediction Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Predicted Price</Text>
            {prediction && <Text style={styles.result}>Rs. {prediction.toFixed(0)}.00/=</Text>}
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

      {/* Instructions Modal */}
      <Modal animationType="slide" transparent={true} visible={instructionModal} onRequestClose={() => setInstructionModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>How to Use</Text>
            <Text style={styles.modalText}>1. Fill in all required fields with accurate data.</Text>
            <Text style={styles.modalText}>2. Use numeric values (e.g., 1 for Yes, 0 for No).</Text>
            <Text style={styles.modalText}>3. Tap 'Predict Price' to get the estimated value.</Text>
            <Text style={styles.modalText}>4. Save the prediction for future reference if needed.</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setInstructionModal(false)}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Features Modal */}
      <Modal animationType="slide" transparent={true} visible={featuresModal} onRequestClose={() => setFeaturesModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Features Explained</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              <Text style={styles.modalText}>• <Text style={styles.bold}>Number of Bedrooms:</Text> Total bedrooms in the house.</Text>
              <Text style={styles.modalText}>• <Text style={styles.bold}>Grade:</Text> Overall construction quality and design grade.</Text>
              <Text style={styles.modalText}>• <Text style={styles.bold}>Has Basement:</Text> 1 for Yes, 0 for No.</Text>
              <Text style={styles.modalText}>• <Text style={styles.bold}>Living Area (in m²):</Text> Total living area in square meters.</Text>
              <Text style={styles.modalText}>• <Text style={styles.bold}>Renovated:</Text> 1 for Yes, 0 for No.</Text>
              <Text style={styles.modalText}>• <Text style={styles.bold}>Nice View:</Text> 1 for Yes, 0 for No.</Text>
              <Text style={styles.modalText}>• <Text style={styles.bold}>Perfect Condition:</Text> 1 for Yes, 0 for No.</Text>
              <Text style={styles.modalText}>• <Text style={styles.bold}>Number of Bathrooms:</Text> Total number of bathrooms.</Text>
              <Text style={styles.modalText}>• <Text style={styles.bold}>Has Lavatory:</Text> 1 for Yes, 0 for No.</Text>
              <Text style={styles.modalText}>• <Text style={styles.bold}>Single Floor:</Text> 1 for Yes, 0 for No.</Text>
              <Text style={styles.modalText}>• <Text style={styles.bold}>Month:</Text> Month when the house was listed.</Text>
              <Text style={styles.modalText}>• <Text style={styles.bold}>Quartile Zone:</Text> Zone classification based on location.</Text>
              <Text style={styles.modalText}>• <Text style={styles.bold}>Year:</Text> The year the house was built.</Text>
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={() => setFeaturesModal(false)}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#EAEAEA',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2DAA9E',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSpacing: {
    marginLeft: 15,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2DAA9E',
    marginBottom: 8,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  predictButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#2DAA9E',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2DAA9E',
    marginBottom: 16,
    textAlign: 'center',
  },
  result: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#66D2CE',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2DAA9E',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    flex: 1,
    height: 40,
    backgroundColor: '#2DAA9E',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  closeButton: {
    flex: 1,
    height: 40,
    backgroundColor: '#E3D2C3',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PredictScreen;