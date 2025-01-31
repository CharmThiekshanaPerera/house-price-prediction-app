import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Results = ({ route, navigation }) => {
  const { price } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prediction Result</Text>
      <Text style={styles.resultText}>The predicted house price is:</Text>
      <Text style={styles.price}>${price}</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EBF2F5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#034B63',
    marginBottom: 20,
  },
  resultText: {
    fontSize: 18,
    color: '#034B63',
    marginBottom: 10,
  },
  price: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#034B63',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#034B63',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Results;
