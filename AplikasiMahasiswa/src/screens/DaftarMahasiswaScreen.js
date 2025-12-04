import React, { useCallback, useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator, StyleSheet, Alert, Animated, TextInput, Pressable } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { ambilSemuaMahasiswa } from '../services/mahasiswaService'
import { logoutUser } from '../services/authService'
import { warna } from '../utils/theme'
import { Grad } from '../utils/gradient'
import FancyButton from '../components/FancyButton'
import { useAnimMasuk, useTekanScale } from '../utils/animations'

const DaftarMahasiswaScreen = ({ navigation }) => {
  const [daftarMahasiswa, setDaftarMahasiswa] = useState([])
  const [sedangLoading, setSedangLoading] = useState(true)
  const [sedangRefresh, setSedangRefresh] = useState(false)
  const [query, setQuery] = useState('')
  const [debounced, setDebounced] = useState('')
  const [filtered, setFiltered] = useState([])

  const muatData = async () => {
    try {
      const data = await ambilSemuaMahasiswa()
      setDaftarMahasiswa(data)
    } catch (err) {
      Alert.alert('Gagal', err?.message || 'Tidak dapat memuat data')
    } finally {
      setSedangLoading(false)
      setSedangRefresh(false)
    }
  }

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={styles.headerLogout} onPress={konfirmasiLogout}>
          <Text style={{ color: '#fff', fontWeight: '600' }}>Logout</Text>
        </TouchableOpacity>
      ),
      title: 'Daftar Mahasiswa',
    })
    muatData()
  }, [])

  useEffect(() => {
    const id = setTimeout(() => setDebounced(query.trim().toLowerCase()), 250)
    return () => clearTimeout(id)
  }, [query])

  useEffect(() => {
    if (!debounced) {
      setFiltered(daftarMahasiswa)
      return
    }
    const hasil = daftarMahasiswa.filter((m) => {
      const nama = String(m.nama || '').toLowerCase()
      const nim = String(m.nim || '').toLowerCase()
      return nama.includes(debounced) || nim.includes(debounced)
    })
    setFiltered(hasil)
  }, [debounced, daftarMahasiswa])

  useFocusEffect(
    useCallback(() => {
      console.log('🔄 [list] Refresh saat screen fokus')
      muatData()
    }, [])
  )

  const onRefresh = () => {
    setSedangRefresh(true)
    muatData()
  }

  const konfirmasiLogout = () => {
    Alert.alert('Konfirmasi', 'Yakin ingin logout?', [
      { text: 'Batal' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await logoutUser()
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] })
          } catch (err) {
            Alert.alert('Logout Gagal', err?.message || 'Terjadi kesalahan')
          }
        },
      },
    ])
  }

  const renderItem = ({ item, index }) => (
    <MahasiswaItem item={item} index={index} onPress={() => navigation.navigate('DetailMahasiswa', { mahasiswa: item })} />
  )

  return (
    <View style={styles.kontainer}>
      

      {sedangLoading ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : daftarMahasiswa.length === 0 ? (
        <Text style={styles.empty}>Belum ada data mahasiswa</Text>
      ) : (
        <View style={{ flex: 1 }}>
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            refreshControl={<RefreshControl refreshing={sedangRefresh} onRefresh={onRefresh} />}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </View>
      )}
      <Pressable style={styles.fabWrap} onPress={() => navigation.navigate('TambahMahasiswa')}>
        <Grad style={styles.fab} colors={[warna.primaryDark, warna.primary]}>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: '700' }}>+</Text>
        </Grad>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  kontainer: { flex: 1, backgroundColor: warna.background, padding: 16 },
  headerLogout: { backgroundColor: warna.danger, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16 },
  btnTambah: { backgroundColor: warna.primary, paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 12, elevation: 2 },
  btnTambahText: { color: '#fff', fontWeight: '700' },
  kartu: { backgroundColor: warna.surface, borderRadius: 16, paddingVertical: 16, paddingHorizontal: 16, elevation: 2, marginTop: 12, borderLeftWidth: 4, borderLeftColor: warna.primary },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F5E9FF', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: warna.primaryDark, fontWeight: '700', fontFamily: 'sans-serif-medium' },
  nama: { fontSize: 17, fontWeight: '700', color: warna.text, fontFamily: 'sans-serif-medium' },
  info: { fontSize: 13, color: warna.subtext, marginTop: 2, fontFamily: 'sans-serif' },
  empty: { textAlign: 'center', marginTop: 40, color: warna.subtext },
  search: { borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FAFAFA', borderRadius: 12, padding: 12, color: '#fff' },
  fabWrap: { position: 'absolute', right: 16, bottom: 20 },
  fab: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
})

export default DaftarMahasiswaScreen
const MahasiswaItem = ({ item, index, onPress }) => {
  const anim = useAnimMasuk(300, index * 40)
  const { scale, onPressIn, onPressOut } = useTekanScale()
  const inisial = (String(item.nama || '')
    .split(' ')
    .slice(0, 2)
    .map((s) => s[0])
    .join('') || 'M').toUpperCase()
  return (
    <Animated.View style={{ opacity: anim.opacity, transform: [{ translateY: anim.translateY }] }}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Pressable style={styles.kartu} onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 }}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{inisial}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.nama}>{item.nama}</Text>
                <Text style={styles.info}>NIM: {item.nim}</Text>
                <Text style={styles.info}>Jurusan: {item.jurusan}</Text>
              </View>
            </View>
            
          </View>
        </Pressable>
      </Animated.View>
    </Animated.View>
  )
}