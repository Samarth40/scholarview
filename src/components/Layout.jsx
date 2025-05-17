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
        className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 flex justify-between items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="flex items-center gap-2 md:gap-3" variants={itemVariants}>
          <motion.div 
            className="neo-container bg-[#fed823] text-black w-8 h-8 md:w-10 md:h-10 flex items-center justify-center font-bold text-lg md:text-xl"
            whileHover={{ rotate: 5, transition: { duration: 0.3, ease: "easeInOut" }}}
          >
            S
          </motion.div>
        <div className="font-black text-lg md:text-xl tracking-tight">ScholarView</div>
        </motion.div>
        
        {/* Authentication buttons */}
        {!user ? (
          <motion.button 
            className="neo-button bg-[#fe5d97] font-bold tracking-tight text-sm md:text-base py-1 px-3 md:py-2 md:px-4"
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
                className="neo-container bg-[#4b91ff] text-white w-8 h-8 md:w-10 md:h-10 flex items-center justify-center font-bold text-lg md:text-xl border-2 border-black relative"
                whileHover={{ rotate: 5, transition: { duration: 0.3, ease: "easeInOut" }}}
                style={{ boxShadow: "3px 3px 0px 0px rgba(0,0,0,1)" }}
              >
                {user.username?.charAt(0).toUpperCase() || 'U'}
                {/* Decorative element */}
                <motion.div 
                  className="absolute -top-1 -right-1 w-2 h-2 md:w-3 md:h-3 bg-[#fe5d97] border border-black rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
              <motion.span 
                className="ml-2 font-bold hidden sm:block text-sm md:text-base"
                animate={{ x: showProfileMenu ? 3 : 0 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {user.username || 'User'}
              </motion.span>
              <motion.svg 
                width="12" 
                height="12" 
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
                  className="absolute right-0 mt-2 w-40 sm:w-48 bg-white border-4 border-black z-50"
                  style={{ 
                    boxShadow: "6px 6px 0px 0px rgba(0,0,0,1)",
                  }}
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <div className="p-3 text-sm md:text-base">
                    <div className="font-black mb-1">{user.username || 'User'}</div>
                    <div className="text-xs text-gray-600 mb-3">{user.email || 'user@example.com'}</div>
                    
                    <div className="space-y-2">
                      <button
                        className="w-full text-left font-bold py-1 px-2 hover:bg-[#fe5d97] hover:text-white transition-colors"
                        onClick={handleOpenProfile}
                      >
                        My Profile
                      </button>
                      <button
                        className="w-full text-left font-bold py-1 px-2 hover:bg-[#fe5d97] hover:text-white transition-colors"
                        onClick={handleLogout}
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>
      
      {/* Auth modal */}
      <AnimatePresence>
        {showAuth && <AuthPage onClose={() => setShowAuth(false)} onLoginSuccess={handleLoginSuccess} />}
        {showProfilePage && <ProfilePage user={user} onClose={() => setShowProfilePage(false)} />}
      </AnimatePresence>
      
      {/* Welcome notification */}
      <AnimatePresence>
        {showWelcomeNotification && user && (
          <WelcomeNotification user={user} onClose={() => setShowWelcomeNotification(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * Hero Component with title and call-to-action
 */
export const Hero = ({ onGetStartedClick }) => {
  // Animation variants for staggered children
  const heroVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
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
        damping: 13, 
        stiffness: 100,
        mass: 0.8
      } 
    }
  };
  
  return (
    <div className="w-full relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-full h-64 -rotate-3 bg-gradient-to-r from-[#fef9c3] via-[#fcf3a3] to-[#fcf5c9] -translate-y-16"></div>
      </div>
      
      {/* Content */}
      <motion.div 
        className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 py-8 md:py-16 relative z-10" 
        variants={heroVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 mb-10 md:mb-0">
            <motion.div className="flex flex-wrap gap-2 mb-4" variants={itemVariants}>
              <div className="neo-badge bg-[#fe5d97] text-white">Academic Research</div>
              <div className="neo-badge bg-[#4b91ff] text-white">Paper Explorer</div>
            </motion.div>
            
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 tracking-tight"
              variants={itemVariants}
            >
              Discover Academic Research with{" "}
              <span className="inline-block relative">
                ScholarView
                <div className="absolute w-full h-2 bg-[#fe5d97] bottom-1 -z-10 transform -rotate-1"></div>
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl mb-6 text-gray-700 max-w-lg"
              variants={itemVariants}
            >
              Explore, filter, and organize scholarly papers with our intuitive academic paper interface.
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-3 md:gap-4"
              variants={itemVariants}
            >
              <motion.button 
                className="neo-button bg-black text-white px-5 py-2 md:px-6 md:py-3 font-bold text-base md:text-lg"
                whileHover={{ 
                  y: -4, 
                  boxShadow: "6px 10px 0px 0px rgba(0,0,0,1)",
                  transition: { type: "spring", stiffness: 400, damping: 10 }
                }}
                whileTap={{ 
                  y: 0, 
                  boxShadow: "2px 2px 0px 0px rgba(0,0,0,1)",
                  transition: { duration: 0.1 }
                }}
                onClick={onGetStartedClick}
              >
                Get Started
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="ml-2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </motion.button>
              
              <motion.button 
                className="neo-button bg-white text-black px-5 py-2 md:px-6 md:py-3 font-bold text-base md:text-lg"
                whileHover={{ 
                  y: -4, 
                  boxShadow: "6px 10px 0px 0px rgba(0,0,0,1)",
                  transition: { type: "spring", stiffness: 400, damping: 10 }
                }}
                whileTap={{ 
                  y: 0, 
                  boxShadow: "2px 2px 0px 0px rgba(0,0,0,1)",
                  transition: { duration: 0.1 }
                }}
              >
                Learn More
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.3-4.3" />
                </svg>
              </motion.button>
            </motion.div>
          </div>
          
          <motion.div 
            className="w-full md:w-1/2 pl-0 md:pl-6"
            variants={itemVariants}
          >
            <div className="relative">
              {/* Main illustration */}
              <motion.div 
                className="neo-container bg-white p-3 md:p-5 border-4 border-black transform rotate-2"
                whileHover={{ rotate: -1, y: -5, transition: { duration: 0.3 } }}
                style={{ boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)" }}
              >
                {/* Example paper card */}
                <div className="border-2 border-black p-3 md:p-4 mb-3 md:mb-4 bg-[#fed823]">
                  <div className="text-sm md:text-base font-bold mb-2">Attention is All You Need</div>
                  <div className="text-xs md:text-sm">Vaswani et al. • 2017 • 23,521 citations</div>
                </div>
                
                <div className="border-2 border-[#fe5d97] bg-white p-3 md:p-4 mb-3 md:mb-4">
                  <div className="text-sm md:text-base font-bold mb-2">Deep Residual Learning for Image Recognition</div>
                  <div className="text-xs md:text-sm">He et al. • 2016 • 107,292 citations</div>
                </div>
                
                <div className="border-2 border-[#4b91ff] bg-white p-3 md:p-4">
                  <div className="text-sm md:text-base font-bold mb-2">BERT: Pre-training of Deep Bidirectional Transformers</div>
                  <div className="text-xs md:text-sm">Devlin et al. • 2018 • 68,131 citations</div>
                </div>
              </motion.div>
              
              {/* Decoration: Search icon */}
              <motion.div 
                className="neo-container absolute -top-6 -right-6 md:-top-10 md:-right-10 bg-[#fe5d97] p-2 md:p-3 border-3 border-black z-10 hidden sm:block"
                initial={{ rotate: -10 }}
                animate={{ rotate: -5, y: [0, -10, 0] }}
                transition={{ 
                  rotate: { duration: 2, repeat: Infinity, repeatType: 'reverse' },
                  y: { duration: 3, repeat: Infinity, repeatType: 'reverse' }
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.3-4.3" />
                </svg>
              </motion.div>
              
              {/* Decoration: Star */}
              <motion.div 
                className="absolute -bottom-4 -left-4 md:-bottom-8 md:-left-8 hidden sm:block"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="#53dd6c" stroke="black" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

/**
 * Footer component
 */
export const Footer = () => {
  return (
    <footer className="bg-[#fed823] border-t-4 border-black pt-8 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* ScholarView Section */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 md:gap-3 mb-3">
              <div className="neo-container bg-white text-black w-8 h-8 flex items-center justify-center font-bold text-lg transform rotate-3 border-2 border-black">
                S
              </div>
              <span className="font-black text-lg md:text-xl tracking-tight">ScholarView</span>
            </div>
            <p className="text-sm md:text-base text-black max-w-xs">
              Explore and discover academic research papers with our powerful filtering and sorting tools. Find the most relevant papers for your research needs.
            </p>
          </div>
          
          {/* CodeCircuit Hackathon Section */}
          <div className="md:col-span-1">
            <div className="neo-container bg-white border-2 border-black p-4 transform -rotate-1">
              <h3 className="font-bold text-lg relative">
                CodeCircuit Hackathon
                <div className="h-1 bg-[#fe5d97] absolute bottom-0 left-0 right-0"></div>
              </h3>
              <p className="text-sm mt-2">
                This project was created for the CodeCircuit Hackathon, addressing the challenge:
              </p>
              <div className="bg-[#fed823] border-2 border-black p-2 mt-3 text-sm">
                <p className="italic">
                  "Academic archive with paper filters, sort by citations, and tabbed UI."
                </p>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-1 right-3 w-3 h-3 bg-[#53dd6c] border border-black"></div>
              <div className="absolute top-1 right-8 w-3 h-3 bg-[#fe5d97] border border-black"></div>
            </div>
          </div>
          
          {/* Developer Section */}
          <div className="md:col-span-1">
            <div className="neo-container bg-white border-2 border-black p-4">
              <h3 className="font-bold text-lg mb-3">Developer</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#be8cfe] flex items-center justify-center font-bold border-2 border-black">
                  S
                </div>
                <div>
                  <p className="font-bold">Samarth Shinde</p>
                  <a href="https://samarthshinde.tech" className="text-sm underline hover:text-[#fe5d97]">
                    samarthshinde.tech
                  </a>
                </div>
              </div>
              <p className="text-sm">
                Passionate about creating intuitive and visually appealing interfaces that enhance the user experience.
              </p>
            </div>
          </div>
        </div>
        
        {/* Bottom copyright and links */}
        <div className="mt-12 pt-6 border-t border-black flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm mb-4 sm:mb-0">
            &copy; 2025 ScholarView. Styled with Neobrutalism design.
          </p>
          
          <div className="flex space-x-3">
            <a 
              href="https://github.com" 
              className="w-8 h-8 bg-white border-2 border-black flex items-center justify-center hover:bg-[#f0f0f0]"
              aria-label="GitHub"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a 
              href="#" 
              className="w-8 h-8 bg-white border-2 border-black flex items-center justify-center hover:bg-[#f0f0f0]"
              aria-label="External link"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
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