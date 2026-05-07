'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { API_BASE_URL } from '@/lib/api'
import { toast } from '@/hooks/use-toast'

export default function SignInPage() {
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setMode(params.get('mode') === 'signup' ? 'signup' : 'login')
  }, [])

  const switchMode = (nextMode: 'login' | 'signup') => {
    setMode(nextMode)
    const url = new URL(window.location.href)
    if (nextMode === 'signup') {
      url.searchParams.set('mode', 'signup')
    } else {
      url.searchParams.set('mode', 'login')
    }
    window.history.replaceState({}, '', `${url.pathname}${url.search}`)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      setSuccess('Signed in. Redirecting...')
      toast({
        title: 'Signed in',
        description: 'Welcome back to Noorva.',
      })
      setTimeout(() => {
        window.location.href = '/account'
      }, 1000)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed'
      setError(message)
      toast({
        title: 'Sign in failed',
        description: message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    if (signupPassword !== confirmPassword) {
      const message = 'Passwords do not match'
      setError(message)
      toast({
        title: 'Sign up failed',
        description: message,
      })
      setIsLoading(false)
      return
    }
    if (signupPassword.length < 8) {
      const message = 'Password must be at least 8 characters long'
      setError(message)
      toast({
        title: 'Sign up failed',
        description: message,
      })
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: signupName, email: signupEmail, password: signupPassword }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Signup failed')
      }

      const loginResponse = await fetch(`${API_BASE_URL}/api/users/login`, {
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
      setSuccess('Account created. Redirecting...')
      toast({
        title: 'Account created',
        description: 'Your account has been created successfully.',
      })
      setTimeout(() => {
        window.location.href = '/account'
      }, 1000)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Signup failed'
      setError(message)
      toast({
        title: 'Sign up failed',
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
          <span className="text-xs uppercase tracking-[0.3em]">Noorva</span>
        </div>
        <div className="space-y-6 max-w-md">
          <p className="text-xs uppercase tracking-[0.3em] text-primary-foreground/60">Volume 04 - Spring</p>
          <h2 className="font-serif text-5xl xl:text-6xl leading-[1.05]">
            Objects made
            <br />
            to outlast
            <br />
            their season.
          </h2>
          <p className="text-sm text-primary-foreground/70 leading-relaxed max-w-sm">
            A quietly considered collection of garments, ceramics and home essentials - shipped from our atelier to
            your door.
          </p>
        </div>
        <div className="flex justify-between items-end text-xs uppercase tracking-[0.25em] text-primary-foreground/50">
          <span>Est. 2018</span>
          <span>Paris - Kyoto</span>
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
          <div className="w-full max-w-md space-y-8">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                {mode === 'login' ? 'Account' : 'Become a member'}
              </p>
              <h1 className="font-serif text-4xl leading-tight">{mode === 'login' ? 'Welcome back.' : 'Create your account.'}</h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {mode === 'login'
                  ? 'Sign in to view your orders, saved items and atelier appointments.'
                  : 'Save your details for faster checkout and early access to new releases.'}
              </p>
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
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                    Email
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@domain.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="h-11 rounded-none border-x-0 border-t-0 border-b border-foreground/20 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="login-password" className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                      Password
                    </Label>
                    <button type="button" className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground">
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      placeholder="••••••••"
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
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </Button>
                <p className="pt-3 text-center text-sm text-muted-foreground">
                  New here?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('signup')}
                    className="text-foreground underline underline-offset-4"
                  >
                    Create an account
                  </button>
                </p>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                    Full name
                  </Label>
                  <Input
                    id="signup-name"
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="h-11 rounded-none border-x-0 border-t-0 border-b border-foreground/20 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                    Email
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@domain.com"
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
                      minLength={8}
                      placeholder="At least 8 characters"
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
                  <div className="flex gap-6 text-sm text-muted-foreground">
                    <span>✓ 8+ characters</span>
                    <span>✓ One number</span>
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
                  {isLoading ? 'Creating...' : 'Create account'}
                </Button>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  By creating an account you agree to our{' '}
                  <a href="#" className="text-foreground underline underline-offset-4">
                    Terms
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-foreground underline underline-offset-4">
                    Privacy Policy
                  </a>
                  .
                </p>
                <p className="text-center text-sm text-muted-foreground">
                  Already a member?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className="text-foreground underline underline-offset-4"
                  >
                    Sign in
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>

        <footer className="px-6 lg:px-12 py-6 text-[11px] uppercase tracking-[0.25em] text-muted-foreground/70 flex justify-between">
          <span>© Noorva</span>
          <span>Privacy - Terms</span>
        </footer>
      </section>
    </main>
  )
}
