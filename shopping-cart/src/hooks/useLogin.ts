import { useMutation } from '@tanstack/react-query'
import { authResponseSchema, type LoginInput } from '../schemas'
import { useAuthStore } from '../store/authStore'

async function login(input: LoginInput) {
  const res = await fetch('https://dummyjson.com/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...input, expiresInMins: 60 }),
  })
  if (!res.ok) throw new Error(res.status === 400 ? 'Invalid username or password' : `Login failed (${res.status})`)
  return authResponseSchema.parse(await res.json())
}

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession)
  return useMutation({
    mutationFn: login,
    onSuccess: (d) => setSession({ id: d.id, username: d.username, firstName: d.firstName }, d.accessToken),
  })
}
