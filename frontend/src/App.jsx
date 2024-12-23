import React, { useEffect } from 'react'
import Navbar from './components/Navbar.jsx'

import HomePage from './pages/HomePage.jsx'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage.jsx'
import Settingspage from './pages/SettingsPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import StatsPage from './pages/StatsPage.jsx'

import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/useAuthStore.js'

import { Loader } from 'lucide-react'
import { Toaster } from "react-hot-toast"
 
  
const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore()
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });
  
  if (isCheckingAuth && !authUser) 
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
    

  return (
    <div>

      <Navbar/>
      <Routes>
        <Route path="/" element={authUser ? <HomePage/> : <Navigate to="/login"/> }/>
        <Route path="/signup" element={!authUser ? <SignUpPage/> : <Navigate to="/"/>}/>
        <Route path="/login" element={!authUser ? <LoginPage/>: <Navigate to="/" />}/>
        <Route path="/settings" element={<Settingspage/>}/>
        <Route path="/profile" element={authUser ? <ProfilePage/> : <Navigate to="/login"/>}/>
        <Route path="/stats" element={authUser ? <StatsPage /> : <Navigate to="/login"/>} />
      </Routes>

      <Toaster />
    </div>
  )
}

export default App