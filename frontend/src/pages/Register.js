import React from 'react'
import { register } from '../api'

export default function Register({ onSuccess }){
  const [form, setForm] = React.useState({register_number:'', username:'', email:'', password:'', role:'student'})
  const [msg, setMsg] = React.useState('')

  function change(e){
    setForm({...form, [e.target.name]: e.target.value})
  }

  async function submit(e){
    e.preventDefault()
    const res = await register(form)
    if(res && res.register_number){
      setMsg('✓ Registered successfully. Please login.')
      setForm({register_number:'', username:'', email:'', password:'', role:'student'})
      setTimeout(onSuccess, 1500)
    } else {
      setMsg('✗ ' + (res.detail || JSON.stringify(res)))
    }
  }

  return (
    <div className="card">
      <h2>Register</h2>
      <form onSubmit={submit}>
        <input type="hidden" name="role" value="student" />
        <label>Register Number</label>
        <input name="register_number" value={form.register_number} onChange={change} required />
        <label>Username</label>
        <input name="username" value={form.username} onChange={change} required />
        <label>Email</label>
        <input name="email" value={form.email} onChange={change} type="email" />
        <label>Password</label>
        <input name="password" value={form.password} onChange={change} type="password" required />
        <button type="submit">Register</button>
      </form>
      {msg && <div className={`msg ${msg.includes('✗') ? 'error' : ''}`}>{msg}</div>}
    </div>
  )
}
