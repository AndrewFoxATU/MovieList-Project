// LoginScreen — lets the user log in or skip straight to the app for testing.
// Auth logic (SQLite user lookup) will be added here when the DB is wired up.
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function handleLogin() {
    // TODO: check credentials against SQLite before navigating
    navigation.replace('Main');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MovieList</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#888"
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.link}>
          Don't have an account? <Text style={styles.linkBold}>Sign up</Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.skipButton} onPress={() => navigation.replace('Main')}>
        <Text style={styles.skipText}>Skip (Test)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', padding: 24 },
  title: { fontSize: 36, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 40 },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  button: {
    backgroundColor: '#e50914',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 4,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  link: { color: '#888', textAlign: 'center', fontSize: 14 },
  linkBold: { color: '#fff', fontWeight: '600' },
  skipButton: { marginTop: 20, alignItems: 'center' },
  skipText: { color: '#555', fontSize: 13 },
});
