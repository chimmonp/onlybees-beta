import React from 'react'
import dynamic from 'next/dynamic'

const LoginPage = dynamic(() => import("../components/LoginPage"), { ssr: false });


const Login = () => {
  return (
    <LoginPage />
  )
}

export default Login