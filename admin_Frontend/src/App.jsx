import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Login from './pages/Login'
import Recommendations from './pages/Recommendations'
import Creators from './pages/Creators'
import './App.css'
function App() {
  return (
    <Router>
      <div style={{ backgroundColor: 'white', height: '100vh', overflow: 'hidden' }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/creators" element={<Creators />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App