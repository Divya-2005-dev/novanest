import React from 'react'
import { listCompanies, createCompany, listJobs, createJob, matchJob } from '../api_admin'

export default function Admin(){
  const [companies, setCompanies] = React.useState([])
  const [jobs, setJobs] = React.useState([])
  const [msg, setMsg] = React.useState('')

  const role = typeof window !== 'undefined' ? localStorage.getItem('nn_role') : null

  React.useEffect(()=>{
    if (role !== 'admin') return

    async function load(){
      try {
        const comps = await listCompanies()
        const js = await listJobs()
        setCompanies(Array.isArray(comps) ? comps : [])
        setJobs(Array.isArray(js) ? js : [])

        if (comps && !Array.isArray(comps) && comps.detail){
          setMsg(`Error loading companies: ${comps.detail}`)
        }
        if (js && !Array.isArray(js) && js.detail){
          setMsg(prev => `${prev}\nError loading jobs: ${js.detail}`)
        }
      } catch (e) {
        setCompanies([])
        setJobs([])
        setMsg('Error loading admin data')
      }
    }
    load()
  },[role])

  async function submitCompany(e){
    e.preventDefault()
    const f=e.target.elements
    const res = await createCompany({
      name:f.name.value,
      description:f.description.value,
      website:f.website.value
    })

    if(res && res.id){
      setCompanies(prev=>[res,...prev])
      e.target.reset()
      setMsg('✓ Company added')
      setTimeout(() => setMsg(''), 3000)
    }
  }

  async function submitJob(e){
    e.preventDefault()
    const f=e.target.elements
    const res = await createJob({
      title:f.title.value,
      description:f.description.value,
      required_skills:f.required_skills.value
    })

    if(res && res.id){
      setJobs(prev=>[res,...prev])
      e.target.reset()
      setMsg('✓ Job posted')
      setTimeout(() => setMsg(''), 3000)
    }
  }

  async function doMatch(id){
    const r = await matchJob(id)
    if(r && r.matches){
      setMsg(`Job Match Results for "${r.job}":\n${r.matches
        .map(m => `${m.register_number}: ${m.score}% match`)
        .join('\n')}`)
    } else {
      setMsg('No matches found')
    }
  }

  return (
    <div>
      <div className="card">
        <h2>🏢 Companies</h2>
        <form onSubmit={submitCompany}>
          <label>Company Name</label>
          <input name="name" placeholder="Company Name" required />
          <label>Website</label>
          <input name="website" placeholder="https://company.com" type="url" />
          <label>Description</label>
          <textarea name="description" placeholder="Company description"></textarea>
          <button type="submit">Add Company</button>
        </form>
        <ul>{companies.map(c=> <li key={c.id}><strong>{c.name}</strong></li>)}</ul>
      </div>

      <div className="card">
        <h2>💼 Job Postings</h2>
        <form onSubmit={submitJob}>
          <label>Job Title</label>
          <input name="title" placeholder="Job Title" required />
          <label>Required Skills (comma-separated)</label>
          <input name="required_skills" placeholder="Python, JavaScript, React" required />
          <label>Description</label>
          <textarea name="description" placeholder="Job description"></textarea>
          <button type="submit">Post Job</button>
        </form>
        <h3>Posted Jobs</h3>
        <ul>{jobs.map(j=> (
          <li key={j.id}>
            <strong>{j.title}</strong>
            <button onClick={()=>doMatch(j.id)}>🔍 Match Candidates</button>
          </li>
        ))}</ul>
        {msg && <div className="msg" style={{whiteSpace: 'pre-wrap'}}>{msg}</div>}
      </div>
    </div>
  )
}
