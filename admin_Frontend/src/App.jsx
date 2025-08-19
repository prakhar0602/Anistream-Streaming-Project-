import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Login from './pages/Login'
import Recommendations from './pages/Recommendations'
import Creators from './pages/Creators'
import AllUsers from './pages/AllUsers'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'
function App() {
  return (
    <Router>
      <div style={{ backgroundColor: 'white', height: '100vh', overflow: 'hidden' }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/online-users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
          <Route path="/recommendations" element={<ProtectedRoute><Recommendations /></ProtectedRoute>} />
          <Route path="/creators" element={<ProtectedRoute><Creators /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><AllUsers /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App