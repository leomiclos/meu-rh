import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Splash from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import CertificadosScreen from './src/screens/CertificateListScreen';
import InserirCertificadoScreen from './src/screens/UploadScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import NewEmployeeScreen from './src/screens/NewEmployeeScreen';
import EmployeeAreaScreen from './src/screens/EmployeeAreaScreen';
import UsersListScreen from './src/screens/UsersListScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';



const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CertificadosScreen" component={CertificadosScreen} />
        <Stack.Screen name="InserirCertificadoScreen" component={InserirCertificadoScreen} />
        <Stack.Screen name='ProfileScreen' component={ProfileScreen}/>
        <Stack.Screen name='NewEmployeeScreen' component={NewEmployeeScreen}/>
        <Stack.Screen name='EmployeeAreaScreen' component={EmployeeAreaScreen}/>
        <Stack.Screen name='UsersListScreen' component={UsersListScreen}/>
        <Stack.Screen name='EditProfileScreen' component={EditProfileScreen}/>

      </Stack.Navigator>
    </NavigationContainer>
  );
}
