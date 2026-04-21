import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import SearchScreen from '../screens/SearchScreen';
import MovieDetailScreen from '../screens/MovieDetailScreen';
import WatchlistScreen from '../screens/WatchlistScreen';
import ProfileScreen from '../screens/ProfileScreen';

const AuthStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const SearchStack = createNativeStackNavigator();
const WatchlistStack = createNativeStackNavigator();

// Shared dark header style applied to all stack screens.
const darkHeader = {
  headerStyle: { backgroundColor: '#121212' },
  headerTintColor: '#fff',
  headerShadowVisible: false,
};

// SearchScreen and MovieDetailScreen share a stack so tapping a movie
// slides the detail screen over the search list without leaving the tab.
function SearchNavigator() {
  return (
    <SearchStack.Navigator screenOptions={darkHeader}>
      <SearchStack.Screen name="SearchHome" component={SearchScreen} options={{ title: 'Search' }} />
      <SearchStack.Screen name="MovieDetail" component={MovieDetailScreen} options={{ title: 'Movie' }} />
    </SearchStack.Navigator>
  );
}

// Same pattern for Watchlist — tapping a saved movie opens the same detail screen.
function WatchlistNavigator() {
  return (
    <WatchlistStack.Navigator screenOptions={darkHeader}>
      <WatchlistStack.Screen name="WatchlistHome" component={WatchlistScreen} options={{ title: 'Watchlist' }} />
      <WatchlistStack.Screen name="MovieDetail" component={MovieDetailScreen} options={{ title: 'Movie' }} />
    </WatchlistStack.Navigator>
  );
}

// The three main tabs shown to authenticated users.
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: '#121212', borderTopColor: '#333' },
        tabBarActiveTintColor: '#e50914',
        tabBarInactiveTintColor: '#888',
        headerStyle: { backgroundColor: '#121212' },
        headerTintColor: '#fff',
      }}
    >
      <Tab.Screen
        name="Search"
        component={SearchNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => <FontAwesome name="search" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Watchlist"
        component={WatchlistNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => <FontAwesome name="film" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <FontAwesome name="user" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

// Login and Signup screens — shown when no token exists.
function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  );
}

export default function AppNavigator() {
  const { token, loading } = useAuth();

  // Wait for AuthContext to restore the token from SecureStore before rendering.
  // Without this, the app would flash the Login screen on every launch.
  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#e50914" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {/* Token gate: authenticated users see MainTabs, everyone else sees Login/Signup */}
      {token ? <MainTabs /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
