'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { API_BASE_URL } from '@/lib/api'
import { toast } from '@/hooks/use-toast'

export default function AdminLoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const [signupName, setSignupName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/login/admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Admin login failed')
      }
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      setSuccess('Admin login successful. Redirecting...')
      toast({
        title: 'Admin signed in',
        description: 'Welcome to the admin dashboard.',
      })
      setTimeout(() => {
        window.location.href = '/account'
      }, 1000)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Admin login failed'
      setError(message)
      toast({
        title: 'Admin sign in failed',
        description: message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdminSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    if (signupPassword !== confirmPassword) {
      const message = 'Passwords do not match'
      setError(message)
      toast({
        title: 'Admin signup failed',
        description: message,
      })
      setIsLoading(false)
      return
    }
    if (signupPassword.length < 6) {
      const message = 'Password must be at least 6 characters long'
      setError(message)
      toast({
        title: 'Admin signup failed',
        description: message,
      })
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signupName,
          email: signupEmail,
          password: signupPassword,
          role: 'admin',
        }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Admin signup failed')
      }

      const loginResponse = await fetch(`${API_BASE_URL}/api/users/login/admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signupEmail, password: signupPassword }),
      })
      const loginData = await loginResponse.json()
      if (!loginResponse.ok) {
        throw new Error(loginData.error || 'Auto-login failed')
      }

      localStorage.setItem('token', loginData.token)
      localStorage.setItem('user', JSON.stringify(loginData.user))
      setSuccess('Admin account created. Redirecting...')
      toast({
        title: 'Admin account created',
        description: 'Admin account created successfully.',
      })
      setTimeout(() => {
        window.location.href = '/account'
      }, 1000)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Admin signup failed'
      setError(message)
      toast({
        title: 'Admin signup failed',
        description: message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-background">
      <aside className="relative hidden lg:flex flex-col justify-between p-12 bg-primary text-primary-foreground overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-primary-foreground" />
          <span className="text-xs uppercase tracking-[0.3em]">Noorva Admin</span>
        </div>
        <div className="space-y-6 max-w-md">
          <p className="text-xs uppercase tracking-[0.3em] text-primary-foreground/60">Private access</p>
          <h2 className="font-serif text-5xl xl:text-6xl leading-[1.05]">
            Restricted
            <br />
            operations
            <br />
            console.
          </h2>
          <p className="text-sm text-primary-foreground/70 leading-relaxed max-w-sm">
            Sign in with administrator credentials to manage catalog, orders and protected resources.
          </p>
        </div>
        <div className="flex justify-between items-end text-xs uppercase tracking-[0.25em] text-primary-foreground/50">
          <span>Protected route</span>
          <span>Noorva</span>
        </div>
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary-foreground/[0.04] blur-3xl" />
      </aside>

      <section className="flex flex-col">
        <header className="flex items-center justify-between p-6 lg:px-12 lg:py-8">
          <Link href="/" className="font-serif text-2xl tracking-tight lg:hidden">
            Noorva
          </Link>
          <div className="hidden lg:block" />
          <Link href="/" className="text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground">
            Back to shop
          </Link>
        </header>

        <div className="flex-1 flex items-center justify-center px-6 pb-12 lg:px-12">
          <div className="w-full max-w-sm space-y-8">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Admin</p>
              <h1 className="font-serif text-4xl leading-tight">
                {mode === 'login' ? 'Administrator sign in.' : 'Create admin account.'}
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {mode === 'login'
                  ? 'Use your admin account credentials to continue.'
                  : 'Register a new admin user with elevated permissions.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 rounded-none border border-border p-1">
              <Button
                type="button"
                variant={mode === 'login' ? 'default' : 'ghost'}
                className="rounded-none h-10 uppercase tracking-[0.2em] text-xs"
                onClick={() => {
                  setMode('login')
                  setError('')
                  setSuccess('')
                }}
              >
                Sign in
              </Button>
              <Button
                type="button"
                variant={mode === 'signup' ? 'default' : 'ghost'}
                className="rounded-none h-10 uppercase tracking-[0.2em] text-xs"
                onClick={() => {
                  setMode('signup')
                  setError('')
                  setSuccess('')
                }}
              >
                Sign up
              </Button>
            </div>

            {error ? (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}
            {success ? (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            ) : null}

            {mode === 'login' ? (
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                    Admin email
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="h-11 rounded-none border-x-0 border-t-0 border-b border-foreground/20 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                    Admin password
                  </Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="h-11 rounded-none border-x-0 border-t-0 border-b border-foreground/20 bg-transparent px-0 pr-8 focus-visible:ring-0 focus-visible:border-foreground"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" disabled={isLoading} className="w-full h-11 rounded-none uppercase tracking-[0.25em] text-xs">
                  {isLoading ? 'Signing in...' : 'Sign in as admin'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleAdminSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                    Full name
                  </Label>
                  <Input
                    id="signup-name"
                    type="text"
                    required
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="h-11 rounded-none border-x-0 border-t-0 border-b border-foreground/20 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                    Admin email
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="h-11 rounded-none border-x-0 border-t-0 border-b border-foreground/20 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="h-11 rounded-none border-x-0 border-t-0 border-b border-foreground/20 bg-transparent px-0 pr-8 focus-visible:ring-0 focus-visible:border-foreground"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                    Confirm password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-11 rounded-none border-x-0 border-t-0 border-b border-foreground/20 bg-transparent px-0 pr-8 focus-visible:ring-0 focus-visible:border-foreground"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" disabled={isLoading} className="w-full h-11 rounded-none uppercase tracking-[0.25em] text-xs">
                  {isLoading ? 'Creating...' : 'Create admin account'}
                </Button>
              </form>
            )}
          </div>
        </div>

        <footer className="px-6 lg:px-12 py-6 text-[11px] uppercase tracking-[0.25em] text-muted-foreground/70 flex justify-between">
          <span>Authorized use only</span>
          <span>© Noorva</span>
        </footer>
      </section>
    </main>
  )
}
