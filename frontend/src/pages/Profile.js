import React from 'react'
import { 
  getProfile, 
  updateProfile, 
  addSkill, 
  listSkills, 
  deleteSkill, 
  uploadResume 
} from '../api_profile'

export default function Profile() {
  const [profile, setProfile] = React.useState(null)
  const [skills, setSkills] = React.useState([])
  const [msg, setMsg] = React.useState('')
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function load() {
      setLoading(true)
      const profileData = await getProfile()
      setProfile(profileData)

      const skillData = await listSkills()
      setSkills(Array.isArray(skillData) ? skillData : [])

      setLoading(false)
    }
    load()
  }, [])

  function handleChange(e) {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  async function saveProfile(e) {
    e.preventDefault()
    await updateProfile(profile)
    setMsg('✓ Profile saved')
    setTimeout(() => setMsg(''), 3000)
  }

  async function submitSkill(e) {
    e.preventDefault()
    const form = e.target.elements
    const fd = new FormData()

    fd.append('name', form.name.value)
    fd.append('learned_date', form.learned_date.value)
    if (form.certificate.files[0]) {
      fd.append('certificate', form.certificate.files[0])
    }

    const result = await addSkill(fd)
    if (result && result.id) {
      setSkills(prev => [result, ...prev])
      e.target.reset()
      setMsg('✓ Skill added')
      setTimeout(() => setMsg(''), 3000)
    }
  }

  async function removeSkill(id) {
    const deleted = await deleteSkill(id)
    if (deleted) {
      setSkills(prev => prev.filter(s => s.id !== id))
    }
  }

  async function submitResume(e) {
    e.preventDefault()
    const form = e.target.elements
    const fd = new FormData()

    if (form.file.files[0]) {
      fd.append('file', form.file.files[0])
    }

    const result = await uploadResume(fd)
    if (result && result.id) {
      e.target.reset()
      setMsg('✓ Resume uploaded')
      setTimeout(() => setMsg(''), 3000)
    }
  }

  if (loading) return <div className="card">Loading profile…</div>
  if (!profile) return <div className="card">No profile found</div>

  return (
    <div>
      <div className="card">
        <h2>👤 Student Profile</h2>
        <form onSubmit={saveProfile}>
          <label>Full Name</label>
          <input
            name="full_name"
            value={profile.full_name || ''}
            onChange={handleChange}
          />

          <label>Date of Birth</label>
          <input
            name="dob"
            type="date"
            value={profile.dob || ''}
            onChange={handleChange}
          />

          <label>10th School</label>
          <input
            name="tenth_school"
            value={profile.tenth_school || ''}
            onChange={handleChange}
          />

          <label>10th Marks</label>
          <input
            name="tenth_marks"
            value={profile.tenth_marks || ''}
            onChange={handleChange}
          />

          <label>12th School</label>
          <input
            name="twelfth_school"
            value={profile.twelfth_school || ''}
            onChange={handleChange}
          />

          <label>12th Marks</label>
          <input
            name="twelfth_marks"
            value={profile.twelfth_marks || ''}
            onChange={handleChange}
          />

          <label>Department</label>
          <input
            name="department"
            value={profile.department || ''}
            onChange={handleChange}
          />

          <label>Semester</label>
          <input
            name="semester"
            type="number"
            value={profile.semester || ''}
            onChange={handleChange}
          />

          <label>Current CGPA</label>
          <input
            name="current_cgpa"
            value={profile.current_cgpa || ''}
            onChange={handleChange}
          />

          <label>Blood Group</label>
          <input
            name="blood_group"
            value={profile.blood_group || ''}
            onChange={handleChange}
          />

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
          {skills.map(s => (
            <li key={s.id}>
              <strong>{s.name}</strong> ({s.learned_date || 'N/A'})
              {s.certificate && (
                <a
                  href={s.certificate}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📎 Certificate
                </a>
              )}
              <button onClick={() => removeSkill(s.id)}>Remove</button>
            </li>
          ))}
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
