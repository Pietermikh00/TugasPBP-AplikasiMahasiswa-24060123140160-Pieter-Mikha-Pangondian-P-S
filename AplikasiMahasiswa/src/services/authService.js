import auth from '@react-native-firebase/auth'
import { simpanDataLogin, hapusDataLogin, ambilDataLogin } from '../utils/storage'

export const registerUser = async (email, password, nama) => {
  try {
    if (!email || !password || !nama) {
      throw new Error('Email, password, dan nama wajib diisi')
    }
    console.log('🔄 [auth] Mendaftar user baru...')
    const hasil = await auth().createUserWithEmailAndPassword(email.trim(), password)
    await hasil.user.updateProfile({ displayName: nama.trim() })
    console.log('✅ [auth] Registrasi berhasil')
    return hasil.user
  } catch (err) {
    console.log('❌ [auth] Registrasi gagal:', err?.message)
    throw err
  }
}

export const loginUser = async (email, password) => {
  try {
    if (!email || !password) {
      throw new Error('Email dan password wajib diisi')
    }
    console.log('🔄 [auth] Melakukan login...')
    const hasil = await auth().signInWithEmailAndPassword(email.trim(), password)
    const token = await hasil.user.getIdToken()
    const dataLogin = {
      userId: hasil.user.uid,
      email: hasil.user.email,
      nama: hasil.user.displayName || '',
      token,
    }
    await simpanDataLogin(dataLogin)
    console.log('✅ [auth] Login berhasil dan token disimpan')
    return hasil.user
  } catch (err) {
    console.log('❌ [auth] Login gagal:', err?.message)
    throw err
  }
}

export const logoutUser = async () => {
  try {
    console.log('🔄 [auth] Melakukan logout...')
    await auth().signOut()
    hapusDataLogin()
    console.log('✅ [auth] Logout berhasil dan data lokal dihapus')
    return true
  } catch (err) {
    console.log('❌ [auth] Logout gagal:', err?.message)
    throw err
  }
}

export const getUserSekarang = () => {
  try {
    const user = auth().currentUser
    if (user) {
      console.log('✅ [auth] Ada user aktif:', user.uid)
      return user
    }
    const lokal = ambilDataLogin()
    if (lokal) {
      console.log('🔄 [auth] Menggunakan data lokal sementara')
    }
    return user
  } catch (err) {
    console.log('❌ [auth] Gagal mengambil user aktif:', err?.message)
    return null
  }
}