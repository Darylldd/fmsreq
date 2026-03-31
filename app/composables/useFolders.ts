import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore'

export interface Folder {
  createdByEmail: any
  id: string
  name: string
  description: string
  createdAt: any
  createdBy: string
  createdByOffice: string
}

export const useFolders = () => {
  const { db } = useFirebase()
  const { user } = useAuth()
  const folders = useState<Folder[]>('folders.list', () => [])
  const loading = useState<boolean>('folders.loading', () => false)

  const fetchFolders = async () => {
    loading.value = true
    try {
      const q = query(collection(db, 'folders'), orderBy('name', 'asc'))
      const snapshot = await getDocs(q)
      folders.value = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data(),
      })) as Folder[]
    } catch (e) {
      console.error('Error fetching folders:', e)
    } finally {
      loading.value = false
    }
  }

  const createFolder = async (name: string, description: string) => {
    try {
      const { $userProfile } = useNuxtApp() as any
      const docRef = await addDoc(collection(db, 'folders'), {
        name: name.trim().toUpperCase(),
        description: description.trim(),
        createdAt: serverTimestamp(),
        createdBy: user.value?.uid ?? '',
        createdByEmail: user.value?.email ?? '',
      })
      await fetchFolders()
      return { success: true, id: docRef.id }
    } catch (e: any) {
      return { success: false, message: e.message }
    }
  }

  const deleteFolder = async (folderId: string) => {
    try {
      await deleteDoc(doc(db, 'folders', folderId))
      await fetchFolders()
      return { success: true }
    } catch (e: any) {
      return { success: false, message: e.message }
    }
  }

  return { folders, loading, fetchFolders, createFolder, deleteFolder }
}