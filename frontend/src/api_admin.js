const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000/api'

export async function listCompanies(){
  const token = localStorage.getItem('nn_access')
  const res = await fetch(`${API_BASE}/companies/`, {headers: {Authorization: `Bearer ${token}`}})
  return res.json()
}

export async function createCompany(payload){
  const token = localStorage.getItem('nn_access')
  const res = await fetch(`${API_BASE}/companies/`, {method:'POST', headers:{Authorization:`Bearer ${token}`, 'Content-Type':'application/json'}, body: JSON.stringify(payload)})
  return res.json()
}

export async function listJobs(){
  const token = localStorage.getItem('nn_access')
  const res = await fetch(`${API_BASE}/jobs/`, {headers: {Authorization: `Bearer ${token}`}})
  return res.json()
}

export async function createJob(payload){
  const token = localStorage.getItem('nn_access')
  const res = await fetch(`${API_BASE}/jobs/`, {method:'POST', headers:{Authorization:`Bearer ${token}`, 'Content-Type':'application/json'}, body: JSON.stringify(payload)})
  return res.json()
}

export async function matchJob(jobId){
  const token = localStorage.getItem('nn_access')
  const res = await fetch(`${API_BASE}/jobs/${jobId}/match/`, {headers: {Authorization: `Bearer ${token}`}})
  return res.json()
}

export async function applyJob(jobId, resumeId){
  const token = localStorage.getItem('nn_access')
  const res = await fetch(`${API_BASE}/apply/`, {method:'POST', headers:{Authorization:`Bearer ${token}`, 'Content-Type':'application/json'}, body: JSON.stringify({job: jobId, resume: resumeId})})
  return res.json()
}
