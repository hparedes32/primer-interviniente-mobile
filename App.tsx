import 'react-native-gesture-handler';
import { SafeAreaView, StyleSheet, Platform, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import {Navigator} from './navigation/Navigator';
import { MenuLateral } from './navigation/MenuLateral';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const AppState = ({ children }: any ) => {
    return (
      <AuthProvider>
        
         { children }
        
      </AuthProvider>
    )
  }

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaView style={styles.AndroidSafeArea}>
        <NavigationContainer>
          <AppState>
            <Navigator />
          </AppState>
        </NavigationContainer>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  }
});