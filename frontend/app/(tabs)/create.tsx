import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.API_URL;

export default function CreateScreen() {
  const [book, setBook] = useState({
    title: "",
    author: "",
    description: "",
    price: ""
  });

  const handleChange = (key: string, value: string) => {
    setBook({ ...book, [key]: value });
  };

  const handleSubmit = async () => {
    if (!book.title || !book.author || !book.description || !book.price) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      const response = await axios.post(API_URL+"/books", {
        title: book.title,
        author: book.author,
        description: book.description,
        price: parseFloat(book.price) // แปลงเป็นตัวเลข
      });

      Alert.alert("Success", "Book created successfully!");
      setBook({ title: "", author: "", description: "", price: "" }); // รีเซ็ตฟอร์ม
    } catch (error) {
      console.error("API Error:", error);
      Alert.alert("Error", "Failed to create book.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create a New Book</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={book.title}
        onChangeText={(text) => handleChange("title", text)}
        keyboardType="default"
      />
      <TextInput
        style={styles.input}
        placeholder="Author"
        value={book.author}
        onChangeText={(text) => handleChange("author", text)}
        keyboardType="default"
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={book.description}
        onChangeText={(text) => handleChange("description", text)}
        keyboardType="default"
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        keyboardType="numeric"
        value={book.price}
        onChangeText={(text) => handleChange("price", text)}
      />
      <Button title="Create Book" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c9fffb',
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#333',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  }
});
