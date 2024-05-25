import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { AddIntervention } from '../screens/AddIntervention';
import { LoginScreen } from '../screens/LoginScreen';
import { InterventionsList } from '../screens/InterventionsList';
import { InterventionDetail } from '../screens/InterventionDetail';
import { RegisterScreen } from '../screens/RegisterScreen';

export type RootStackParamDrawer = {
  LoginScreen: undefined;
  InterventionsList: undefined;
  AddIntervention: undefined;
  InterventionDetail: undefined;
  RegisterScreen: undefined;
};
const Drawer = createDrawerNavigator<RootStackParamDrawer>();

export const MenuLateral = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="InterventionsList" component={InterventionsList} />
      <Drawer.Screen name="LoginScreen" component={LoginScreen} />      
      <Drawer.Screen name="RegisterScreen" component={RegisterScreen} />      
      <Drawer.Screen name="AddIntervention" component={AddIntervention} />
      <Drawer.Screen name="InterventionDetail" component={InterventionDetail} />
    </Drawer.Navigator>
  );
}