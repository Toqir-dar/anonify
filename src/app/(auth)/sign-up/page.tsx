import React from 'react'

function page() {
  return (
    <div>
        Sign Up Page
        <form action="/api/auth/sign-up" method="POST">
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit">Sign Up</button>
        </form>
    </div>
  )
}

export default page
