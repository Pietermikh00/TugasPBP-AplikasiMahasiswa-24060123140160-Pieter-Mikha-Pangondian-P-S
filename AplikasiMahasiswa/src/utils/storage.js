import { MMKV } from 'react-native-mmkv'

let penyimpanan
try {
  penyimpanan = new MMKV()
} catch (e) {
  const mem = new Map()
  penyimpanan = {
    set: (k, v) => mem.set(k, String(v)),
    getString: (k) => (mem.has(k) ? mem.get(k) : undefined),
    delete: (k) => mem.delete(k),
    contains: (k) => mem.has(k),
  }
  console.log('❌ [storage] MMKV gagal inisialisasi, memakai fallback sementara')
}

export const simpanDataLogin = async (data) => {
  try {
    const nilai = JSON.stringify(data)
    penyimpanan.set('data_login', nilai)
    console.log('✅ [storage] Data login tersimpan ke MMKV')
    return true
  } catch (err) {
    console.log('❌ [storage] Gagal menyimpan data login:', err?.message)
    return false
  }
}

export const ambilDataLogin = () => {
  try {
    const nilai = penyimpanan.getString('data_login')
    if (!nilai) {
      console.log('🔄 [storage] Tidak ada data login di MMKV')
      return null
    }
    const data = JSON.parse(nilai)
    console.log('✅ [storage] Data login diambil dari MMKV')
    return data
  } catch (err) {
    console.log('❌ [storage] Gagal mengambil data login:', err?.message)
    return null
  }
}

export const hapusDataLogin = () => {
  try {
    penyimpanan.delete('data_login')
    console.log('✅ [storage] Data login dihapus dari MMKV')
    return true
  } catch (err) {
    console.log('❌ [storage] Gagal menghapus data login:', err?.message)
    return false
  }
}

export const cekStatusLogin = () => {
  try {
    const ada = penyimpanan.contains('data_login')
    console.log('🔄 [storage] Status login:', ada)
    return ada
  } catch (err) {
    console.log('❌ [storage] Gagal mengecek status login:', err?.message)
    return false
  }
}