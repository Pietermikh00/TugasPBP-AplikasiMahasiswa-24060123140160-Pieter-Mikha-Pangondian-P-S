import firestore from '@react-native-firebase/firestore'

const koleksi = firestore().collection('mahasiswa')

export const tambahMahasiswa = async (dataMahasiswa) => {
  try {
    const { nim, nama, jurusan, angkatan, ipk } = dataMahasiswa || {}
    if (!nim || !nama || !jurusan || !angkatan || ipk === undefined) {
      throw new Error('NIM, Nama, Jurusan, Angkatan, dan IPK wajib diisi')
    }
    console.log('🔄 [mahasiswa] Menyimpan data mahasiswa baru...')
    const bersih = {
      nim: String(nim).trim(),
      nama: String(nama).trim(),
      jurusan: String(jurusan).trim(),
      angkatan: String(angkatan).trim(),
      ipk: Number(ipk),
      email: dataMahasiswa?.email || '',
      noTelepon: dataMahasiswa?.noTelepon || '',
      alamat: dataMahasiswa?.alamat || '',
      dibuat: firestore.FieldValue.serverTimestamp(),
      diupdate: firestore.FieldValue.serverTimestamp(),
    }
    const ref = await koleksi.add(bersih)
    console.log('✅ [mahasiswa] Data tersimpan dengan id:', ref.id)
    return { id: ref.id, ...bersih }
  } catch (err) {
    console.log('❌ [mahasiswa] Gagal menyimpan data:', err?.message)
    throw err
  }
}

export const ambilSemuaMahasiswa = async () => {
  try {
    console.log('🔄 [mahasiswa] Mengambil semua data mahasiswa...')
    const snap = await koleksi.orderBy('dibuat', 'desc').get()
    const hasil = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    console.log('✅ [mahasiswa] Total data:', hasil.length)
    return hasil
  } catch (err) {
    console.log('❌ [mahasiswa] Gagal mengambil data:', err?.message)
    throw err
  }
}

export const cariMahasiswaByNIM = async (nim) => {
  try {
    if (!nim) throw new Error('NIM wajib diisi')
    console.log('🔄 [mahasiswa] Mencari mahasiswa berdasarkan NIM...')
    const snap = await koleksi.where('nim', '==', String(nim).trim()).limit(1).get()
    if (snap.empty) return null
    const d = snap.docs[0]
    console.log('✅ [mahasiswa] Ditemukan id:', d.id)
    return { id: d.id, ...d.data() }
  } catch (err) {
    console.log('❌ [mahasiswa] Gagal mencari data:', err?.message)
    throw err
  }
}

export const updateMahasiswa = async (id, dataUpdate) => {
  try {
    if (!id) throw new Error('ID dokumen wajib diisi')
    console.log('🔄 [mahasiswa] Mengupdate data mahasiswa...')
    await koleksi.doc(id).update({ ...dataUpdate, diupdate: firestore.FieldValue.serverTimestamp() })
    console.log('✅ [mahasiswa] Data berhasil diupdate')
    return true
  } catch (err) {
    console.log('❌ [mahasiswa] Update gagal:', err?.message)
    throw err
  }
}

export const hapusMahasiswa = async (id) => {
  try {
    if (!id) throw new Error('ID dokumen wajib diisi')
    console.log('🔄 [mahasiswa] Menghapus data mahasiswa...')
    await koleksi.doc(id).delete()
    console.log('✅ [mahasiswa] Data berhasil dihapus')
    return true
  } catch (err) {
    console.log('❌ [mahasiswa] Hapus gagal:', err?.message)
    throw err
  }
}