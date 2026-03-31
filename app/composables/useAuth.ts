import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'

export const useAuth = () => {
  const user = useState<User | null>('auth.user', () => null)
  const userRole = useState<string | null>('auth.role', () => null)
  const loading = useState<boolean>('auth.loading', () => true)
  const authReady = useState<boolean>('auth.ready', () => false)

  const initAuth = () => {
    // Don't re-initialize if already done
    if (authReady.value) return Promise.resolve(user.value)

    const { auth, db } = useFirebase()

    return new Promise((resolve) => {
      onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          user.value = firebaseUser
          try {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
            if (userDoc.exists()) {
              userRole.value = userDoc.data().role
            }
          } catch (e) {
            console.error('Failed to fetch user role:', e)
          }
        } else {
          user.value = null
          userRole.value = null
        }
        loading.value = false
        authReady.value = true
        resolve(firebaseUser)
      })
    })
  }

  const login = async (email: string, password: string) => {
    try {
      const { auth, db } = useFirebase()
      const result = await signInWithEmailAndPassword(auth, email, password)
      const userDoc = await getDoc(doc(db, 'users', result.user.uid))
      if (userDoc.exists()) {
        userRole.value = userDoc.data().role
      }
      return { success: true }
    } catch (error: any) {
      return { success: false, message: formatAuthError(error.code) }
    }
  }

  const register = async (
    email: string,
    password: string,
    displayName: string,
    office: string
  ) => {
    try {
      const { auth, db } = useFirebase()
      const result = await createUserWithEmailAndPassword(auth, email, password)
      await setDoc(doc(db, 'users', result.user.uid), {
        email,
        displayName,
        office,
        role: 'user',
        createdAt: new Date().toISOString(),
      })
      userRole.value = 'user'
      return { success: true }
    } catch (error: any) {
      return { success: false, message: formatAuthError(error.code) }
    }
  }

  const logout = async () => {
    const { auth } = useFirebase()
    await signOut(auth)
    user.value = null
    userRole.value = null
    authReady.value = false
    await navigateTo('/login')
  }

  const formatAuthError = (code: string): string => {
    const errors: Record<string, string> = {
      'auth/invalid-credential': 'Invalid email or password.',
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/too-many-requests': 'Too many attempts. Try again later.',
      'auth/email-already-in-use': 'This email is already registered.',
      'auth/weak-password': 'Password must be at least 6 characters.',
      'auth/invalid-email': 'Please enter a valid email address.',
    }
    return errors[code] || 'An error occurred. Please try again.'
  }

  const isLoggedIn = computed(() => !!user.value)
  const isORD = computed(() => userRole.value === 'ORD')

  return {
    user,
    userRole,
    loading,
    authReady,
    isLoggedIn,
    isORD,
    initAuth,
    login,
    register,
    logout,
  }
}