// AppNavigator sets up the full navigation structure:
// - Auth stack: Login → Signup
// - Main tabs: Search (with movie detail nested inside) | Watchlist | AI Picks
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import SearchScreen from '../screens/SearchScreen';
import MovieDetailScreen from '../screens/MovieDetailScreen';
import WatchlistScreen from '../screens/WatchlistScreen';
import AIRecommendationsScreen from '../screens/AIRecommendationsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const SearchStack = createNativeStackNavigator();

// Search and MovieDetail share a stack so the detail screen slides in over search
function SearchNavigator() {
  return (
    <SearchStack.Navigator>
      <SearchStack.Screen name="SearchHome" component={SearchScreen} options={{ title: 'Search' }} />
      <SearchStack.Screen name="MovieDetail" component={MovieDetailScreen} options={{ title: 'Movie' }} />
    </SearchStack.Navigator>
  );
}

// Bottom tab bar shown after login
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
        component={WatchlistScreen}
        options={{
          tabBarIcon: ({ color, size }) => <FontAwesome name="film" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="AI"
        component={AIRecommendationsScreen}
        options={{
          title: 'AI Picks',
          tabBarIcon: ({ color, size }) => <FontAwesome5 name="brain" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
