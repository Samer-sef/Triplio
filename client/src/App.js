import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import AppLayout from './components/AppLayout'
import Public from './components/Public'
import LoginRegisterForm from './features/auth/LoginRegisterForm'
import Register from './features/auth/Register'
import Welcome from './features/auth/Welcome'
import RequireAuth from './features/auth/RequireAuth'
import PersistLogin from './features/auth/PersistLogin'


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route element={<AppLayout />}>
            {/* public routes */}
            <Route path="register" element={<LoginRegisterForm />} />
            <Route path="login" element={<LoginRegisterForm />} />

            {/* persisted login state routes */}
            <Route element={<PersistLogin />}>
              <Route index element={<Public />} />

              {/* protected and persisted login state routes*/}
              <Route element={<RequireAuth />}>
                <Route path="welcome" element={<Welcome />} />
              </Route>
            </Route>

        </Route>
      </Route>
    </Routes>
  )
}

export default App;