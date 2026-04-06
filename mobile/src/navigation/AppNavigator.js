import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext } from '../context/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import StudentDashboardScreen from '../screens/StudentDashboardScreen';
import AddHealthRecordScreen from '../screens/AddHealthRecordScreen';
import ViewHealthRecordScreen from '../screens/ViewHealthRecordScreen';
import StaffDashboardScreen from '../screens/StaffDashboardScreen';
import StudentListScreen from '../screens/StudentListScreen';
import StudentHealthDetailsScreen from '../screens/StudentHealthDetailsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function StudentTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="StudentDashboard"
        component={StudentDashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen
        name="ViewHealthRecord"
        component={ViewHealthRecordScreen}
        options={{ title: 'My Record' }}
      />
      <Tab.Screen
        name="AddHealthRecord"
        component={AddHealthRecordScreen}
        options={{ title: 'Update Record' }}
      />
    </Tab.Navigator>
  );
}

function StaffTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="StaffDashboard"
        component={StaffDashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen
        name="StudentList"
        component={StudentListScreen}
        options={{ title: 'Students' }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user } = useContext(AuthContext);

  return (
    <NavigationContainer>
      {user ? (
        <Stack.Navigator>
          {user.role === 'student' ? (
            <Stack.Screen
              name="StudentTabs"
              component={StudentTabs}
              options={{ headerShown: false }}
            />
          ) : (
            <Stack.Screen
              name="StaffTabs"
              component={StaffTabs}
              options={{ headerShown: false }}
            />
          )}
          <Stack.Screen
            name="StudentHealthDetails"
            component={StudentHealthDetailsScreen}
            options={{ title: 'Student Details' }}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: 'Login' }}
          />
          <Stack.Screen
            name="Signup"
            component={SignupScreen}
            options={{ title: 'Signup' }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

