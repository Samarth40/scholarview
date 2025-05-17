import React, { useState, useEffect } from 'react';
import { Doodle } from './icons';
import { motion, AnimatePresence } from 'framer-motion';
import AuthPage from './AuthPage';
import ProfilePage from './ProfilePage';

// Animation variants for staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
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
      damping: 15, 
      stiffness: 200 
    } 
  }
};

const buttonVariants = {
  hover: { 
    y: -4, 
    boxShadow: "6px 10px 0px 0px rgba(0,0,0,1)",
    transition: { type: "spring", stiffness: 400, damping: 10 }
  },
  tap: { 
    y: 0, 
    boxShadow: "2px 2px 0px 0px rgba(0,0,0,1)",
    transition: { duration: 0.1 }
  }
};

/**
 * Notification Component - shown after login
 */
const WelcomeNotification = ({ user, onClose }) => {
  return (
    <motion.div
      className="fixed bottom-4 right-4 z-50"
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      <div 
        className="bg-white border-4 border-black p-4 relative overflow-hidden"
        style={{
          boxShadow: "6px 6px 0px 0px rgba(0,0,0,1)",
          maxWidth: "300px"
        }}
      >
        {/* Decorative background pattern */}
        <div className="absolute inset-0 z-0 opacity-5">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-[2px] bg-black w-full"
              style={{
                top: `${i * 20}%`,
                left: 0,
                transform: `rotate(${i % 2 ? -2 : 2}deg)`
              }}
            />
          ))}
        </div>
        
        {/* Colorful top banner */}
        <div className="h-2 bg-[#53dd6c] -m-4 mb-4"></div>
        
        <h3 className="font-black text-xl mb-2 relative z-10">Welcome, {user.username}! 👋</h3>
        <p className="text-sm mb-3 relative z-10">You have successfully signed in to ScholarView. Enjoy exploring academic papers!</p>
        
        <div className="flex justify-end">
          <motion.button
            className="px-3 py-1 bg-[#4b91ff] text-white border-2 border-black font-bold text-sm"
            onClick={onClose}
            style={{ boxShadow: "3px 3px 0px 0px rgba(0,0,0,1)" }}
            whileHover={{ y: -2, boxShadow: "5px 5px 0px 0px rgba(0,0,0,1)" }}
            whileTap={{ y: 0, boxShadow: "1px 1px 0px 0px rgba(0,0,0,1)" }}
          >
            Dismiss
          </motion.button>
        </div>
        
        {/* Decorative corner element */}
        <motion.div 
          className="absolute -top-2 -left-2 w-4 h-4 bg-[#fe5d97] border-2 border-black"
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
};

/**
 * Header component with logo and authentication controls
 */
