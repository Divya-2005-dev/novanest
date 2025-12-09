import React from 'react'
import { getProfile, updateProfile, addSkill, listSkills, deleteSkill, uploadResume } from '../api_profile'

export default function Profile(){
  const [profile, setProfile] = React.useState(null)
  const [skills, setSkills] = React.useState([])
  const [msg, setMsg] = React.useState('')
  const [loading, setLoading] = React.useState(true)

  React.useEffect(()=>{
    async function load(){
      setLoading(true)
      const p = await getProfile()
      setProfile(p)
      const s = await listSkills()
      setSkills(Array.isArray(s) ? s : [])
      setLoading(false)
    }
    load()
  },[])

  function change(e){
    setProfile({...profile, [e.target.name]: e.target.value})
  }

  async function save(e){
    e.preventDefault()
    const res = await updateProfile(profile)
    setMsg('✓ Profile saved')
    setTimeout(() => setMsg(''), 3000)
  }

  async function submitSkill(e){
    e.preventDefault()
    const f = e.target.elements
    const fd = new FormData()
    fd.append('name', f.name.value)
    fd.append('learned_date', f.learned_date.value)
    if(f.certificate.files[0]) fd.append('certificate', f.certificate.files[0])
    const res = await addSkill(fd)
    if(res && res.id){
      setSkills(prev=>[res, ...prev])
      e.target.reset()
      setMsg('✓ Skill added')
      setTimeout(() => setMsg(''), 3000)
    }
  }

  async function removeSkill(id){
    const ok = await deleteSkill(id)
    if(ok) setSkills(prev => prev.filter(s => s.id !== id))
  }

  async function submitResume(e){
    e.preventDefault()
    const f = e.target.elements
    const fd = new FormData()
    if(f.file.files[0]) fd.append('file', f.file.files[0])
    const res = await uploadResume(fd)
    if(res && res.id){
      e.target.reset()
      setMsg('✓ Resume uploaded')
      setTimeout(() => setMsg(''), 3000)
    }
  }

  if(loading) return <div className="card">Loading profile…</div>
  if(!profile) return <div className="card">No profile found</div>

  return (
    <div>
      <div className="card">
        <h2>👤 Student Profile</h2>
        <form onSubmit={save}>
          <label>Full Name</label>
          <input name="full_name" value={profile.full_name||''} onChange={change} />
          <label>Date of Birth</label>
          <input name="dob" value={profile.dob||''} onChange={change} type="date" />
          <label>10th School</label>
          <input name="tenth_school" value={profile.tenth_school||''} onChange={change} />
          <label>10th Marks</label>
          <input name="tenth_marks" value={profile.tenth_marks||''} onChange={change} />
          <label>12th School</label>
          <input name="twelfth_school" value={profile.twelfth_school||''} onChange={change} />
          <label>12th Marks</label>
          <input name="twelfth_marks" value={profile.twelfth_marks||''} onChange={change} />
          <label>Department</label>
          <input name="department" value={profile.department||''} onChange={change} />
          <label>Semester</label>
          <input name="semester" value={profile.semester||''} onChange={change} type="number" />
          <label>Current CGPA</label>
          <input name="current_cgpa" value={profile.current_cgpa||''} onChange={change} />
          <label>Blood Group</label>
          <input name="blood_group" value={profile.blood_group||''} onChange={change} />
          <button type="submit">Save Profile</button>
        </form>
        {msg && <div className="msg">{msg}</div>}
      </div>

      <div className="card">
        <h3>💼 Skills</h3>
        <form onSubmit={submitSkill} encType="multipart/form-data">
          <label>Skill Name</label>
          <input name="name" required />
          <label>Learned Date</label>
          <input name="learned_date" type="date" />
          <label>Certificate (PDF/Image)</label>
          <input name="certificate" type="file" />
          <button type="submit">Add Skill</button>
        </form>
        <ul>
          {skills.map(s=> <li key={s.id}>
            <strong>{s.name}</strong> ({s.learned_date || 'N/A'})
            {s.certificate && <a href={s.certificate} target="_blank" rel="noopener noreferrer">📎 Certificate</a>}
            <button onClick={()=>removeSkill(s.id)}>Remove</button>
          </li>)}
        </ul>
      </div>

      <div className="card">
        <h3>📄 Upload Resume</h3>
        <form onSubmit={submitResume} encType="multipart/form-data">
          <label>Resume File (PDF)</label>
          <input name="file" type="file" accept=".pdf" required />
          <button type="submit">Upload Resume</button>
        </form>
      </div>
    </div>
  )
}
