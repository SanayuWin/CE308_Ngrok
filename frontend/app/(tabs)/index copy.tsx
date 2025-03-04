import { useRouter } from 'expo-router';
import React, { useState, useCallback } from "react";
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput  } from "react-native";
import axios from "axios";
import Constants from 'expo-constants';
import { useFocusEffect } from '@react-navigation/native';

const API_URL = Constants.expoConfig?.extra?.API_URL;

export default function Index() {
  const router = useRouter();
  const [books, setBooks] = useState<any[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState<any>(null);

  // ใช้ useFocusEffect เพื่อดึงข้อมูลใหม่ทุกครั้งที่หน้า index ถูกแสดง
  useFocusEffect(
    useCallback(() => {
      // ดึงข้อมูลจาก API ทุกครั้งที่หน้า index ถูกแสดง
      axios
        .get(API_URL + "/books")
        .then((response) => setBooks(response.data))
        .catch((error) => console.error(error));
    }, [])
  );

  // ฟังก์ชันสำหรับลบหนังสือ
  const handleDelete = (id: string) => {
    axios
      .delete(`${API_URL}/books/${id}`)
      .then(() => {
        // เมื่อการลบสำเร็จ ให้ลบข้อมูลจาก state
        setBooks((prevBooks) => prevBooks.filter(book => book.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting book: ", error);
      });
  };

   // ฟังก์ชันเปิด modal เพื่อแก้ไขข้อมูล
   const handleEdit = (book: any) => {
    setSelectedBook(book);
    setModalVisible(true);
  };

  // ฟังก์ชันปิด modal
  const closeModal = () => {
    setModalVisible(false);
    setSelectedBook(null);
  };

  const handleUpdate = () => {
    if (selectedBook) {
      // การเตรียมข้อมูลที่จะส่งไปยัง API
      const updatedBook = {
        title: selectedBook.title,
        author: selectedBook.author,
        description: selectedBook.description,
        price: Number(selectedBook.price),
      };
  
      // ส่งคำขอ PUT ไปที่ API เพื่ออัพเดทข้อมูลหนังสือ
      axios.put(`${API_URL}/books/${selectedBook.id}`, updatedBook)
        .then(() => {
          // ปิด modal และอัพเดทข้อมูลใน state
          closeModal();
          setBooks((prevBooks) => prevBooks.map(book => book.id === selectedBook.id ? selectedBook : book));
        })
        .catch((error) => {
          console.error("Error updating book: ", error.response?.data || error.message);
        });
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
        <View style={{ marginBottom: 10, padding: 10, borderWidth: 1 }}>
          <Text>Title: {item.title}</Text>
          <Text>Author: {item.author}</Text>
          <Text>Description: {item.description}</Text>
          <Text>Price: {item.price}</Text>
          <TouchableOpacity 
              style={styles.editButton} 
              onPress={() => handleEdit(item)}
            >
              <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity 
              style={styles.deleteButton} 
              onPress={() => handleDelete(item.id)}
            >
              <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
        )}
      />
      <Button title="Go to Profile" onPress={() => router.push('/(screens)/profile')} />

       {/* Modal สำหรับการแก้ไขข้อมูล */}
       <Modal
        visible={isModalVisible}
        onRequestClose={closeModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text>Edit Book</Text>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={selectedBook?.title}
              onChangeText={(text) => setSelectedBook((prev) => ({ ...prev, title: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Author"
              value={selectedBook?.author}
              onChangeText={(text) => setSelectedBook((prev) => ({ ...prev, author: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={selectedBook?.description}
              onChangeText={(text) => setSelectedBook((prev) => ({ ...prev, description: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Price"
              value={selectedBook?.price?.toString()}
              onChangeText={(text) => setSelectedBook((prev) => ({ ...prev, price: text }))}
              keyboardType="numeric"
            />
            <Button title="Save Changes" onPress={handleUpdate} />
            <Button title="Cancel" onPress={closeModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c9fffb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
  buttonText: {
    color: '#fff',
  },
  editButton: {
    backgroundColor: '#4caf50',
    padding: 5,
    marginTop: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    padding: 5,
    marginTop: 10,
    borderRadius: 5,
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});
