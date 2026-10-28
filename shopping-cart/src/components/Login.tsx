import { useState } from 'react'
import { useLogin } from '../hooks/useLogin'
import { loginSchema } from '../schemas'

export default function Login({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState({ username: '', password: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { mutate, isPending, error } = useLogin()

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const r = loginSchema.safeParse(form)
    if (!r.success) {
      const errs: Record<string, string> = {}
      for (const i of r.error.issues) errs[String(i.path[0])] ??= i.message
      return setErrors(errs)
    }
    setErrors({})
    mutate(r.data, { onSuccess })
  }

  return (
    <div className="grid min-h-[70vh] items-center gap-12 md:grid-cols-2">
      <div className="hidden md:block">
        <p className="eyebrow">Members</p>
        <h1 className="display mt-4 text-6xl">Welcome back.</h1>
        <p className="mt-4 max-w-sm text-mute">Sign in to shop the collection, keep your cart and check out.</p>
      </div>
      <form onSubmit={submit} className="mx-auto w-full max-w-sm space-y-8">
        <h2 className="display text-4xl md:hidden">Welcome back.</h2>
        <label className="eyebrow block">
          Username
          <input className="field mt-2 normal-case tracking-normal text-ink" autoComplete="username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          {errors.username && <span role="alert" className="mt-1 block text-xs normal-case tracking-normal text-brass">{errors.username}</span>}
        </label>
        <label className="eyebrow block">
          Password
          <input type="password" className="field mt-2 normal-case tracking-normal text-ink" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {errors.password && <span role="alert" className="mt-1 block text-xs normal-case tracking-normal text-brass">{errors.password}</span>}
        </label>
        {error && <p role="alert" className="text-sm text-brass">{error.message}</p>}
        <button disabled={isPending} className="btn w-full">{isPending ? 'Signing in…' : 'Sign in'}</button>
        <p className="text-xs text-mute">
          Demo account: <code>emilys</code> / <code>emilyspass</code>
          <button type="button" className="ml-2 underline underline-offset-4 hover:text-ink" onClick={() => setForm({ username: 'emilys', password: 'emilyspass' })}>Fill</button>
        </p>
      </form>
    </div>
  )
}
