import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Animated } from 'react-native'
import { tambahMahasiswa } from '../services/mahasiswaService'
import { warna } from '../utils/theme'
import { Grad } from '../utils/gradient'
import FancyButton from '../components/FancyButton'
import { useAnimMasuk } from '../utils/animations'

const TambahMahasiswaScreen = ({ navigation }) => {
  const [nim, setNim] = useState('')
  const [nama, setNama] = useState('')
  const [jurusan, setJurusan] = useState('')
  const [angkatan, setAngkatan] = useState('')
  const [ipk, setIpk] = useState('')
  const [email, setEmail] = useState('')
  const [noTelepon, setNoTelepon] = useState('')
  const [alamat, setAlamat] = useState('')
  const [sedangMenyimpan, setSedangMenyimpan] = useState(false)

  const validasi = () => {
    if (!nim.trim() || !nama.trim() || !jurusan.trim() || !angkatan.trim() || !ipk.trim()) {
      Alert.alert('Validasi', 'Field wajib tidak boleh kosong')
      return false
    }
    if (String(nim).trim().length < 10) {
      Alert.alert('Validasi', 'NIM minimal 10 digit')
      return false
    }
    const angkaIpk = Number(ipk)
    if (isNaN(angkaIpk) || angkaIpk < 0 || angkaIpk > 4) {
      Alert.alert('Validasi', 'IPK harus angka 0.00 - 4.00')
      return false
    }
    return true
  }

  const onSimpan = async () => {
    try {
      if (!validasi()) return
      setSedangMenyimpan(true)
      console.log('🔄 [tambah] Menyimpan data mahasiswa...')
      const proses = tambahMahasiswa({ nim, nama, jurusan, angkatan, ipk: Number(ipk), email, noTelepon, alamat })
      setSedangMenyimpan(false)
      navigation.goBack()
      proses
        .then(() => console.log('✅ [tambah] Data tersimpan (async)'))
        .catch((e) => console.log('❌ [tambah] Simpan async gagal:', e?.message))
    } catch (err) {
      Alert.alert('Gagal', err?.message || 'Terjadi kesalahan')
    } finally {
      setSedangMenyimpan(false)
    }
  }

  const anim = useAnimMasuk(400)
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
    <ScrollView contentContainerStyle={styles.kontainer} keyboardShouldPersistTaps="handled">
      <Text style={styles.judul}>Tambah Mahasiswa</Text>
      <Animated.View style={[styles.kartu, { opacity: anim.opacity, transform: [{ translateY: anim.translateY }] }]}>
        <Text style={styles.label}>NIM *</Text>
        <TextInput style={styles.input} placeholder="NIM" value={nim} onChangeText={setNim} keyboardType="number-pad" />

        <Text style={styles.label}>Nama Lengkap *</Text>
        <TextInput style={styles.input} placeholder="Nama" value={nama} onChangeText={setNama} />

        <Text style={styles.label}>Jurusan *</Text>
        <TextInput style={styles.input} placeholder="Jurusan" value={jurusan} onChangeText={setJurusan} />

        <Text style={styles.label}>Angkatan *</Text>
        <TextInput style={styles.input} placeholder="Angkatan" value={angkatan} onChangeText={setAngkatan} keyboardType="number-pad" />

        <Text style={styles.label}>IPK *</Text>
        <TextInput style={styles.input} placeholder="IPK" value={ipk} onChangeText={setIpk} keyboardType="decimal-pad" />

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />

        <Text style={styles.label}>No. Telepon</Text>
        <TextInput style={styles.input} placeholder="No. Telepon" value={noTelepon} onChangeText={setNoTelepon} keyboardType="phone-pad" />

        <Text style={styles.label}>Alamat</Text>
        <TextInput style={styles.input} placeholder="Alamat" value={alamat} onChangeText={setAlamat} />

        <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
          <View style={{ flex: 1 }}>
            <FancyButton teks={sedangMenyimpan ? 'Menyimpan...' : 'Simpan Data'} onPress={onSimpan} disabled={sedangMenyimpan} colors={[warna.success, '#29B957']} />
          </View>
          <TouchableOpacity style={[styles.tombol, { backgroundColor: warna.danger, flex: 1 }]} onPress={() => navigation.goBack()}>
            <Text style={styles.tombolTeks}>Batal</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  kontainer: { flexGrow: 1, backgroundColor: warna.background, padding: 16 },
  judul: { fontSize: 22, fontWeight: 'bold', color: warna.text, textAlign: 'center', marginBottom: 12 },
  kartu: { backgroundColor: warna.surface, borderRadius: 16, padding: 16, elevation: 2 },
  label: { fontSize: 14, color: warna.text, marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FAFAFA', borderRadius: 12, padding: 12, marginTop: 6 },
  tombol: { borderRadius: 12, padding: 14, alignItems: 'center' },
  tombolTeks: { color: '#fff', fontWeight: 'bold' },
})

export default TambahMahasiswaScreen