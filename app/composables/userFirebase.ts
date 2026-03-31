import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

export const useFirebase = () => {
  const config = useRuntimeConfig()

  const firebaseApp = getApps().length === 0
    ? initializeApp({
        apiKey: config.public.firebaseApiKey,
        authDomain: config.public.firebaseAuthDomain,
        projectId: config.public.firebaseProjectId,
        storageBucket: config.public.firebaseStorageBucket,
        messagingSenderId: config.public.firebaseMessagingSenderId,
        appId: config.public.firebaseAppId,
      })
    : getApp()

  return {
    auth: getAuth(firebaseApp),
    db: getFirestore(firebaseApp),
  }
}