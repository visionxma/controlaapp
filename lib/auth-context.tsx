"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import {
  type User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, db } from "./firebase"

interface UserData {
  companyName: string
  responsibleName: string
  email: string
}

interface AuthContextType {
  user: User | null
  userData: UserData | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, companyName: string, responsibleName: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)

      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid))
          if (userDoc.exists()) {
            setUserData(userDoc.data() as UserData)
          }
        } catch (error) {
          console.error("Erro ao buscar dados do usuário:", error)
        }
      } else {
        setUserData(null)
      }

      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signUp = async (email: string, password: string, companyName: string, responsibleName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Salvar dados no Firestore
    const userData = {
      companyName,
      responsibleName,
      email,
    }

    await setDoc(doc(db, "users", user.uid), userData)
    await updateProfile(user, { displayName: responsibleName })

    setUserData(userData)
  }

  const logout = async () => {
    await signOut(auth)
  }

  const value = {
    user,
    userData,
    loading,
    signIn,
    signUp,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
