import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Dummy credentials that will be used for fake login
const DUMMY_CREDENTIALS = {
  email: 'demo@scholarview.com',
  password: 'scholar2025'
};

const AuthPage = ({ onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showPassword, setShowPassword] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');

  // Random pattern dots for background
  const dots = Array(15).fill().map((_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: 4 + Math.random() * 8,
    delay: Math.random() * 2
  }));

  // Follow mouse effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Validate inputs
    if (!email.trim() || !password.trim()) {
      setError('All fields are required');
      setIsLoading(false);
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Simulate API call with 1.5s delay
    setTimeout(() => {
      setIsLoading(false);
      
      if (isLogin) {
        // For login, check if credentials match our dummy credentials
        if (email === DUMMY_CREDENTIALS.email && password === DUMMY_CREDENTIALS.password) {
          setSuccess('Login successful!');
          // Wait a moment to show success message before closing
          setTimeout(() => {
            // Call the onLoginSuccess callback to update the parent component's state
            if (onLoginSuccess) {
              onLoginSuccess({
                email,
                username: email.split('@')[0]
              });
            }
            onClose();
          }, 1500);
        } else {
          setError('Invalid email or password. Try the demo credentials!');
        }
      } else {
        // For signup, always succeed but suggest using the demo account
        setSuccess('Account created successfully! You can now log in.');
        // Switch to login view after a delay
        setTimeout(() => {
          setIsLogin(true);
        }, 1500);
      }
    }, 1500);
  };

  // Handle copying credentials to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  // Handle auto-filling credentials
  const autofillCredentials = () => {
    setEmail(DUMMY_CREDENTIALS.email);
    setPassword(DUMMY_CREDENTIALS.password);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: {
      scale: 1.05,
      y: -5,
      boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)",
    },
    tap: {
      scale: 0.95,
      y: 0,
      boxShadow: "2px 2px 0px 0px rgba(0,0,0,1)",
    }
  };

  // Credentials panel variants
  const credentialsPanelVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    exit: {
      opacity: 0,
      x: 50,
      transition: { duration: 0.2 }
    }
  };

  // Generate a random color based on current view
  const colors = ["#fe5d97", "#fed823", "#4b91ff", "#53dd6c", "#be8cfe"];
  const color = colors[isLogin ? 0 : 2];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Moving spotlight effect */}
      <div 
        className="fixed inset-0 w-full h-full opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(circle 300px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.15), transparent)`,
          transition: 'background 0.3s ease-out'
        }}
      />

      <div className="relative flex items-center justify-center md:space-x-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? 'login' : 'signup'}
            className="neo-container bg-white border-4 border-black w-full max-w-md relative overflow-hidden"
            style={{ 
              transform: "rotate(-1deg)",
              boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)"
            }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background pattern dots */}
            {dots.map(dot => (
              <motion.div
                key={dot.id}
                className="absolute rounded-full bg-black/10"
                style={{
                  top: dot.top,
                  left: dot.left,
                  width: dot.size,
                  height: dot.size
                }}
                animate={{ 
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 3 + dot.delay,
                  delay: dot.delay
                }}
              />
            ))}

            {/* Corner decorations */}
            <motion.div 
              className="absolute -top-2 -left-2 w-4 h-4 bg-[#fe5d97] border-2 border-black"
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
              className="absolute -bottom-2 -right-2 w-4 h-4 bg-[#4b91ff] border-2 border-black"
              animate={{ rotate: -360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />

            {/* Header */}
            <motion.div 
              className="p-6 pt-8"
              variants={itemVariants}
            >
              <motion.h2 
                className="text-3xl font-black tracking-tight leading-tight mb-1 relative z-10 text-center"
                animate={{ 
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 3
                }}
              >
                {isLogin ? 'Welcome Back' : 'Join ScholarView'}
                <motion.div 
                  className="absolute -bottom-1 left-0 h-2 w-full"
                  style={{ backgroundColor: color, zIndex: -1 }}
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                />
              </motion.h2>
              <motion.p
                className="text-center mb-6"
                variants={itemVariants}
              >
                {isLogin 
                  ? 'Enter your credentials to access your account' 
                  : 'Create your account to explore academic papers'
                }
              </motion.p>

              {/* Form */}
              <motion.form onSubmit={handleSubmit}>
                {/* Username field for signup */}
                {!isLogin && (
                  <motion.div 
                    className="mb-4"
                    variants={itemVariants}
                  >
                    <label className="block font-bold mb-1">Username</label>
                    <div className="relative">
                      <motion.input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-3 border-2 border-black bg-white focus:ring-2 focus:ring-[#4b91ff]"
                        style={{ 
                          boxShadow: "3px 3px 0px 0px rgba(0,0,0,1)",
                          transform: "translateZ(0) rotate(-0.5deg)"
                        }}
                        placeholder="Choose a username"
                        whileFocus={{ scale: 1.02, boxShadow: "5px 5px 0px 0px rgba(0,0,0,1)" }}
                      />
                      <motion.div
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 border-2 border-black rounded-full"
                        style={{ backgroundColor: username ? "#53dd6c" : "white" }}
                        animate={username ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        {username && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 flex items-center justify-center text-white font-bold"
                          >
                            ✓
                          </motion.div>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {/* Email field */}
                <motion.div 
                  className="mb-4"
                  variants={itemVariants}
                >
                  <label className="block font-bold mb-1">Email</label>
                  <div className="relative">
                    <motion.input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-3 border-2 border-black bg-white focus:ring-2 focus:ring-[#4b91ff]"
                      style={{ 
                        boxShadow: "3px 3px 0px 0px rgba(0,0,0,1)",
                        transform: "translateZ(0) rotate(0.5deg)"
                      }}
                      placeholder="your@email.com"
                      whileFocus={{ scale: 1.02, boxShadow: "5px 5px 0px 0px rgba(0,0,0,1)" }}
                    />
                    <motion.div
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 border-2 border-black rounded-full"
                      style={{ backgroundColor: email.includes('@') ? "#53dd6c" : "white" }}
                      animate={email.includes('@') ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      {email.includes('@') && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="absolute inset-0 flex items-center justify-center text-white font-bold"
                        >
                          ✓
                        </motion.div>
                      )}
                    </motion.div>
                  </div>
                </motion.div>

                {/* Password field */}
                <motion.div 
                  className="mb-4"
                  variants={itemVariants}
                >
                  <label className="block font-bold mb-1">Password</label>
                  <div className="relative">
                    <motion.input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-3 border-2 border-black bg-white focus:ring-2 focus:ring-[#4b91ff]"
                      style={{ 
                        boxShadow: "3px 3px 0px 0px rgba(0,0,0,1)",
                        transform: "translateZ(0) rotate(-0.5deg)"
                      }}
                      placeholder="Enter your password"
                      whileFocus={{ scale: 1.02, boxShadow: "5px 5px 0px 0px rgba(0,0,0,1)" }}
                    />
                    <motion.button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </motion.button>
                  </div>
                </motion.div>

                {/* Confirm Password field for signup */}
                {!isLogin && (
                  <motion.div 
                    className="mb-4"
                    variants={itemVariants}
                  >
                    <label className="block font-bold mb-1">Confirm Password</label>
                    <div className="relative">
                      <motion.input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-3 border-2 border-black bg-white focus:ring-2 focus:ring-[#4b91ff]"
                        style={{ 
                          boxShadow: "3px 3px 0px 0px rgba(0,0,0,1)",
                          transform: "translateZ(0) rotate(0.5deg)"
                        }}
                        placeholder="Confirm your password"
                        whileFocus={{ scale: 1.02, boxShadow: "5px 5px 0px 0px rgba(0,0,0,1)" }}
                      />
                      {confirmPassword && (
                        <motion.div
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          animate={
                            password && confirmPassword === password
                              ? { scale: [1, 1.2, 1] }
                              : {}
                          }
                        >
                          {password && confirmPassword === password ? "✅" : "❌"}
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Demo Credentials Button - only show for login */}
                {isLogin && (
                  <motion.div 
                    className="mb-4 flex justify-center"
                    variants={itemVariants}
                  >
                    <motion.button
                      type="button"
                      className="text-sm font-bold py-1.5 px-3 border-2 border-black bg-[#fed823]"
                      onClick={() => setShowCredentials(!showCredentials)}
                      style={{ boxShadow: "2px 2px 0px 0px rgba(0,0,0,1)" }}
                      whileHover={{ y: -2, boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)" }}
                      whileTap={{ y: 0, boxShadow: "1px 1px 0px 0px rgba(0,0,0,1)" }}
                    >
                      {showCredentials ? "Hide Demo Credentials" : "Show Demo Credentials"}
                    </motion.button>
                  </motion.div>
                )}

                {/* Error message */}
                {error && (
                  <motion.div
                    className="mb-4 p-3 border-2 border-red-500 bg-red-100 text-red-700 font-bold"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring" }}
                  >
                    {error}
                  </motion.div>
                )}

                {/* Success message */}
                {success && (
                  <motion.div
                    className="mb-4 p-3 border-2 border-green-500 bg-green-100 text-green-700 font-bold"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring" }}
                  >
                    {success}
                  </motion.div>
                )}

                {/* Submit button */}
                <motion.button
                  type="submit"
                  className="neo-button w-full font-bold text-white p-3 mt-2 border-2 border-black relative"
                  style={{ backgroundColor: color }}
                  variants={buttonVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <motion.div 
                      className="h-6 w-6 rounded-full border-4 border-white border-t-transparent mx-auto"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    />
                  ) : (
                    isLogin ? 'Log In' : 'Create Account'
                  )}
                  
                  {/* Badge decoration */}
                  <motion.div
                    className="absolute -top-2 -right-2 bg-white border-2 border-black rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                  >
                    !
                  </motion.div>
                </motion.button>
              </motion.form>

              {/* Separator */}
              <motion.div 
                className="flex items-center my-4"
                variants={itemVariants}
              >
                <div className="flex-grow h-1 bg-black/10"></div>
                <div className="px-3 text-black/50 font-bold">OR</div>
                <div className="flex-grow h-1 bg-black/10"></div>
              </motion.div>

              {/* Social login buttons */}
              <motion.div 
                className="flex gap-4 mb-6"
                variants={itemVariants}
              >
                <motion.button
                  type="button"
                  className="flex-1 p-2 bg-[#4285F4] text-white border-2 border-black font-bold"
                  style={{ boxShadow: "3px 3px 0px 0px rgba(0,0,0,1)" }}
                  whileHover={{ y: -3, boxShadow: "6px 6px 0px 0px rgba(0,0,0,1)" }}
                  whileTap={{ y: 0, boxShadow: "1px 1px 0px 0px rgba(0,0,0,1)" }}
                >
                  Google
                </motion.button>
                <motion.button
                  type="button"
                  className="flex-1 p-2 bg-[#3b5998] text-white border-2 border-black font-bold"
                  style={{ boxShadow: "3px 3px 0px 0px rgba(0,0,0,1)" }}
                  whileHover={{ y: -3, boxShadow: "6px 6px 0px 0px rgba(0,0,0,1)" }}
                  whileTap={{ y: 0, boxShadow: "1px 1px 0px 0px rgba(0,0,0,1)" }}
                >
                  Facebook
                </motion.button>
              </motion.div>

              {/* Switch between login and signup */}
              <motion.div 
                className="text-center"
                variants={itemVariants}
              >
                <p>
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  <motion.button
                    type="button"
                    className="ml-2 font-bold underline"
                    onClick={() => setIsLogin(!isLogin)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isLogin ? "Sign Up" : "Log In"}
                  </motion.button>
                </p>
              </motion.div>

              {/* Autofill Demo Credentials Button - for mobile view */}
              {isLogin && (
                <motion.div 
                  className="mt-5 text-center hidden sm:block"
                  variants={itemVariants}
                >
                  <motion.button
                    type="button"
                    className="text-sm font-medium underline"
                    onClick={autofillCredentials}
                    whileHover={{ scale: 1.05 }}
                  >
                    Quick Login with Demo Account
                  </motion.button>
                </motion.div>
              )}
            </motion.div>

            {/* Close button */}
            <motion.button
              className="absolute top-3 right-3 w-8 h-8 bg-white border-2 border-black rounded-full flex items-center justify-center font-bold"
              onClick={onClose}
              whileHover={{ rotate: 90, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ×
            </motion.button>
          </motion.div>
        </AnimatePresence>

        {/* Demo Credentials Panel */}
        <AnimatePresence>
          {showCredentials && (
            <motion.div
              className="absolute top-2 right-0 mt-6 md:relative md:top-0 md:right-0 md:mt-0 w-64"
              variants={credentialsPanelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <div 
                className="neo-container bg-[#fed823] border-4 border-black p-4 relative"
                style={{
                  transform: "rotate(2deg)",
                  boxShadow: "6px 6px 0px 0px rgba(0,0,0,1)"
                }}
              >
                <h3 className="font-black text-lg mb-2">Demo Credentials</h3>
                <div className="mb-3">
                  <div className="bg-white border-2 border-black p-2 mb-2 relative">
                    <label className="text-xs font-bold block mb-1">EMAIL:</label>
                    <div className="flex justify-between items-center">
                      <code className="font-mono">{DUMMY_CREDENTIALS.email}</code>
                      <motion.button
                        className="ml-1 p-1 bg-[#fe5d97] border border-black text-xs font-bold"
                        onClick={() => copyToClipboard(DUMMY_CREDENTIALS.email)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Copy
                      </motion.button>
                    </div>
                    {copySuccess === 'Copied!' && (
                      <motion.div 
                        className="absolute -top-2 -right-2 bg-white border-2 border-green-500 text-green-700 text-xs font-bold px-1 py-0.5 rounded-full"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                      >
                        Copied!
                      </motion.div>
                    )}
                  </div>
                  <div className="bg-white border-2 border-black p-2 mb-4">
                    <label className="text-xs font-bold block mb-1">PASSWORD:</label>
                    <div className="flex justify-between items-center">
                      <code className="font-mono">{DUMMY_CREDENTIALS.password}</code>
                      <motion.button
                        className="ml-1 p-1 bg-[#fe5d97] border border-black text-xs font-bold"
                        onClick={() => copyToClipboard(DUMMY_CREDENTIALS.password)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Copy
                      </motion.button>
                    </div>
                  </div>
                  <motion.button
                    className="w-full bg-[#4b91ff] text-white border-2 border-black font-bold p-2"
                    onClick={autofillCredentials}
                    whileHover={{ y: -2, boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)" }}
                    whileTap={{ y: 0, boxShadow: "1px 1px 0px 0px rgba(0,0,0,1)" }}
                    style={{ boxShadow: "3px 3px 0px 0px rgba(0,0,0,1)" }}
                  >
                    Autofill Credentials
                  </motion.button>
                </div>

                {/* Decorative corner element */}
                <motion.div 
                  className="absolute -top-2 -left-2 w-4 h-4 bg-[#53dd6c] border-2 border-black rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AuthPage; 