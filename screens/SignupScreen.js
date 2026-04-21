// SignupScreen
// - Creates a new account via POST /auth/signup.
// - On success, stores the returned JWT in AuthContext which causes
//   AppNavigator to switch to MainTabs automatically.

import { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AuthForm from '../components/AuthForm';
import authApi from '../api/authApi';
import { useAuth } from '../context/AuthContext';

export default function SignupScreen({ navigation }) {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  async function handleSignup(username, password) {
    if (!username.trim() || !password) {
      return Alert.alert('Validation', 'Username and password are required');
    }
    setLoading(true);
    try {
      const data = await authApi.signup(username.trim(), password);
      // signup returns a JWT just like login — store it to skip the auth stack.
      await login(data.token);
    } catch (err) {
      Alert.alert('Signup failed', String(err.message ?? err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthForm
      title="Create Account"
      submitLabel="Sign Up"
      loading={loading}
      onSubmit={handleSignup}
      footer={
        <View>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>
              Already have an account? <Text style={styles.linkBold}>Log in</Text>
            </Text>
          </TouchableOpacity>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  link: { color: '#888', textAlign: 'center', fontSize: 14 },
  linkBold: { color: '#fff', fontWeight: '600' },
});
