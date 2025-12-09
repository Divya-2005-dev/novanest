const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000/api'

export async function getProfile(){
  const token = localStorage.getItem('nn_access')
  const res = await fetch(`${API_BASE}/student/profile/`, {headers: {Authorization: `Bearer ${token}`}})
  return res.json()
}

export async function updateProfile(data){
  const token = localStorage.getItem('nn_access')
  const res = await fetch(`${API_BASE}/student/profile/`, {
    method: 'PUT',
    headers: {Authorization: `Bearer ${token}`, 'Content-Type':'application/json'},
    body: JSON.stringify(data)
  })
  return res.json()
}

export async function addSkill(formData){
  const token = localStorage.getItem('nn_access')
  const res = await fetch(`${API_BASE}/student/skills/`, {
    method: 'POST',
    headers: {Authorization: `Bearer ${token}`},
    body: formData
  })
  return res.json()
}

export async function listSkills(){
  const token = localStorage.getItem('nn_access')
  const res = await fetch(`${API_BASE}/student/skills/`, {headers: {Authorization: `Bearer ${token}`}})
  return res.json()
}

export async function deleteSkill(id){
  const token = localStorage.getItem('nn_access')
  const res = await fetch(`${API_BASE}/student/skills/${id}/`, {
    method: 'DELETE',
    headers: {Authorization: `Bearer ${token}`}
  })
  return res.ok
}

export async function uploadResume(formData){
  const token = localStorage.getItem('nn_access')
  const res = await fetch(`${API_BASE}/student/resumes/`, {
    method: 'POST',
    headers: {Authorization: `Bearer ${token}`},
    body: formData
  })
  return res.json()
}
