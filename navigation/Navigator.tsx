import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { AuthContext } from '../context/AuthContext';

import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { LoadingScreen } from '../screens/LoadingScreen';
import { InterventionsList } from '../screens/InterventionsList';
import { AddIntervention } from '../screens/AddIntervention';
import { InterventionDetail } from '../screens/InterventionDetail';


const Stack = createStackNavigator();

export const Navigator = () => {

  const { status } = useContext( AuthContext );
  console.log(status)

  //if ( status === 'checking' ) return <LoadingScreen />

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: 'white'
        }
      }}
    >

      {
        (status !== 'authenticated') 
          ? (
            <>
              <Stack.Screen name="LoginScreen" component={ LoginScreen } />
              <Stack.Screen name="RegisterScreen" component={ RegisterScreen } />
            </>
          )
          : (
            <>
              <Stack.Screen name="InterventionsList" component={ InterventionsList } />
              <Stack.Screen name="AddIntervention" component={ AddIntervention } />
              <Stack.Screen name="InterventionDetail" component={ InterventionDetail } />
            </>
          )
      }

    </Stack.Navigator>
  );
}