import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import PredictionScreen from '../screens/PredictionScreen';
import MySavedScreen from '../screens/MySavedScreen';
import PlacesScreen from '../screens/PlacesScreen';
import Results from '../screens/Results';

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="PredictionScreen"
        screenOptions={{
          headerStyle: { backgroundColor: '#034B63' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen
          name="PredictionScreen"
          component={PredictionScreen}
          options={{ title: 'House Price Predictor' }}
        />
        <Stack.Screen
          name="Results"
          component={Results}
          options={{ title: 'Prediction Result' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
