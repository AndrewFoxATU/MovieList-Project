import { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useAuth } from '../context/AuthContext';
import profileApi from '../api/profileApi';

export default function ProfileScreen() {
  const { logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [uploading, setUploading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

  async function fetchProfile() {
    setLoadingProfile(true);
    try {
      const data = await profileApi.getProfile();
      setProfile(data);
    } catch (err) {
      if (err.message) {
        Alert.alert('Error', String(err.message));
      } else {
        Alert.alert('Error', String(err));
      }
    } finally {
      setLoadingProfile(false);
    }
  }

  async function handlePickPhoto() {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Allow photo library access to set a profile photo.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.6,
        base64: true,
      });
      if (!result.canceled) {
        if (result.assets && result.assets[0] && result.assets[0].base64) {
          await uploadPhoto(`data:image/jpeg;base64,${result.assets[0].base64}`);
        }
      }
    } catch (err) {
      if (err.message) {
        Alert.alert('Error', String(err.message));
      } else {
        Alert.alert('Error', String(err));
      }
    }
  }

  async function handleTakePhoto() {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Allow camera access to take a profile photo.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.6,
        base64: true,
      });
      if (!result.canceled) {
        if (result.assets && result.assets[0] && result.assets[0].base64) {
          await uploadPhoto(`data:image/jpeg;base64,${result.assets[0].base64}`);
        }
      }
    } catch (err) {
      if (err.message) {
        Alert.alert('Error', String(err.message));
      } else {
        Alert.alert('Error', String(err));
      }
    }
  }

  async function uploadPhoto(base64Image) {
    setUploading(true);
    try {
      const data = await profileApi.uploadProfilePhoto(base64Image);
      setProfile(prev => ({ ...prev, photoUrl: data.photoUrl }));
    } catch (err) {
      if (err.message) {
        Alert.alert('Upload failed', String(err.message));
      } else {
        Alert.alert('Upload failed', String(err));
      }
    } finally {
      setUploading(false);
    }
  }

  function handlePhotoPress() {
    Alert.alert('Profile Photo', 'Choose an option', [
      { text: 'Take Photo', onPress: handleTakePhoto },
      { text: 'Choose from Library', onPress: handlePickPhoto },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }

  function handleSignOut() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  }

  if (loadingProfile) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#e50914" />
      </View>
    );
  }

  let photoUrl = null;
  if (profile && profile.photoUrl) {
    photoUrl = profile.photoUrl;
  }

  let username = '—';
  if (profile && profile.username) {
    username = profile.username;
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatarSection}>
        <TouchableOpacity onPress={handlePhotoPress} disabled={uploading} style={styles.avatarWrapper}>
          {photoUrl ? (
            <Image source={{ uri: photoUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <FontAwesome name="user" size={48} color="#555" />
            </View>
          )}
          <View style={styles.editBadge}>
            {uploading
              ? <ActivityIndicator size="small" color="#fff" />
              : <FontAwesome name="camera" size={12} color="#fff" />
            }
          </View>
        </TouchableOpacity>

        <Text style={styles.username}>{username}</Text>
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <FontAwesome name="sign-out" size={16} color="#fff" />
        <Text style={styles.signOutText}>  Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 24 },
  centered: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' },
  avatarSection: { alignItems: 'center', marginTop: 40, marginBottom: 48 },
  avatarWrapper: { position: 'relative', marginBottom: 16 },
  avatar: { width: 110, height: 110, borderRadius: 55, borderWidth: 2, borderColor: '#e50914' },
  avatarPlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#1e1e1e',
    borderWidth: 2,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#e50914',
    borderRadius: 12,
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: { color: '#fff', fontSize: 20, fontWeight: '700' },
  signOutButton: {
    flexDirection: 'row',
    backgroundColor: '#1e1e1e',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
