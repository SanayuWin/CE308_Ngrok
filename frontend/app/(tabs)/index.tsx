import { useRouter } from 'expo-router';
import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import axios from "axios";


export default function Index() {
  const router = useRouter();
  const [books, setBooks] = useState<any[]>([]);

  useEffect(() => {
      axios
      .get("http://10.0.2.2:5000/api/books")
          .then((response) => setBooks(response.data))
          .catch((error) => console.error(error));
  }, []);


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
        </View>
        )}
      />
      <Button title="Go to Setting" onPress={() => router.push('/(screens)/profile')} />;
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
});
