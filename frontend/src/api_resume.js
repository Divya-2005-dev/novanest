const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000/api'

export async function generateResume(){
  const token = localStorage.getItem('nn_access')
  const res = await fetch(`${API_BASE}/student/generate_resume/`, {method:'POST', headers: {Authorization: `Bearer ${token}`}})
  return res.json()
}
