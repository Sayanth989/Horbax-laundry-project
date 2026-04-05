import { BrowserRouter, Routes, Route,} from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import Login from './pages/login'
import Dashboard from './pages/Dashboard'
import Layout from './components/Layout'

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

           <Route path="/dashboard" element={
           
              <Layout>
                <Dashboard />
              </Layout>
          } />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App