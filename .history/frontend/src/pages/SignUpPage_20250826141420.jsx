import React from 'react'
import { useState } from 'react'

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
    
  return (
    <div>
      signuppage
    </div>
  )
}

export default SignUpPage
