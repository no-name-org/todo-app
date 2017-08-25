import React from 'react';
import { AuthStack } from './config/routes';
import {View, Text, AsyncStorage, ToastAndroid} from 'react-native';

const App = () => {
  let userId = '0';
  AsyncStorage.getItem("userId").then((value) => {
    userId = value
  }).done();
  ToastAndroid.show(userId, ToastAndroid.SHORT);

  if (parseInt(userId) != 0) {
    console.log("Logged in");
  }
  return <AuthStack />;
};

export default App;
