// screens/HomeScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import articles from '../components/articles.json';

export default function HomeScreen({ navigation }) {
  const renderArticle = ({ item }) => (
    <View style={styles.articleContainer}>
      <Image source={{ uri: item.image }} style={styles.articleImage} />
      <Text style={styles.articleTitle}>{item.title}</Text>
      <Text style={styles.articleContent}>{item.content}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.navigate('User')} style={styles.userIcon}>
          <Ionicons name="person-circle" size={40} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>House Price Prediction</Text>
      </View>

      <Text style={styles.text}>Use the prediction page to estimate house prices!</Text>

      <FlatList
        data={articles}
        renderItem={renderArticle}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.articleList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#034B63',
    padding: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    margin: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  userIcon: {
    padding: 5,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
    color: '#333',
  },
  articleList: {
    padding: 10,
  },
  articleContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  articleImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#034B63',
    marginBottom: 5,
  },
  articleContent: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
});
