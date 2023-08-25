import { StyleSheet } from 'react-native';
import Start from './components/Start';
import Chat from './components/Chat';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeApp } from "firebase/app";
import { initializeFirestore, disableNetwork, enableNetwork } from "firebase/firestore";
import { useEffect } from 'react';
import { useNetInfo } from '@react-native-community/netinfo';

// Creates the navigator
const Stack = createNativeStackNavigator();

const App = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyA-ZBDvdpk1t3lSnm5rSlevXaORjuuA1Xs",
    authDomain: "chatty-d9efb.firebaseapp.com",
    projectId: "chatty-d9efb",
    storageBucket: "chatty-d9efb.appspot.com",
    messagingSenderId: "1007810416831",
    appId: "1:1007810416831:web:0648dc93924e0d709d360a"
  };

  const app = initializeApp(firebaseConfig);

  const db = initializeFirestore(app, {
    experimentalForceLongPolling: true
  });

  const connectionStatus = useNetInfo();

  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection lost!")
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Start"
      >
        <Stack.Screen
          name="Start">
          {props => <Start isConnected={connectionStatus.isConnected} {...props} />}
        </Stack.Screen>
        <Stack.Screen
          name="Chat">
          {props => <Chat db={db} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;