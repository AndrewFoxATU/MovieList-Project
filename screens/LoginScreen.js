// LoginScreen
// - Purpose: Signs an existing user in. POSTs to /auth/login, stores the
//   returned JWT via AuthContext, which flips AppNavigator to the main tabs.

import { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AuthForm from '../components/AuthForm';
import authApi from '../api/authApi';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  async function handleLogin(username, password) {
    if (!username.trim() || !password) {
      return Alert.alert('Validation', 'Username and password are required');
    }
    setLoading(true);
    try {
      const data = await authApi.login(username.trim(), password);
      await login(data.token);
    } catch (err) {
      Alert.alert('Login failed', String(err.message ?? err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthForm
      title="MovieList"
      submitLabel="Log In"
      loading={loading}
      onSubmit={handleLogin}
      footer={
        <View>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.link}>
              Don't have an account? <Text style={styles.linkBold}>Sign up</Text>
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
