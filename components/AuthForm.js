// AuthForm
// - Purpose: Shared presentational form for both Login and Signup screens.
//   The two screens used to be nearly identical - this component removes the
//   duplication while keeping the dark theme.
// - Props:
//    - title: header text ("MovieList" / "Create Account")
//    - submitLabel: primary button label ("Log In" / "Sign Up")
//    - loading: show an ActivityIndicator instead of the primary button
//    - onSubmit(username, password): called when the primary button is pressed
//    - footer: optional node rendered below the form (e.g. the "Sign up" link)

import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

export default function AuthForm({ title, submitLabel, loading, onSubmit, footer }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

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

      {loading ? (
        <ActivityIndicator color="#e50914" style={{ marginVertical: 14 }} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={() => onSubmit(username, password)}>
          <Text style={styles.buttonText}>{submitLabel}</Text>
        </TouchableOpacity>
      )}

      {footer}
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
});
