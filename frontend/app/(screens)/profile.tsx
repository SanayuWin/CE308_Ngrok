import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Profile Page</Text>
      <Button title="Go to Home" onPress={() => router.back()} />
    </View>
  );
}
