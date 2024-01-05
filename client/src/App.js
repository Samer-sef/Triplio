import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import AppLayout from './components/AppLayout'
import Home from './components/Home'
import LoginRegisterForm from './features/auth/LoginRegisterForm'
import Welcome from './features/auth/Welcome'
import CreateTripForm from './features/trips/CreateTripForm'
import RequireAuth from './features/auth/RequireAuth'
import PersistLogin from './features/auth/PersistLogin'


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route element={<AppLayout />}>

        <Route element={<PersistLogin showPageEvenIfNotLoggedIn/>}>
              <Route path="/" element={<Home />} >
                <Route path="register" element={<LoginRegisterForm />} />
                <Route path="login" element={<LoginRegisterForm />} />

                <Route element={<RequireAuth />}>
                  <Route path="createTrip" element={<CreateTripForm />} />
                </Route>
              </Route>

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