import './App.css'
import { useState, useEffect } from "react"
import { testConnection } from "./api/clients.api"
import { BrowserRouter } from "react-router-dom";
import AppRouter from './routes/AppRouter';
import { AuthProvider } from './auth/AuthContext';

function App() {
  const [dark, setDark] = useState<boolean>(true)

  useEffect(() => {
    testConnection()
  }, [])

  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRouter dark={dark} setDark={setDark} />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
