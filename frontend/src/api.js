const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000/api'

export async function register(payload){
  const res = await fetch(`${API_BASE}/register/`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  })
  return res.json()
}

export async function login(credentials){
  const res = await fetch(`${API_BASE}/token/`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(credentials)
  })
  return res.json()
}
