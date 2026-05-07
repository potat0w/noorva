"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navigation } from "@/components/navigation"
import { PremiumFooter } from "@/components/premium-footer"
import { AccountSidebar } from "@/components/account-sidebar"

interface UserData {
  id: string
  name: string
  email: string
  role: string
  created_at: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState("")
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const stored = localStorage.getItem("user")
    if (!token || !stored) {
      window.location.href = "/signin"
      return
    }
    try {
      const parsed = JSON.parse(stored)
      setUser(parsed)
    } catch {
      window.location.href = "/signin"
    }
  }, [])

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError("")
    setPasswordSuccess("")

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long")
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match")
      return
    }

    const token = localStorage.getItem("token")
    if (!token) {
      window.location.href = "/signin"
      return
    }

    setIsUpdatingPassword(true)
    try {
      const response = await fetch("http://localhost:5000/api/users/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Failed to update password")
      }
      setPasswordSuccess("Password updated successfully")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : "Failed to update password")
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background pt-24 lg:pt-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="font-serif text-3xl lg:text-4xl mb-2">My Account</h1>
            <p className="text-muted-foreground">Manage your profile and preferences</p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-12">
            <AccountSidebar />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex-1"
            >
              <div className="max-w-2xl">
                <h2 className="font-serif text-2xl mb-8">Personal Information</h2>

                <form className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName" className="text-xs tracking-wide uppercase text-muted-foreground">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        defaultValue={user.name.split(" ")[0] || user.name}
                        className="mt-2 border-border/50 focus:border-foreground"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-xs tracking-wide uppercase text-muted-foreground">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        defaultValue={user.name.split(" ").slice(1).join(" ")}
                        className="mt-2 border-border/50 focus:border-foreground"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-xs tracking-wide uppercase text-muted-foreground">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={user.email}
                      className="mt-2 border-border/50 focus:border-foreground"
                    />
                  </div>

                  <div className="pt-4">
                    <Button className="px-8 py-6 text-sm tracking-[0.15em] uppercase">Save Changes</Button>
                  </div>
                </form>

                <div className="mt-16 pt-16 border-t border-border">
                  <h2 className="font-serif text-2xl mb-8">Change Password</h2>
                  <form onSubmit={handlePasswordChange} className="space-y-6">
                    <div>
                      <Label htmlFor="currentPassword" className="text-xs tracking-wide uppercase text-muted-foreground">
                        Current Password
                      </Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="mt-2 border-border/50 focus:border-foreground"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="newPassword" className="text-xs tracking-wide uppercase text-muted-foreground">
                        New Password
                      </Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="mt-2 border-border/50 focus:border-foreground"
                        minLength={8}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword" className="text-xs tracking-wide uppercase text-muted-foreground">
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="mt-2 border-border/50 focus:border-foreground"
                        minLength={8}
                        required
                      />
                    </div>
                    {passwordError ? <p className="text-sm text-destructive">{passwordError}</p> : null}
                    {passwordSuccess ? <p className="text-sm text-green-600">{passwordSuccess}</p> : null}
                    <div className="pt-4">
                      <Button
                        type="submit"
                        variant="outline"
                        className="px-8 py-6 text-sm tracking-[0.15em] uppercase bg-transparent"
                        disabled={isUpdatingPassword}
                      >
                        {isUpdatingPassword ? "Updating..." : "Update Password"}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <PremiumFooter />
    </>
  )
}
