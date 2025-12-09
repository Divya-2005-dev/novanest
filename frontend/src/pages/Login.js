import React from 'react'
import { login } from '../api'

export default function Login({ onSuccess }){
  const [form, setForm] = React.useState({register_number:'', password:''})
  const [msg, setMsg] = React.useState('')

  function change(e){
    setForm({...form, [e.target.name]: e.target.value})
  }

  async function submit(e){
    e.preventDefault()
    const res = await login({register_number: form.register_number, password: form.password})
    if(res && res.access){
      localStorage.setItem('nn_access', res.access)
      localStorage.setItem('nn_refresh', res.refresh)
      localStorage.setItem('nn_role', res.role)
      setMsg('✓ Logged in successfully')
      setTimeout(() => onSuccess(res.role), 1000)
    } else {
      setMsg('✗ Login failed: ' + (res.detail || 'Invalid credentials'))
    }
  }

  return (
    <div className="card">
      <h2>Login</h2>
      <form onSubmit={submit}>
        <label>Register Number</label>
        <input name="register_number" value={form.register_number} onChange={change} required />
        <label>Password</label>
        <input name="password" value={form.password} onChange={change} type="password" required />
        <button type="submit">Login</button>
      </form>
      {msg && <div className={`msg ${msg.includes('✗') ? 'error' : ''}`}>{msg}</div>}
    </div>
  )
}
