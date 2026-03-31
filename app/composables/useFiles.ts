import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
  where,
} from 'firebase/firestore'

export interface FileRecord {
  id: string
  folderId: string
  name: string
  year: number
  description: string
  uploadDate: any
  createdBy: string
  createdByEmail: string
  fileUrl: string       // ← Cloudinary URL
  publicId: string      // ← Cloudinary public ID
  fileName: string      // ← original filename
}

export const useFiles = () => {
  const { db } = useFirebase()
  const { user } = useAuth()
  const files = useState<FileRecord[]>('files.list', () => [])
  const loading = useState<boolean>('files.loading', () => false)

  const fetchFiles = async (folderId: string, sortYear: 'asc' | 'desc' = 'desc') => {
    loading.value = true
    try {
      const q = query(
        collection(db, 'files'),
        where('folderId', '==', folderId),
        orderBy('year', sortYear)
      )
      const snapshot = await getDocs(q)
      files.value = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data(),
      })) as FileRecord[]
    } catch (e) {
      console.error('Error fetching files:', e)
    } finally {
      loading.value = false
    }
  }

  const createFile = async (folderId: string, data: {
    name: string
    year: number
    description: string
    fileUrl: string
    publicId: string
    fileName: string
  }) => {
    try {
      await addDoc(collection(db, 'files'), {
        folderId,
        name: data.name.trim(),
        year: data.year,
        description: data.description.trim(),
        fileUrl: data.fileUrl,
        publicId: data.publicId,
        fileName: data.fileName,
        uploadDate: serverTimestamp(),
        createdBy: user.value?.uid ?? '',
        createdByEmail: user.value?.email ?? '',
      })
      await fetchFiles(folderId)
      return { success: true }
    } catch (e: any) {
      return { success: false, message: e.message }
    }
  }

  const deleteFile = async (fileId: string, folderId: string) => {
    try {
      await deleteDoc(doc(db, 'files', fileId))
      await fetchFiles(folderId)
      return { success: true }
    } catch (e: any) {
      return { success: false, message: e.message }
    }
  }

  return { files, loading, fetchFiles, createFile, deleteFile }
}