import React from 'react'
import { generateResume } from '../api_resume'

export default function ResumeBuilder(){
  const [msg, setMsg] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  async function onGenerate(e){
    e.preventDefault()
    setLoading(true)
    const res = await generateResume()
    setLoading(false)
    if(res && res.file){
      setMsg('✓ Resume generated successfully!')
      setTimeout(() => {
        window.open(res.file, '_blank')
      }, 500)
    } else {
      setMsg('✗ Error generating resume: ' + (res.detail || JSON.stringify(res)))
    }
  }

  return (
    <div className="card">
      <h2>📋 Resume Builder</h2>
      <p>Generate a professional resume PDF from your profile and skills.</p>
      <p><em>Your resume will be automatically created from your profile information, education details, and listed skills.</em></p>
      <button onClick={onGenerate} disabled={loading}>{loading ? 'Generating...' : '📥 Generate Resume PDF'}</button>
      {msg && <div className={`msg ${msg.includes('✗') ? 'error' : ''}`}>{msg}</div>}
    </div>
  )
}
