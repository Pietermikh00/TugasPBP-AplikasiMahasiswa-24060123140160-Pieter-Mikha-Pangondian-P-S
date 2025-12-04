import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from 'react-native'
import { loginUser } from '../services/authService'
import { warna } from '../utils/theme'
import { Grad } from '../utils/gradient'
import { Animated } from 'react-native'
import { useAnimMasuk } from '../utils/animations'

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [sedangLoading, setSedangLoading] = useState(false)

  const onLogin = async () => {
    try {
      if (!email.trim() || !password.trim()) {
        Alert.alert('Validasi', 'Email dan Password wajib diisi')
        return
      }
      setSedangLoading(true)
      console.log('🔄 [login] Mengirim kredensial...')
      await loginUser(email, password)
      console.log('✅ [login] Login sukses, menunggu navigasi utama aktif')
    } catch (err) {
      Alert.alert('Login Gagal', err?.message || 'Terjadi kesalahan')
    } finally {
      setSedangLoading(false)
    }
  }

  const anim = useAnimMasuk(400)
  return (
    <View style={styles.kontainer}>
      <Text style={styles.judul}>Aplikasi Mahasiswa</Text>
      <Animated.View style={[styles.kartu, { opacity: anim.opacity, transform: [{ translateY: anim.translateY }] }]}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity onPress={onLogin} disabled={sedangLoading}>
          <Grad style={styles.tombolGrad} colors={[warna.primaryDark, warna.primary]}>
            {sedangLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.tombolTeks}>Login</Text>}
          </Grad>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Belum punya akun? Daftar</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  kontainer: { flex: 1, backgroundColor: warna.background, padding: 20, justifyContent: 'center' },
  judul: { fontSize: 24, fontWeight: 'bold', color: warna.text, textAlign: 'center', marginBottom: 20, fontFamily: 'sans-serif-medium' },
  kartu: { backgroundColor: warna.surface, borderRadius: 16, padding: 16, elevation: 2 },
  label: { fontSize: 14, color: warna.text, marginTop: 12, fontFamily: 'sans-serif' },
  input: { borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FAFAFA', borderRadius: 12, padding: 12, marginTop: 6 },
  tombolGrad: { borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 16 },
  tombolTeks: { color: '#fff', fontWeight: 'bold', letterSpacing: 0.3, fontFamily: 'sans-serif-medium' },
  link: { color: warna.primary, textAlign: 'center', marginTop: 12 },
})

export default LoginScreen