import React, { useState } from 'react';
import { User, Lock, Mail, Eye, EyeOff, Calendar, GraduationCap } from 'lucide-react';


export default function Auth() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gradeQualification, setGradeQualification] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async () => {
    try {
      const endpoint = isSignUp ? 'http://localhost:5000/api/register' : 'http://localhost:5000/api/login';
      const payload = isSignUp 
        ? { username, email, password, confirmPassword, date_of_birth: dateOfBirth, grade_qualification: gradeQualification }
        : { username, password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (response.ok) {
        if (isSignUp) {
          console.log('Registration successful:', data);
          // After successful registration, switch to login
          setIsSignUp(false);
          setUsername('');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          setDateOfBirth('');
          setGradeQualification('');
          alert('Registration successful! Please login.');
        } else {
          // Login successful - store token and redirect based on role
          // Note: localStorage is not available in Claude artifacts, but would work in a real app
          console.log('Login successful:', data);
          localStorage.setItem('token', data.token);
          localStorage.setItem('username', data.user.username);
          // Redirect based on user role
          if (data.user && data.user.role === 'admin') {
            console.log('Redirecting to Admin Dashboard...');
            alert(`Welcome Admin ${data.user.username}! Redirecting to Admin Dashboard...`);
            window.location.href = '/admin-dashboard';
          } else {
            console.log('Redirecting to Learner Dashboard...');
            alert(`Welcome ${username}! Redirecting to Learner Dashboard...`);
            window.location.href = '/learner-dashboard';
          }
        }
      } else {
        console.error('Error:', data.error);
        alert(data.error || 'An error occurred');
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error. Please check if the server is running.');
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setDateOfBirth('');
    setGradeQualification('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-black/20 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex flex-row min-h-[600px]">
          {/* Left Side - Welcome Content */}
          <div className="flex-1 p-8 flex flex-col justify-center text-white">
            <div className="mb-8">
              <div className="flex items-center mb-8">
                <div className="w-8 h-8 bg-white rounded mr-3"></div>
                <h1 className="text-2xl font-bold">SpeedMath</h1>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-4xl font-bold mb-4 leading-tight">
                  Welcome!
                </h2>
                <p className="text-xl text-gray-300 mb-2">
                  To Our New Website.
                </p>
              </div>
              
              <p className="text-gray-300 text-lg leading-relaxed max-w-md">
               SpeedMath is a platform designed to enhance your mathematical skills through engaging challenges and interactive learning experiences. Whether you're a beginner or an advanced learner, we have something for everyone.
              </p>
            </div>
          </div>
          
          {/* Right Side - Sign In/Up Form */}
          <div className="flex-1 bg-black/30 backdrop-blur-sm p-8 flex flex-col justify-center">
            <div className="max-w-sm mx-auto w-full">
              <h3 className="text-3xl font-bold text-white mb-8 text-center">
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </h3>
              
              <div className="space-y-6">
                {/* Username Field */}
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-transparent border-0 border-b-2 border-gray-400 text-white placeholder-gray-400 py-3 pr-10 focus:border-pink-500 focus:outline-none transition-colors"
                  />
                </div>
                
                {/* Sign Up Only Fields */}
                {isSignUp && (
                  <>
                    {/* Email Field */}
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-transparent border-0 border-b-2 border-gray-400 text-white placeholder-gray-400 py-3 pr-10 focus:border-pink-500 focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Date of Birth Field */}
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        placeholder="Date of Birth"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        className="w-full bg-transparent border-0 border-b-2 border-gray-400 text-white placeholder-gray-400 py-3 pr-10 focus:border-pink-500 focus:outline-none transition-colors"
                        required={isSignUp}
                      />
                    </div>

                    {/* Grade/Qualification Field */}
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <GraduationCap className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        value={gradeQualification}
                        onChange={(e) => setGradeQualification(e.target.value)}
                        className="w-full bg-transparent border-0 border-b-2 border-gray-400 text-white py-3 pr-10 focus:border-pink-500 focus:outline-none transition-colors appearance-none"
                        required={isSignUp}
                      >
                        <option value="" className="bg-gray-800 text-gray-300">Select Grade/Qualification</option>
                        <option value="Kindergarten" className="bg-gray-800 text-white">Kindergarten</option>
                        <option value="Grade 1" className="bg-gray-800 text-white">Grade 1</option>
                        <option value="Grade 2" className="bg-gray-800 text-white">Grade 2</option>
                        <option value="Grade 3" className="bg-gray-800 text-white">Grade 3</option>
                        <option value="Grade 4" className="bg-gray-800 text-white">Grade 4</option>
                        <option value="Grade 5" className="bg-gray-800 text-white">Grade 5</option>
                        <option value="Grade 6" className="bg-gray-800 text-white">Grade 6</option>
                        <option value="Grade 7" className="bg-gray-800 text-white">Grade 7</option>
                        <option value="Grade 8" className="bg-gray-800 text-white">Grade 8</option>
                        <option value="Grade 9" className="bg-gray-800 text-white">Grade 9</option>
                        <option value="Grade 10" className="bg-gray-800 text-white">Grade 10</option>
                        <option value="Grade 11" className="bg-gray-800 text-white">Grade 11</option>
                        <option value="Grade 12" className="bg-gray-800 text-white">Grade 12</option>
                        <option value="Undergraduate" className="bg-gray-800 text-white">Undergraduate</option>
                        <option value="Graduate" className="bg-gray-800 text-white">Graduate</option>
                        <option value="Post Graduate" className="bg-gray-800 text-white">Post Graduate</option>
                        <option value="Other" className="bg-gray-800 text-white">Other</option>
                      </select>
                    </div>
                  </>
                )}
                
                {/* Password Field */}
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent border-0 border-b-2 border-gray-400 text-white placeholder-gray-400 py-3 pr-10 focus:border-pink-500 focus:outline-none transition-colors"
                  />
                </div>
                
                {/* Confirm Password Field - Only for Sign Up */}
                {isSignUp && (
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-transparent border-0 border-b-2 border-gray-400 text-white placeholder-gray-400 py-3 pr-10 focus:border-pink-500 focus:outline-none transition-colors"
                    />
                  </div>
                )}
                
                <button
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-pink-600 to-red-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-pink-700 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  {isSignUp ? 'Sign Up' : 'Sign In'}
                </button>
                
                <p className="text-center text-gray-300 text-sm">
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                  <button 
                    onClick={toggleMode}
                    className="text-pink-400 hover:text-pink-300 transition-colors font-medium"
                  >
                    {isSignUp ? 'Sign in' : 'Sign up'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}