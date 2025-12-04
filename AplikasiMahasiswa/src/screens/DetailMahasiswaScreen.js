import React from 'react'
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native'
import { hapusMahasiswa } from '../services/mahasiswaService'
import { warna } from '../utils/theme'

const BarisInfo = ({ label, nilai }) => (
  <View style={{ marginVertical: 6 }}>
    <Text style={{ color: '#555', fontSize: 12 }}>{label}</Text>
    <Text style={{ color: '#333', fontSize: 14, fontWeight: '600' }}>{nilai || '-'}</Text>
  </View>
)

const DetailMahasiswaScreen = ({ route, navigation }) => {
  const { mahasiswa } = route.params || {}

  const konfirmasiHapus = () => {
    Alert.alert('Konfirmasi', 'Yakin ingin menghapus data ini?', [
      { text: 'Batal' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          try {
            await hapusMahasiswa(mahasiswa.id)
            Alert.alert('Berhasil', 'Data berhasil dihapus')
            navigation.goBack()
          } catch (err) {
            Alert.alert('Gagal', err?.message || 'Terjadi kesalahan')
          }
        },
      },
    ])
  }

  return (
    <ScrollView contentContainerStyle={styles.kontainer}>
      <View style={styles.kepala}>
        <Text style={styles.nama}>{mahasiswa?.nama}</Text>
        <Text style={styles.nim}>NIM: {mahasiswa?.nim}</Text>
      </View>

      <View style={styles.kartu}>
        <Text style={styles.section}>Informasi Akademik</Text>
        <BarisInfo label="Jurusan" nilai={mahasiswa?.jurusan} />
        <BarisInfo label="Angkatan" nilai={mahasiswa?.angkatan} />
        <BarisInfo label="IPK" nilai={Number(mahasiswa?.ipk).toFixed(2)} />
      </View>

      <View style={styles.kartu}>
        <Text style={styles.section}>Informasi Kontak</Text>
        <BarisInfo label="Email" nilai={mahasiswa?.email} />
        <BarisInfo label="No. Telepon" nilai={mahasiswa?.noTelepon} />
        <BarisInfo label="Alamat" nilai={mahasiswa?.alamat} />
      </View>

      <TouchableOpacity style={styles.btnHapus} onPress={konfirmasiHapus}>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Hapus Data</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  kontainer: { padding: 16, backgroundColor: warna.background },
  kepala: { backgroundColor: warna.surface, borderRadius: 16, padding: 16, elevation: 2 },
  nama: { fontSize: 20, fontWeight: 'bold', color: warna.text },
  nim: { fontSize: 14, color: warna.subtext, marginTop: 6 },
  kartu: { backgroundColor: warna.surface, borderRadius: 16, padding: 16, elevation: 2, marginTop: 16 },
  section: { fontSize: 16, fontWeight: '600', color: warna.text, marginBottom: 8 },
  btnHapus: { backgroundColor: warna.danger, borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 16 },
})

export default DetailMahasiswaScreen