export const Header = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState(null); // Track authentication state
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showWelcomeNotification, setShowWelcomeNotification] = useState(false);
  const [showProfilePage, setShowProfilePage] = useState(false);
  
  // Handle successful login
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    // Store in localStorage to persist between refreshes (in a real app use secure cookies/tokens)
    localStorage.setItem('scholarViewUser', JSON.stringify(userData));
    
    // Show welcome notification
    setShowWelcomeNotification(true);
    
    // Auto-dismiss notification after 5 seconds
    setTimeout(() => {
      setShowWelcomeNotification(false);
    }, 5000);
  };

  // Handle logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('scholarViewUser');
    setShowProfileMenu(false);
  };

  // Check for existing user session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('scholarViewUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('scholarViewUser');
      }
    }
  }, []);
  
  // Click outside handler for profile menu
  useEffect(() => {
    if (!showProfileMenu) return;
    
    const handleClickOutside = (event) => {
      if (showProfileMenu && !event.target.closest('.profile-menu-container')) {
        setShowProfileMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);
  
  // Open profile page handler
  const handleOpenProfile = () => {
    setShowProfilePage(true);
    setShowProfileMenu(false);
  };
  
  return (
    <div className="w-full pt-0 pb-2 mt-0">
      <motion.div 
        className="max-w-6xl mx-auto px-6 md:px-10 flex justify-between items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="flex items-center gap-3" variants={itemVariants}>
          <motion.div 
            className="neo-container bg-[#fed823] text-black w-10 h-10 flex items-center justify-center font-bold text-xl"
            whileHover={{ rotate: 5, transition: { duration: 0.3, ease: "easeInOut" }}}
          >
            S
          </motion.div>
        <div className="font-black text-xl tracking-tight">ScholarView</div>
        </motion.div>
        
        {/* Authentication buttons */}
        {!user ? (
          <motion.button 
            className="neo-button bg-[#fe5d97] font-bold tracking-tight"
            variants={itemVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => setShowAuth(true)}
          >
            Sign in
          </motion.button>
        ) : (
          <motion.div className="relative profile-menu-container" variants={itemVariants}>
            <motion.div 
              className="flex items-center cursor-pointer"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <motion.div 
                className="neo-container bg-[#4b91ff] text-white w-10 h-10 flex items-center justify-center font-bold text-xl border-2 border-black relative"
                whileHover={{ rotate: 5, transition: { duration: 0.3, ease: "easeInOut" }}}
                style={{ boxShadow: "3px 3px 0px 0px rgba(0,0,0,1)" }}
              >
                {user.username?.charAt(0).toUpperCase() || 'U'}
                {/* Decorative element */}
                <motion.div 
                  className="absolute -top-1 -right-1 w-3 h-3 bg-[#fe5d97] border border-black rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
              <motion.span 
                className="ml-2 font-bold hidden sm:block"
                animate={{ x: showProfileMenu ? 3 : 0 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {user.username || 'User'}
              </motion.span>
              <motion.svg 
                width="14" 
                height="14" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="3"
                className="ml-1" 
                animate={{ rotate: showProfileMenu ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <path d="M6 9l6 6 6-6"/>
              </motion.svg>
            </motion.div>
            
            {/* Profile dropdown menu */}
            <AnimatePresence>
              {showProfileMenu && (
                <motion.div 
                  className="absolute right-0 mt-2 w-48 bg-white border-4 border-black z-50"
                  style={{ 
                    boxShadow: "6px 6px 0px 0px rgba(0,0,0,1)",
                    transform: "rotate(-1deg)"
                  }}
                  initial={{ opacity: 0, y: -20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="p-3 border-b-2 border-black">
                    <p className="font-bold text-sm">Signed in as:</p>
                    <p className="text-sm truncate font-medium">{user.email}</p>
                  </div>
                  <div className="p-2">
                    <motion.button 
                      className="w-full text-left px-3 py-2 font-bold text-sm hover:bg-black/5 flex items-center"
                      whileHover={{ x: 3 }}
                      onClick={handleOpenProfile}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      Profile
                    </motion.button>
                    <motion.button 
                      className="w-full text-left px-3 py-2 font-bold text-sm hover:bg-black/5 flex items-center"
                      whileHover={{ x: 3 }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      Saved Papers
                    </motion.button>
                    <div className="border-t-2 border-black/10 my-1"></div>
                    <motion.button 
                      className="w-full text-left px-3 py-2 font-bold text-sm hover:bg-black/5 flex items-center text-red-600"
                      whileHover={{ x: 3, backgroundColor: "rgba(239, 68, 68, 0.05)" }}
                      onClick={handleLogout}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      Sign out
                    </motion.button>
      </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>
      
      {/* Authentication modal */}
      {showAuth && <AuthPage onClose={() => setShowAuth(false)} onLoginSuccess={handleLoginSuccess} />}
      
      {/* Profile page */}
      <AnimatePresence>
        {showProfilePage && user && (
          <ProfilePage 
            user={user} 
            onClose={() => setShowProfilePage(false)} 
            onUpdateUser={(updatedUser) => {
              setUser(updatedUser);
              localStorage.setItem('scholarViewUser', JSON.stringify(updatedUser));
            }}
          />
        )}
      </AnimatePresence>
      
      {/* Welcome notification */}
      <AnimatePresence>
        {showWelcomeNotification && user && (
          <WelcomeNotification 
            user={user} 
            onClose={() => setShowWelcomeNotification(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * Hero component with main title and description - enhanced with neobrutalism style
 */
export const Hero = () => {
  // Array of decorative shapes for the background
  const shapes = [
    { type: 'circle', size: 80, color: '#fe5d97', top: '10%', left: '8%', delay: 0.1 },
    { type: 'square', size: 60, color: '#fed823', top: '70%', left: '15%', delay: 0.3 },
    { type: 'triangle', size: 70, color: '#4b91ff', top: '25%', left: '80%', delay: 0.5 },
    { type: 'circle', size: 50, color: '#53dd6c', top: '75%', left: '85%', delay: 0.7 },
    { type: 'square', size: 40, color: '#be8cfe', top: '15%', left: '45%', delay: 0.2 },
    { type: 'diamond', size: 55, color: '#fe5d97', top: '60%', left: '60%', delay: 0.4 },
    { type: 'circle', size: 30, color: '#4b91ff', top: '40%', left: '25%', delay: 0.6 }
  ];
  
  // Floating dots for background decoration
  const floatingDots = [
    { top: '15%', left: '10%', size: 8, delay: 0.2 },
    { top: '25%', left: '20%', size: 6, delay: 0.5 },
    { top: '65%', left: '15%', size: 5, delay: 0.8 },
    { top: '35%', left: '85%', size: 7, delay: 0.3 },
    { top: '70%', left: '80%', size: 4, delay: 0.6 },
    { top: '40%', left: '50%', size: 5, delay: 0.9 },
    { top: '80%', left: '40%', size: 6, delay: 0.4 },
  ];
  
  // Decorative lines
  const lines = [
    { top: '20%', left: '0%', width: '15%', angle: 0, delay: 0.3 },
    { top: '30%', right: '0%', width: '15%', angle: 180, delay: 0.5 },
    { top: '60%', left: '30%', width: '8%', angle: 45, delay: 0.7 },
    { top: '75%', right: '25%', width: '10%', angle: -30, delay: 0.4 },
  ];

  // Papers count animation
  const paperCount = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut", delay: 1.2 }
    }
  };

  return (
    <motion.div 
      className="relative overflow-hidden pt-0 bg-gradient-to-b from-[#fcfcfc] to-[#f5f5f5]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Animated gradient background */}
      <motion.div 
        className="absolute inset-0 -z-10 opacity-20"
        animate={{
          background: [
            'radial-gradient(circle at 30% 20%, rgba(254, 93, 151, 0.3), transparent 30%), radial-gradient(circle at 70% 60%, rgba(75, 145, 255, 0.3), transparent 30%)',
            'radial-gradient(circle at 40% 40%, rgba(254, 93, 151, 0.3), transparent 30%), radial-gradient(circle at 60% 30%, rgba(75, 145, 255, 0.3), transparent 30%)',
            'radial-gradient(circle at 30% 60%, rgba(254, 93, 151, 0.3), transparent 30%), radial-gradient(circle at 70% 40%, rgba(75, 145, 255, 0.3), transparent 30%)',
            'radial-gradient(circle at 30% 20%, rgba(254, 93, 151, 0.3), transparent 30%), radial-gradient(circle at 70% 60%, rgba(75, 145, 255, 0.3), transparent 30%)'
          ]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />

      {/* Floating dots */}
      {floatingDots.map((dot, index) => (
        <motion.div
          key={`dot-${index}`}
          className="absolute rounded-full border-2 border-black"
          style={{
            top: dot.top,
            left: dot.left,
            width: dot.size,
            height: dot.size,
            backgroundColor: '#000000',
            opacity: 0.15,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 0.15, 
            scale: 1,
            y: [0, -15, 0],
          }}
          transition={{
            y: {
              repeat: Infinity,
              duration: 3 + Math.random() * 2,
              ease: "easeInOut",
            },
            opacity: { delay: dot.delay, duration: 0.8 },
            scale: { delay: dot.delay, duration: 0.8 }
          }}
        />
      ))}

      {/* Decorative lines */}
      {lines.map((line, index) => (
        <motion.div
          key={`line-${index}`}
          className="absolute h-[2px] bg-black opacity-10"
          style={{
            top: line.top,
            left: line.left,
            right: line.right,
            width: line.width,
            transform: `rotate(${line.angle}deg)`,
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 0.1 }}
          transition={{ delay: line.delay, duration: 0.8 }}
        />
      ))}

      {/* Background shapes */}
      {shapes.map((shape, index) => (
        <motion.div
          key={index}
          className="absolute z-0 hidden md:block"
          style={{ 
            top: shape.top, 
            left: shape.left,
            width: shape.size,
            height: shape.type === 'triangle' ? shape.size * 0.866 : shape.size, // Height adjustment for triangles
            backgroundColor: shape.type !== 'triangle' && shape.type !== 'diamond' ? shape.color : 'transparent',
            borderRadius: shape.type === 'circle' ? '50%' : '0',
            clipPath: shape.type === 'triangle' 
              ? 'polygon(50% 0%, 0% 100%, 100% 100%)' 
              : shape.type === 'diamond'
                ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
                : 'none',
            border: '3px solid black',
            zIndex: 0,
            opacity: 0.7
          }}
          initial={{ opacity: 0, scale: 0, rotate: -20 }}
          animate={{ 
            opacity: 0.7, 
            scale: 1, 
            rotate: 0,
            y: [0, -8, 0],
          }}
          transition={{ 
            delay: shape.delay, 
            duration: 0.8, 
            type: "spring", 
            stiffness: 200,
            y: {
              repeat: Infinity,
              duration: 4 + Math.random() * 3,
              ease: "easeInOut",
              delay: shape.delay,
            }
          }}
          whileHover={{ 
            scale: 1.1,
            rotate: 5, 
            transition: { duration: 0.3 }
          }}
        />
      ))}

      {/* Main content area - centered within full width */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 relative z-10 pt-0">
        {/* Spotlight effect */}
        <motion.div
          className="absolute w-[120%] h-[400px] bg-[#fed823] rounded-full opacity-10 blur-[100px] -top-[100px] -left-[10%]"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.05, 0.1, 0.05] }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />

        <motion.div 
          className="text-center mt-6"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div
            className="inline-block relative"
            whileHover={{ scale: 1.05 }}
          >
            <motion.span 
              className="inline-block py-2 px-4 mb-3 bg-[#4b91ff] text-white text-sm md:text-base font-bold border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ y: -5 }}
            >
              DISCOVER RESEARCH
            </motion.span>
            <motion.div 
              className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#fe5d97] border-2 border-black"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        </motion.div>

        <motion.div 
          className="relative mx-auto mb-8"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 300, 
            damping: 24,
            delay: 0.6 
          }}
        >
          {/* Animated stripes background */}
          <motion.div 
            className="absolute inset-0 -z-10 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={`stripe-${i}`}
                className="absolute h-1.5 bg-black opacity-[0.03]"
                style={{
                  top: `${i * 22}%`,
                  left: 0,
                  right: 0,
                }}
                animate={{
                  x: [0, 10, 0, -10, 0],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>

          <motion.div 
            className="neo-container bg-[#fed823] py-8 px-8 md:px-12 mx-auto relative transform rotate-0 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            whileHover={{ 
              rotate: 0.5, 
              transition: { duration: 0.3 } 
            }}
          >
            {/* Decorative corner elements */}
            <motion.div 
              className="absolute -top-2 -left-2 w-4 h-4 bg-[#fe5d97] border-2 border-black"
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 180, 360] }}
              transition={{ 
                scale: { delay: 1.2, duration: 0.3 },
                rotate: { delay: 1.2, duration: 3, repeat: Infinity, ease: "linear" }
              }}
            />
            <motion.div 
              className="absolute -bottom-2 -right-2 w-4 h-4 bg-[#4b91ff] border-2 border-black"
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, -180, -360] }}
              transition={{ 
                scale: { delay: 1.3, duration: 0.3 },
                rotate: { delay: 1.3, duration: 3, repeat: Infinity, ease: "linear" }
              }}
            />

            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight text-black mb-1 relative z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <motion.span
                className="block"
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.7, type: "spring" }}
              >
                Academic Paper
              </motion.span>
              <motion.span
                className="text-[#fe5d97] relative inline-block mt-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
              >
                Explorer
                <motion.div 
                  className="absolute -bottom-2 left-0 h-3 w-full bg-[#53dd6c] -z-10"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                />
              </motion.span>
            </motion.h1>
          </motion.div>

          {/* Paper stack decoration */}
          <motion.div 
            className="absolute -right-6 -bottom-8 w-24 h-28 bg-white border-2 border-black rotate-6 z-0 hidden md:block"
            animate={{ 
              rotate: [6, -2, 6],
              y: [0, -5, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 5,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute -right-3 -bottom-4 w-24 h-28 bg-[#be8cfe] border-2 border-black rotate-3 z-1 hidden md:block"
            animate={{ 
              rotate: [3, -4, 3],
              y: [0, -3, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 6,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
          <motion.div 
            className="absolute -right-8 -bottom-2 w-16 h-20 bg-[#53dd6c] border-2 border-black rotate-12 z-2 hidden md:block"
            animate={{ 
              rotate: [12, 8, 12],
              y: [0, -6, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 7,
              ease: "easeInOut",
              delay: 0.3
            }}
          />
        </motion.div>

        <motion.div 
          className="text-center max-w-2xl mx-auto mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <motion.p 
            className="text-lg md:text-xl font-medium"
            whileHover={{ scale: 1.03 }}
          >
            <motion.span
              className="inline-block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.5 }}
            >
              Discover, filter, and organize academic research with our powerful search tools. 
            </motion.span>{" "}
            <motion.span
              className="inline-block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.5 }}
            >
              Explore papers by citation count, publication date, or research area.
            </motion.span>
          </motion.p>
        </motion.div>

        {/* Paper stats */}
        <motion.div 
          className="flex justify-center gap-8 mb-8"
          variants={paperCount}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="text-center"
            whileHover={{ scale: 1.1, y: -5 }}
          >
            <motion.div 
              className="text-xl md:text-2xl font-black text-[#fe5d97] relative"
              animate={{ 
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                repeatDelay: 3
              }}
            >
              <motion.div
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full border-2 border-[#fe5d97] opacity-0"
                animate={{ 
                  scale: [1, 1.8, 1],
                  opacity: [0, 0.4, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              />
              10,000+
            </motion.div>
            <div className="text-sm font-bold">Research Papers</div>
          </motion.div>
          
          <motion.div 
            className="text-center"
            whileHover={{ scale: 1.1, y: -5 }}
          >
            <motion.div 
              className="text-xl md:text-2xl font-black text-[#4b91ff] relative"
              animate={{ 
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                repeatDelay: 3.5,
                delay: 0.5
              }}
            >
              <motion.div
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full border-2 border-[#4b91ff] opacity-0"
                animate={{ 
                  scale: [1, 1.8, 1],
                  opacity: [0, 0.4, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 3.5,
                  delay: 0.5
                }}
              />
              250+
            </motion.div>
            <div className="text-sm font-bold">Academic Journals</div>
          </motion.div>
          
          <motion.div 
            className="text-center"
            whileHover={{ scale: 1.1, y: -5 }}
          >
            <motion.div 
              className="text-xl md:text-2xl font-black text-[#53dd6c] relative"
              animate={{ 
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                repeatDelay: 4,
                delay: 1
              }}
            >
              <motion.div
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full border-2 border-[#53dd6c] opacity-0"
                animate={{ 
                  scale: [1, 1.8, 1],
                  opacity: [0, 0.4, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 4,
                  delay: 1
                }}
              />
              500+
            </motion.div>
            <div className="text-sm font-bold">Authors</div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

/**
 * Footer component
 */
export const Footer = () => {
  return (
    <motion.footer 
      className="neo-container bg-[#4b91ff] text-black w-full py-12 mt-auto transform -rotate-1"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto text-center px-4">
        <motion.div 
          className="flex flex-col items-center mb-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="flex items-center gap-2 mb-4" variants={itemVariants}>
            <motion.div 
              className="neo-container bg-white text-black w-10 h-10 flex items-center justify-center font-bold transform rotate-12"
              whileHover={{ rotate: 20, transition: { duration: 0.3, ease: "easeInOut" }}}
            >
              S
            </motion.div>
            <div className="text-xl font-black">ScholarView</div>
          </motion.div>
          <motion.p className="max-w-lg mx-auto text-sm font-medium" variants={itemVariants}>
            Explore and discover academic research papers with our powerful filtering and sorting tools.
            Find the most relevant papers for your research needs.
          </motion.p>
        </motion.div>
        <motion.div 
          className="border-t border-black pt-6 text-sm font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p>© 2025 ScholarView. Styled with Neobrutalism design.</p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

/**
 * Background decorations component
 */
export const BackgroundDecorations = () => {
  return (
    <>
      <motion.div 
        className="absolute top-24 right-10 rotate-12 opacity-50"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 0.5, x: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
      >
        <Doodle type="stars" />
      </motion.div>
      <motion.div 
        className="absolute bottom-16 left-10 -rotate-12 opacity-50"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 0.5, x: 0 }}
        transition={{ duration: 0.7, delay: 0.7 }}
      >
        <Doodle type="zigzag" />
      </motion.div>
      <motion.div 
        className="absolute top-1/2 right-16 opacity-50"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 0.5, y: 0 }}
        transition={{ duration: 0.7, delay: 0.9 }}
      >
        <Doodle type="circles" />
      </motion.div>
    </>
  );
}; 