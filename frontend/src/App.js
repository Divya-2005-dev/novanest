import React from 'react'
import { Routes, Route, Link, useNavigate } from "react-router-dom"

import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Admin from './pages/Admin'
import ResumeBuilder from './pages/ResumeBuilder'
import MockTest from './pages/MockTest'
import MockInterview from './pages/MockInterview'

export default function App() {
  const navigate = useNavigate();

  const [token, setToken] = React.useState(localStorage.getItem('nn_access'));
  const [userRole, setUserRole] = React.useState(localStorage.getItem('nn_role') || 'student');

  const handleLogout = () => {
    localStorage.removeItem('nn_access');
    localStorage.removeItem('nn_refresh');
    localStorage.removeItem('nn_role');
    setToken(null);
    setUserRole('student');
    navigate("/login");
  };

  return (
    <div className="container">
      <header>
        <h1>🎓 NovaNest</h1>
        <nav>
          {!token ? (
            <>
              <Link to="/login"><button>Login</button></Link>
              <Link to="/register"><button>Register</button></Link>
            </>
          ) : (
            <>
              <Link to="/profile"><button>Profile</button></Link>
              <Link to="/resume"><button>Resume Builder</button></Link>
              <Link to="/mocktest"><button>Mock Test</button></Link>
              <Link to="/mockinterview"><button>Mock Interview</button></Link>
              {userRole === 'admin' && (
                <Link to="/admin"><button>Admin</button></Link>
              )}
              <button onClick={handleLogout}>Logout</button>
            </>
          )}
        </nav>
      </header>

      <main>
        <Routes>
          {!token ? (
            <>
              <Route
                path="/login"
                element={
                  <Login
                    onSuccess={(role) => {
                      setToken(localStorage.getItem("nn_access"));
                      setUserRole(role);
                      navigate("/dashboard");
                    }}
                  />
                }
              />

              <Route
                path="/register"
                element={<Register onSuccess={() => navigate("/login")} />}
              />
            </>
          ) : (
            <>
              <Route path="/dashboard" element={<Dashboard userRole={userRole} />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/mocktest" element={<MockTest />} />
              <Route path="/mockinterview" element={<MockInterview />} />
              <Route path="/resume" element={<ResumeBuilder />} />
              <Route
                path="/admin"
                element={
                  userRole === "admin"
                    ? <Admin />
                    : <div style={{ padding: 20 }}>Access denied — Admins only.</div>
                }
              />
            </>
          )}

          <Route
            path="*"
            element={
              <Login
                onSuccess={(role) => {
                  setToken(localStorage.getItem("nn_access"));
                  setUserRole(role);
                  navigate("/dashboard");
                }}
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
}
