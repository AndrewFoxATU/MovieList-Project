// AuthForm
// - Purpose: Shared form used by both LoginScreen and SignupScreen.
//   Both screens were nearly identical so this component removes the duplication.
// - Props:
//    - title: heading text ("MovieList" / "Create Account")
//    - submitLabel: button label ("Log In" / "Sign Up")
//    - loading: shows a spinner instead of the button while the API call is in flight
//    - onSubmit(username, password): called when the button is pressed
//    - footer: optional element below the form (e.g. the "Sign up" / "Log in" link)

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
  // Username and password are kept as local state — no need to lift them up
  // since only this form ever reads them.
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
      {/* secureTextEntry hides the password characters on screen */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Replace the button with a spinner while the login/signup request is pending */}
      {loading ? (
        <ActivityIndicator color="#e50914" style={{ marginVertical: 14 }} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={() => onSubmit(username, password)}>
          <Text style={styles.buttonText}>{submitLabel}</Text>
        </TouchableOpacity>
      )}

      {/* Footer slot — LoginScreen passes a "Sign up" link, SignupScreen passes a "Log in" link */}
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
