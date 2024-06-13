import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Button, Alert, Touchable, TouchableHighlight } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as localAuthentication from'expo-local-authentication'
 
export default function App() {

  const [isbiometricSupported, setIsBiometricSupported] = useState(false);

  // for face detetction or fingerprint scanning
  useEffect(() => {
    (async () => {
      const compatible = await localAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    })();
  });

  const fallBackToDefualtAuth = () => {
    console.log('fall back to password authentication');
  };

  const alertComponent = (title, mess, btntxt, btnFunc) => {
    return Alert.alert(title, mess, [
      {
        text: btntxt,
        onPress: btnFunc,
      }
    ]);
  };

  const TwoButtonAlert = () => 
    Alert.alert('Arcon App', 'Welcome to the homepage', [
      {
        text: 'Back',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel'
      },
      {
        text: 'OK', onPress: () => console.log('Ok Pressed')
      },
    ]);

    const handleBiometricAuth = async () => {
      // check if hardware supports biometric
      const isBiometricAvailable = await localAuthentication.hasHardwareAsync();

      // fall back to default authentication method (password) if biometric is not available
      if (!isBiometricAvailable)
        return alertComponent(
        'Please Enter Your Password',
        'Biometric Auth not Supported',
        'Ok',
        () => fallBackToDefaultAuth()
      );

      // check biometric types available (fingerprint, facial recognition)
      let supportedBiometrics;
      if (isBiometricAvailable)
        supportedBiometrics = await localAuthentication.supportedAuthenticationTypesAsync()

      //check biometrics are saved locally in user's device
      const savedBiometrics = await localAuthentication.isEnrolledAsync();
      if (!savedBiometrics)
        return alertComponent(
          'Biometric record not found',
        'Please Login With Password',
        'Ok',
        () => fallBackToDefaultAuth()
        );
    
        // authenticate with biometric
        const biometricAuth = await localAuthentication.authenticateAsync({
          promptMessage: 'login With Biometrics',
          canceLabel: 'cancel',
          disableDeviceFallback:true,
        });

        //Log the user in on success
        if (biometricAuth) {TwoButtonAlert()};
        console.log({isBiometricAvailable});
        console.log({supportedBiometrics});
        console.log({savedBiometrics});
        console.log({biometricAuth});
    };

  return (
    <SafeAreaView>
      <View style={style.container}>
        <Text>
          {isbiometricSupported
          ? 'Your Device Is Compatible With Biometrics'
          : 'Face or Fingerprint scanner is availableon this device'}
        </Text>
        <TouchableHighlight
        style={{
          height:60,
          marginTop:200
        }}
        >
          <Button 
            title='Login With Biometrics'
            color='black'
            onPress={handleBiometricAuth}
          />
        </TouchableHighlight>
        <StatusBAr style='auto' />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
});