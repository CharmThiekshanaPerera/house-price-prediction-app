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
      {/* <TouchableOpacity onPress={() => navigation.navigate('User')} style={styles.userIcon}>
        <Ionicons name="person-circle" size={40} color="#fff" />
      </TouchableOpacity> */}
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
    backgroundColor: '#EAEAEA',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    backgroundColor: '#2DAA9E',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: '#2DAA9E',
    textAlign: 'center',
    marginBottom: 24,
  },
  articleList: {
    paddingBottom: 20,
  },
  articleContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  articleImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2DAA9E',
    marginBottom: 8,
  },
  articleContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  userIcon: {
    position: 'absolute',
    left: 16,
  },
});

