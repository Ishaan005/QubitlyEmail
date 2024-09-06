"use client"

import { useState } from "react"
import { useAuth, RedirectToSignIn } from "@clerk/nextjs"

export default function Home() {
  const { isSignedIn } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [content, setContent] = useState("")
  const [userId, setUserId] = useState("")

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    })
    const data = await response.json()
    setUserId(data.id)
    alert(`User created with ID: ${data.id}`)
  }

  const createEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch('/api/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, content, userId }),
    })
    const data = await response.json()
    alert(`Email created with ID: ${data.id}`)
  }

    // Redirect to sign-in if the user is not signed in
  if (!isSignedIn) {
      return <RedirectToSignIn />;
    }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Qubitly Email</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Create User</h2>
        <form onSubmit={createUser} className="space-y-2">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 w-full"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Create User
          </button>
        </form>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Create Email</h2>
        <form onSubmit={createEmail} className="space-y-2">
          <input
            type="text"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="border p-2 w-full"
          />
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="border p-2 w-full"
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="border p-2 w-full h-32"
          />
          <button type="submit" className="bg-green-500 text-white p-2 rounded">
            Create Email
          </button>
        </form>
      </div>
    </div>
  )

}