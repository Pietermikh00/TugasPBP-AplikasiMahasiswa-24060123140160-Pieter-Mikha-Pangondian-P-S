import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import { registerUser } from '../services/authService'
import { warna } from '../utils/theme'
import { Animated } from 'react-native'
import { useAnimMasuk } from '../utils/animations'

const RegisterScreen = ({ navigation }) => {
  const [nama, setNama] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [konfirmasiPassword, setKonfirmasiPassword] = useState('')
  const [sedangLoading, setSedangLoading] = useState(false)

  const onRegister = async () => {
    try {
      if (!nama.trim() || !email.trim() || !password.trim() || !konfirmasiPassword.trim()) {
        Alert.alert('Validasi', 'Semua field wajib diisi')
        return
      }
      if (password.length < 6) {
        Alert.alert('Validasi', 'Password minimal 6 karakter')
        return
      }
      if (password !== konfirmasiPassword) {
        Alert.alert('Validasi', 'Konfirmasi password tidak cocok')
        return
      }
      setSedangLoading(true)
      console.log('🔄 [register] Mengirim data registrasi...')
      await registerUser(email, password, nama)
      console.log('✅ [register] Registrasi sukses, kembali ke Login')
      Alert.alert('Berhasil', 'Registrasi berhasil, silakan login')
      navigation.goBack()
    } catch (err) {
      Alert.alert('Registrasi Gagal', err?.message || 'Terjadi kesalahan')
    } finally {
      setSedangLoading(false)
    }
  }

  const anim = useAnimMasuk(400)
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
    <ScrollView contentContainerStyle={styles.kontainer} keyboardShouldPersistTaps="handled">
      <Text style={styles.judul}>Daftar Akun Baru</Text>
      <Animated.View style={[styles.kartu, { opacity: anim.opacity, transform: [{ translateY: anim.translateY }] }]}>
        <Text style={styles.label}>Nama Lengkap</Text>
        <TextInput style={styles.input} placeholder="Masukkan nama" value={nama} onChangeText={setNama} />
        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} placeholder="Masukkan email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <Text style={styles.label}>Password</Text>
        <TextInput style={styles.input} placeholder="Masukkan password" value={password} onChangeText={setPassword} secureTextEntry />
        <Text style={styles.label}>Konfirmasi Password</Text>
        <TextInput style={styles.input} placeholder="Ulangi password" value={konfirmasiPassword} onChangeText={setKonfirmasiPassword} secureTextEntry />

        <TouchableOpacity style={styles.tombol} onPress={onRegister} disabled={sedangLoading}>
          {sedangLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.tombolTeks}>Daftar</Text>}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.link}>Sudah punya akun? Login</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  kontainer: { flexGrow: 1, backgroundColor: warna.background, padding: 20, justifyContent: 'center' },
  judul: { fontSize: 24, fontWeight: 'bold', color: warna.text, textAlign: 'center', marginBottom: 20, fontFamily: 'sans-serif-medium' },
  kartu: { backgroundColor: warna.surface, borderRadius: 16, padding: 16, elevation: 2 },
  label: { fontSize: 14, color: warna.text, marginTop: 12, fontFamily: 'sans-serif' },
  input: { borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FAFAFA', borderRadius: 12, padding: 12, marginTop: 6 },
  tombol: { backgroundColor: warna.primary, borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 16 },
  tombolTeks: { color: '#fff', fontWeight: 'bold', letterSpacing: 0.3, fontFamily: 'sans-serif-medium' },
  link: { color: warna.primary, textAlign: 'center', marginTop: 12 },
})

export default RegisterScreen