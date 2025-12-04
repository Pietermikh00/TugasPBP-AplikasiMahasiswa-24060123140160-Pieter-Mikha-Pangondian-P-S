/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { enableScreens } from 'react-native-screens'

import { cekStatusLogin } from './src/utils/storage'
import auth from '@react-native-firebase/auth'
import LoginScreen from './src/screens/LoginScreen'
import RegisterScreen from './src/screens/RegisterScreen'
import DaftarMahasiswaScreen from './src/screens/DaftarMahasiswaScreen'
import TambahMahasiswaScreen from './src/screens/TambahMahasiswaScreen'
import DetailMahasiswaScreen from './src/screens/DetailMahasiswaScreen'
import { warna } from './src/utils/theme'
import { Grad } from './src/utils/gradient'

enableScreens()

const Stack = createNativeStackNavigator()

const App = () => {
  const [sedangCek, setSedangCek] = useState(true)
  const [sudahLogin, setSudahLogin] = useState(false)

  useEffect(() => {
    try {
      const status = cekStatusLogin()
      setSudahLogin(!!status)
    } catch (err) {
    } finally {
      setSedangCek(false)
    }
  }, [])

  useEffect(() => {
    const unsub = auth().onAuthStateChanged((user) => {
      setSudahLogin(!!user)
    })
    return unsub
  }, [])

  if (sedangCek) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    )
  }

  return (
    <NavigationContainer>
      {sudahLogin ? (
        <Stack.Navigator
          screenOptions={{
            headerBackground: () => (
              <Grad style={{ flex: 1 }} colors={[warna.primaryDark, warna.primary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
            ),
            headerTintColor: '#fff',
            contentStyle: { backgroundColor: warna.background },
            headerShadowVisible: false,
          }}
        >
          <Stack.Screen name="DaftarMahasiswa" component={DaftarMahasiswaScreen} options={{ title: 'Daftar Mahasiswa' }} />
          <Stack.Screen name="TambahMahasiswa" component={TambahMahasiswaScreen} options={{ title: 'Tambah Mahasiswa' }} />
          <Stack.Screen name="DetailMahasiswa" component={DetailMahasiswaScreen} options={{ title: 'Detail Mahasiswa' }} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator
          screenOptions={{
            headerBackground: () => (
              <Grad style={{ flex: 1 }} colors={[warna.primaryDark, warna.primary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
            ),
            headerTintColor: '#fff',
            contentStyle: { backgroundColor: warna.background },
            headerShadowVisible: false,
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerTitle: '' }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Register' }} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  )
}

export default App
