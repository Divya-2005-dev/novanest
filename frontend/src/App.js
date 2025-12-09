import React from 'react'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Admin from './pages/Admin'
import ResumeBuilder from './pages/ResumeBuilder'
import MockTest from './pages/MockTest'
import MockInterview from './pages/MockInterview'

export default function App(){
  const [route, setRoute] = React.useState('login')
  const [token, setToken] = React.useState(localStorage.getItem('nn_access'))
  const [userRole, setUserRole] = React.useState(localStorage.getItem('nn_role') || 'student')

  const handleLogout = () => {
    localStorage.removeItem('nn_access')
    localStorage.removeItem('nn_refresh')
    localStorage.removeItem('nn_role')
    setToken(null)
    setUserRole('student')
    setRoute('login')
  }

  const handleNavigate = (page) => {
    setRoute(page)
  }

  return (
    <div className="container">
      <header>
        <h1>🎓 NovaNest</h1>
        <nav>
          {!token ? (
            <>
              <button onClick={()=>setRoute('login')}>Login</button>
              <button onClick={()=>setRoute('register')}>Register</button>
            </>
          ) : (
            <>
              <button onClick={()=>setRoute('profile')}>Profile</button>
              <button onClick={()=>setRoute('resume')}>Resume Builder</button>
              <button onClick={()=>setRoute('mocktest')}>Mock Test</button>
              <button onClick={()=>setRoute('mockinterview')}>Mock Interview</button>
              {userRole === 'admin' && (
                <button onClick={()=>setRoute('admin')}>Admin</button>
              )}
              <button onClick={handleLogout}>Logout</button>
            </>
          )}
        </nav>
      </header>
      <main>
        {!token ? (
          route === 'login' ? <Login onSuccess={(role) => { setToken(localStorage.getItem('nn_access')); setUserRole(role); setRoute('dashboard') }} /> : <Register onSuccess={() => { setRoute('login') }} />
        ) : (
          route === 'dashboard' ? <Dashboard onNavigate={handleNavigate} userRole={userRole} /> : route === 'profile' ? <Profile /> : route === 'mocktest' ? <MockTest onNavigate={handleNavigate} /> : route === 'mockinterview' ? <MockInterview onNavigate={handleNavigate} /> : route === 'admin' ? (userRole === 'admin' ? <Admin /> : <div style={{padding:20}}>Access denied — Admins only.</div>) : <ResumeBuilder />
        )}
      </main>
    </div>
  )
}
