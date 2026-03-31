import {
  collection,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore'
import type { FileRecord } from './useFiles'
import type { Folder } from './useFolders'

export interface SearchResult extends FileRecord {
  folderName: string
}

export const useSearch = () => {
  const { db } = useFirebase()
  const results = useState<SearchResult[]>('search.results', () => [])
  const loading = useState<boolean>('search.loading', () => false)
  const searched = useState<boolean>('search.searched', () => false)

  const search = async (keyword: string, yearFilter?: number | null) => {
    if (!keyword.trim() && !yearFilter) {
      results.value = []
      searched.value = false
      return
    }

    loading.value = true
    searched.value = true

    try {
      // Fetch all folders first to build a name map
      const foldersSnap = await getDocs(collection(db, 'folders'))
      const folderMap: Record<string, string> = {}
      foldersSnap.docs.forEach(d => {
        folderMap[d.id] = d.data().name
      })

      // Fetch all files
      const filesSnap = await getDocs(
        query(collection(db, 'files'), orderBy('year', 'desc'))
      )

      const allFiles = filesSnap.docs.map(d => ({
        id: d.id,
        ...d.data(),
        folderName: folderMap[d.data().folderId] ?? 'Unknown',
      })) as SearchResult[]

      // Client-side filter (substring match)
      const kw = keyword.trim().toLowerCase()
      results.value = allFiles.filter(f => {
        const matchesKeyword = !kw ||
          f.name.toLowerCase().includes(kw) ||
          f.description?.toLowerCase().includes(kw) ||
          f.folderName.toLowerCase().includes(kw) ||
          String(f.year).includes(kw)

        const matchesYear = !yearFilter || f.year === yearFilter

        return matchesKeyword && matchesYear
      })
    } catch (e) {
      console.error('Search error:', e)
    } finally {
      loading.value = false
    }
  }

  const clearSearch = () => {
    results.value = []
    searched.value = false
  }

  return { results, loading, searched, search, clearSearch }
}