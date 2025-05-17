import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useToast } from './ToastContainer';

// Mock user stats for demonstration
const userStats = {
  papersRead: 127,
  papersSaved: 43,
  comments: 16,
  highlights: 78,
  joinDate: '2025-01-15',
  lastActive: '2025-06-10',
  interests: ['Machine Learning', 'Quantum Computing', 'Neuroscience', 'Artificial Intelligence', 'Climate Science']
};

// Mock activity history
const activityHistory = [
  { type: 'saved', paper: 'Quantum Entanglement in Neural Networks', date: '2 days ago' },
  { type: 'read', paper: 'Climate Change Effects on Marine Ecosystems', date: '5 days ago' },
  { type: 'comment', paper: 'Advanced Techniques in Machine Learning', date: '1 week ago' },
  { type: 'highlight', paper: 'Neuroplasticity and Memory Formation', date: '2 weeks ago' },
  { type: 'saved', paper: 'Artificial Intelligence Ethics Framework', date: '3 weeks ago' }
];

// Mock saved papers data
const savedPapers = [
  {
    id: 1,
    title: 'Quantum Computing: Present and Future Applications',
    authors: 'Zhang, L., Singh, R., Patel, K.',
    journal: 'International Journal of Quantum Research',
    year: 2025,
    citations: 187,
    tags: ['Quantum Computing', 'Technology']
  },
  {
    id: 2,
    title: 'Neural Interfaces and Brain-Computer Connection Technologies',
    authors: 'Johnson, A., Mehta, S., Williams, T.',
    journal: 'Neuroscience Today',
    year: 2024,
    citations: 245,
    tags: ['Neuroscience', 'Technology']
  },
  {
    id: 3,
    title: 'Climate Change Mitigation Through Advanced Carbon Capture',
    authors: 'Rodriguez, M., Chen, W., Al-Farsi, H.',
    journal: 'Environmental Science Progress',
    year: 2025,
    citations: 103,
    tags: ['Climate Science', 'Sustainability']
  },
  {
    id: 4,
    title: 'Artificial Intelligence in Predictive Healthcare',
    authors: 'Smith, J., Kumar, R., Olsen, K.',
    journal: 'Medical Technology Review',
    year: 2023,
    citations: 324,
    tags: ['AI', 'Healthcare']
  }
];

const ProfilePage = ({ user, onClose, onUpdateUser }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [animationComplete, setAnimationComplete] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoverItem, setHoverItem] = useState(null);
  const [formData, setFormData] = useState({
    displayName: user?.username || '',
    bio: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Use toast notification system
  const { showSuccess, showError } = useToast();
  
  // Refs for form elements
  const displayNameRef = useRef(null);
  
  // Update form data when user changes
  useEffect(() => {
    setFormData({
      ...formData,
      displayName: user?.username || ''
    });
  }, [user]);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call with 1s delay
    setTimeout(() => {
      // Update user data (this function will be passed from parent)
      if (onUpdateUser) {
        onUpdateUser({
          ...user,
          username: formData.displayName
        });
        
        // Show success toast notification
        showSuccess('Profile updated successfully!');
      }
      
      setIsSubmitting(false);
    }, 1000);
  };
  
  // Follow mouse effect for spotlight
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Change page title when component mounts
  useEffect(() => {
    const originalTitle = document.title;
    document.title = `${user?.username || 'User'}'s Profile | ScholarView`;
    
    return () => {
      document.title = originalTitle;
    };
  }, [user]);
  
  // Random shapes for background decoration
  const shapes = [...Array(10)].map((_, i) => ({
    id: i,
    type: ['circle', 'square', 'triangle', 'diamond'][Math.floor(Math.random() * 4)],
    color: ['#fe5d97', '#fed823', '#4b91ff', '#53dd6c', '#be8cfe'][Math.floor(Math.random() * 5)],
    size: 20 + Math.floor(Math.random() * 30),
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 3
  }));
  
  const tabVariants = {
    inactive: {
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      color: '#000',
      boxShadow: '2px 2px 0px 0px rgba(0,0,0,1)'
    },
    active: {
      backgroundColor: '#fe5d97',
      color: '#fff',
      boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)'
    }
  };
  
  const pageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 20,
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      transition: { 
        duration: 0.2,
        staggerChildren: 0.05,
        staggerDirection: -1
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
        damping: 20
      }
    },
    exit: { 
      opacity: 0, 
      y: -10,
      transition: { duration: 0.2 }
    }
  };
  
  const statCircleVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { 
        pathLength: { 
          delay: 0.5, 
          type: "spring", 
          duration: 2,
          bounce: 0
        },
        opacity: { delay: 0.5, duration: 0.5 }
      }
    }
  };
  
  const renderProfileCard = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* User Info Card */}
        <motion.div 
          className="md:col-span-1 bg-white border-3 border-black p-4 relative overflow-hidden"
          style={{ 
            boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
            transform: 'rotate(-1deg)'
          }}
          variants={itemVariants}
        >
          {/* Decorative background stripes */}
          <div className="absolute inset-0 z-0 opacity-5">
            {[...Array(8)].map((_, i) => (
              <div 
                key={i} 
                className="absolute h-[2px] bg-black w-full"
                style={{
                  top: `${i * 12}%`,
                  transform: `rotate(${i % 2 ? 3 : -3}deg)`
                }}
              />
            ))}
          </div>
          
          {/* Profile Image */}
          <motion.div 
            className="w-32 h-32 mx-auto bg-[#4b91ff] border-4 border-black rounded-full flex items-center justify-center relative mb-4"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 260,
              damping: 20,
              delay: 0.3
            }}
          >
            <span className="text-5xl font-black text-white">{user?.username?.charAt(0).toUpperCase() || 'U'}</span>
            
            {/* Animated border decoration */}
            <motion.div 
              className="absolute -top-2 -right-2 w-6 h-6 bg-[#fe5d97] border-2 border-black rounded-full"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: 360
              }}
              transition={{
                scale: {
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 2
                },
                rotate: {
                  repeat: Infinity,
                  duration: 6,
                  ease: "linear"
                }
              }}
            />
          </motion.div>
          
          <motion.div 
            className="text-center mb-6"
            variants={itemVariants}
          >
            <motion.h2 
              className="text-3xl font-black relative inline-block"
              animate={{
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              {user?.username || 'User'}
              <motion.div 
                className="absolute -bottom-1 left-0 h-3 w-full bg-[#fed823] -z-10"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.8, duration: 0.6 }}
              />
            </motion.h2>
            <p className="text-gray-600">{user?.email}</p>
          </motion.div>
          
          <motion.div 
            className="mb-6"
            variants={itemVariants}
          >
            <h3 className="font-bold mb-2 text-sm uppercase tracking-wide">Member since</h3>
            <div className="bg-black/5 p-3 border-2 border-black">
              <p className="font-mono font-bold">{userStats.joinDate}</p>
            </div>
          </motion.div>
          
          <motion.div
            variants={itemVariants}
          >
            <h3 className="font-bold mb-2 text-sm uppercase tracking-wide">Research Interests</h3>
            <div className="flex flex-wrap gap-2">
              {userStats.interests.map((interest, index) => (
                <motion.span 
                  key={interest}
                  className="text-xs font-bold py-1 px-2 border-2 border-black"
                  style={{ 
                    backgroundColor: ['#fe5d97', '#fed823', '#4b91ff', '#53dd6c', '#be8cfe'][index % 5],
                    color: ['#fe5d97', '#fed823'].includes(['#fe5d97', '#fed823', '#4b91ff', '#53dd6c', '#be8cfe'][index % 5]) ? '#000' : '#fff'
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  whileHover={{ y: -3, scale: 1.05 }}
                >
                  {interest}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </motion.div>
        
        {/* Stats & Activity Section */}
        <motion.div 
          className="md:col-span-2 bg-white border-3 border-black p-4 relative"
          style={{ 
            boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
            transform: 'rotate(1deg)'
          }}
          variants={itemVariants}
        >
          <h2 className="text-2xl font-black mb-6 relative inline-block">
            User Stats
            <motion.div 
              className="absolute -bottom-1 left-0 h-2 w-full bg-[#4b91ff] -z-10"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 0.6, duration: 0.6 }}
            />
          </h2>
          
          {/* Stats Circles */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Papers Read', value: userStats.papersRead, color: '#fe5d97', max: 200 },
              { label: 'Papers Saved', value: userStats.papersSaved, color: '#fed823', max: 100 },
              { label: 'Comments', value: userStats.comments, color: '#4b91ff', max: 50 },
              { label: 'Highlights', value: userStats.highlights, color: '#53dd6c', max: 100 }
            ].map((stat, index) => (
              <motion.div 
                key={stat.label}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-24 h-24 relative">
                  <svg width="100%" height="100%" viewBox="0 0 100 100" className="transform -rotate-90">
                    {/* Background Circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#e6e6e6"
                      strokeWidth="8"
                      fill="none"
                    />
                    {/* Progress Circle */}
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke={stat.color}
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 40}
                      strokeDashoffset={2 * Math.PI * 40 * (1 - stat.value / stat.max)}
                      variants={statCircleVariants}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.span 
                      className="text-2xl font-black"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.5 + index * 0.2 }}
                    >
                      {stat.value}
                    </motion.span>
                  </div>
                </div>
                <p className="font-bold text-sm mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
          
          {/* Recent Activity */}
          <motion.div
            variants={itemVariants}
          >
            <h2 className="text-2xl font-black mb-4 relative inline-block">
              Recent Activity
              <motion.div 
                className="absolute -bottom-1 left-0 h-2 w-full bg-[#53dd6c] -z-10"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.7, duration: 0.6 }}
              />
            </h2>
            
            <div className="space-y-3">
              {activityHistory.map((activity, index) => (
                <motion.div 
                  key={index}
                  className="border-2 border-black p-3 relative"
                  style={{ 
                    backgroundColor: hoverItem === index ? 'rgba(0,0,0,0.03)' : 'transparent',
                    transform: `rotate(${index % 2 ? 0.5 : -0.5}deg)`
                  }}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + index * 0.15 }}
                  whileHover={{ 
                    scale: 1.02, 
                    boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)"
                  }}
                  onHoverStart={() => setHoverItem(index)}
                  onHoverEnd={() => setHoverItem(null)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      <div className="mr-3">
                        {activity.type === 'saved' && (
                          <span className="bg-[#fe5d97] text-white p-1 border-2 border-black inline-block">
                            ⭐
                          </span>
                        )}
                        {activity.type === 'read' && (
                          <span className="bg-[#4b91ff] text-white p-1 border-2 border-black inline-block">
                            📖
                          </span>
                        )}
                        {activity.type === 'comment' && (
                          <span className="bg-[#fed823] text-black p-1 border-2 border-black inline-block">
                            💬
                          </span>
                        )}
                        {activity.type === 'highlight' && (
                          <span className="bg-[#53dd6c] text-white p-1 border-2 border-black inline-block">
                            ✓
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-bold">{activity.paper}</p>
                        <p className="text-sm text-gray-600">
                          {activity.type === 'saved' && 'Saved this paper'}
                          {activity.type === 'read' && 'Read this paper'}
                          {activity.type === 'comment' && 'Commented on paper'}
                          {activity.type === 'highlight' && 'Highlighted sections'}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold bg-black/10 px-2 py-1">{activity.date}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  };
  
  const renderSavedPapers = () => {
    return (
      <motion.div 
        className="bg-white border-4 border-black p-6"
        style={{ 
          boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)',
          transform: 'rotate(0.5deg)'
        }}
        variants={itemVariants}
      >
        <h2 className="text-2xl font-black mb-6 relative inline-block">
          Saved Papers
          <motion.div 
            className="absolute -bottom-1 left-0 h-2 w-full bg-[#fe5d97] -z-10"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ delay: 0.6, duration: 0.6 }}
          />
        </h2>
        
        {/* Search and filter */}
        <motion.div 
          className="mb-6 p-4 border-2 border-black bg-[#f5f5f5]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <label className="block font-bold text-sm mb-1">Search Papers</label>
              <div className="relative">
                <input 
                  type="text" 
                  className="w-full p-3 pr-10 border-2 border-black focus:ring-2 focus:ring-[#4b91ff]"
                  style={{ boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)' }}
                  placeholder="Search by title, author, or keyword..."
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <label className="block font-bold text-sm mb-1">Sort By</label>
              <select 
                className="w-full p-3 border-2 border-black focus:ring-2 focus:ring-[#4b91ff] bg-white"
                style={{ boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)' }}
              >
                <option>Most Recent</option>
                <option>Title (A-Z)</option>
                <option>Highest Citations</option>
                <option>Oldest First</option>
              </select>
            </div>
          </div>
        </motion.div>
        
        {/* Papers list */}
        <div className="space-y-4">
          {savedPapers.map((paper, index) => (
            <motion.div 
              key={paper.id}
              className="border-2 border-black p-4 bg-white relative"
              style={{ 
                transform: `rotate(${index % 2 ? 0.5 : -0.5}deg)`,
                backgroundColor: index % 2 ? '#ffffff' : '#fdfdfd' 
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.15 }}
              whileHover={{ 
                scale: 1.02, 
                boxShadow: "5px 5px 0px 0px rgba(0,0,0,1)",
                y: -3
              }}
            >
              {/* Corner fold decoration */}
              <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-r-[20px] border-t-[#fed823] border-r-[#fed823] border-b-transparent border-l-transparent"></div>
              
              <div className="flex justify-between">
                <h3 className="text-lg font-bold mb-2 pr-6">{paper.title}</h3>
                <motion.button 
                  className="text-red-500"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </motion.button>
              </div>
              
              <p className="text-sm text-gray-700 mb-3">{paper.authors} • {paper.journal} • {paper.year}</p>
              
              <div className="flex justify-between items-end">
                <div className="flex flex-wrap gap-2">
                  {paper.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="text-xs font-bold py-1 px-2 border-2 border-black"
                      style={{ 
                        backgroundColor: tag === 'Quantum Computing' ? '#fe5d97' : 
                                        tag === 'Neuroscience' ? '#4b91ff' : 
                                        tag === 'Climate Science' ? '#53dd6c' : 
                                        tag === 'AI' ? '#be8cfe' : '#fed823',
                        color: ['#fe5d97', '#fed823'].includes(tag === 'Quantum Computing' ? '#fe5d97' : 
                                tag === 'Neuroscience' ? '#4b91ff' : 
                                tag === 'Climate Science' ? '#53dd6c' : 
                                tag === 'AI' ? '#be8cfe' : '#fed823') ? '#000' : '#fff'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center space-x-1 text-sm font-medium">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                  <span>{paper.citations} citations</span>
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t border-black/10 flex justify-end space-x-2">
                <motion.button
                  className="text-xs font-bold py-1.5 px-3 border-2 border-black bg-white"
                  style={{ boxShadow: '2px 2px 0px 0px rgba(0,0,0,1)' }}
                  whileHover={{ y: -2, boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)' }}
                  whileTap={{ y: 0, boxShadow: '1px 1px 0px 0px rgba(0,0,0,1)' }}
                >
                  View Details
                </motion.button>
                <motion.button
                  className="text-xs font-bold py-1.5 px-3 border-2 border-black bg-[#4b91ff] text-white"
                  style={{ boxShadow: '2px 2px 0px 0px rgba(0,0,0,1)' }}
                  whileHover={{ y: -2, boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)' }}
                  whileTap={{ y: 0, boxShadow: '1px 1px 0px 0px rgba(0,0,0,1)' }}
                >
                  View Paper
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-6 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.button
            className="bg-[#53dd6c] text-black py-2 px-6 border-2 border-black font-bold"
            style={{ boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }}
            whileHover={{ 
              y: -3, 
              boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)'
            }}
            whileTap={{ 
              y: 0, 
              boxShadow: '2px 2px 0px 0px rgba(0,0,0,1)'
            }}
          >
            Explore More Papers
          </motion.button>
        </motion.div>
      </motion.div>
    );
  };
  
  const renderSettings = () => {
    return (
      <motion.div 
        className="bg-white border-3 border-black p-4"
        style={{ 
          boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
          transform: 'rotate(-0.5deg)'
        }}
        variants={itemVariants}
      >
        <h2 className="text-2xl font-black mb-6 relative inline-block">
          Settings
          <motion.div 
            className="absolute -bottom-1 left-0 h-2 w-full bg-[#be8cfe] -z-10"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ delay: 0.6, duration: 0.6 }}
          />
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-6">
            <motion.form 
              variants={itemVariants}
              className="border-2 border-black p-4"
              style={{ backgroundColor: '#fdfdfd' }}
              onSubmit={handleSubmit}
            >
              <h3 className="font-black text-lg mb-4 relative inline-block">
                Profile Information
                <motion.div 
                  className="absolute -bottom-1 left-0 h-1.5 w-full bg-[#fed823] -z-10"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                />
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block font-bold text-sm mb-1" htmlFor="displayName">Display Name</label>
                  <input 
                    type="text" 
                    id="displayName"
                    name="displayName"
                    ref={displayNameRef}
                    value={formData.displayName}
                    onChange={handleInputChange}
                    className="w-full p-3 border-2 border-black focus:ring-2 focus:ring-[#4b91ff]"
                    style={{ boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)' }}
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm mb-1">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full p-3 border-2 border-black focus:ring-2 focus:ring-[#4b91ff]"
                    style={{ boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)' }}
                    defaultValue={user?.email}
                    disabled
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm mb-1" htmlFor="bio">Profile Bio</label>
                  <textarea 
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="w-full p-3 border-2 border-black focus:ring-2 focus:ring-[#4b91ff]"
                    style={{ boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)' }}
                    rows={3}
                    placeholder="Tell us about your research interests..."
                  ></textarea>
                </div>
                <div className="flex justify-end">
                  <motion.button
                    type="submit"
                    className="bg-[#53dd6c] py-2 px-4 border-2 border-black font-bold text-sm"
                    style={{ boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)' }}
                    whileHover={{ y: -2, boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }}
                    whileTap={{ y: 0, boxShadow: '1px 1px 0px 0px rgba(0,0,0,1)' }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </span>
                    ) : 'Save Profile'}
                  </motion.button>
                </div>
              </div>
            </motion.form>
            
            <motion.div 
              variants={itemVariants}
              className="border-2 border-black p-4"
              style={{ backgroundColor: '#fdfdfd', transform: 'rotate(0.5deg)' }}
            >
              <h3 className="font-black text-lg mb-4 relative inline-block">
                Password & Security
                <motion.div 
                  className="absolute -bottom-1 left-0 h-1.5 w-full bg-[#4b91ff] -z-10"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                />
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block font-bold text-sm mb-1">Current Password</label>
                  <input 
                    type="password" 
                    className="w-full p-3 border-2 border-black focus:ring-2 focus:ring-[#4b91ff]"
                    style={{ boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)' }}
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm mb-1">New Password</label>
                  <input 
                    type="password" 
                    className="w-full p-3 border-2 border-black focus:ring-2 focus:ring-[#4b91ff]"
                    style={{ boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)' }}
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm mb-1">Confirm New Password</label>
                  <input 
                    type="password" 
                    className="w-full p-3 border-2 border-black focus:ring-2 focus:ring-[#4b91ff]"
                    style={{ boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)' }}
                    placeholder="Confirm new password"
                  />
                </div>
                <div className="flex justify-end">
                  <motion.button
                    className="bg-[#fe5d97] text-white py-1.5 px-4 border-2 border-black font-bold text-sm"
                    style={{ boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)' }}
                    whileHover={{ y: -2, boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }}
                    whileTap={{ y: 0, boxShadow: '1px 1px 0px 0px rgba(0,0,0,1)' }}
                  >
                    Update Password
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Right column */}
          <div className="space-y-6">
            <motion.div 
              variants={itemVariants}
              className="border-2 border-black p-4"
              style={{ backgroundColor: '#fdfdfd', transform: 'rotate(-0.3deg)' }}
            >
              <h3 className="font-black text-lg mb-4 relative inline-block">
                Notification Preferences
                <motion.div 
                  className="absolute -bottom-1 left-0 h-1.5 w-full bg-[#53dd6c] -z-10"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                />
              </h3>
              <div className="space-y-3">
                {[
                  'Email notifications for new relevant papers',
                  'Weekly digest of top papers',
                  'Comments on your activity',
                  'System announcements',
                  'New research in your field',
                  'Citation alerts for your saved papers'
                ].map((option, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center space-x-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    <div className="w-6 h-6 border-2 border-black flex items-center justify-center bg-[#fed823]">
                      <motion.div 
                        className="w-3 h-3 bg-black"
                        animate={{ 
                          scale: index === 0 || index === 2 || index === 5 ? 1 : 0
                        }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                    <span>{option}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="border-2 border-black p-4"
              style={{ backgroundColor: '#fdfdfd', transform: 'rotate(0.4deg)' }}
            >
              <h3 className="font-black text-lg mb-4 relative inline-block">
                Research Interests
                <motion.div 
                  className="absolute -bottom-1 left-0 h-1.5 w-full bg-[#fe5d97] -z-10"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 1.0, duration: 0.5 }}
                />
              </h3>
              <p className="text-sm mb-3">Select your research areas to get personalized paper recommendations</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {['Machine Learning', 'Quantum Computing', 'Neuroscience', 'Artificial Intelligence', 'Climate Science', 'Data Science', 'Robotics', 'Cryptography', 'Biotechnology'].map((interest, index) => (
                  <motion.div
                    key={interest}
                    className="border-2 border-black py-1 px-3 text-sm font-bold cursor-pointer"
                    style={{ 
                      backgroundColor: userStats.interests.includes(interest) ? ['#fe5d97', '#fed823', '#4b91ff', '#53dd6c', '#be8cfe'][index % 5] : 'white',
                      color: userStats.interests.includes(interest) ? 
                        (['#fe5d97', '#fed823'].includes(['#fe5d97', '#fed823', '#4b91ff', '#53dd6c', '#be8cfe'][index % 5]) ? 'black' : 'white') 
                        : 'black'
                    }}
                    whileHover={{ y: -2, boxShadow: "2px 2px 0px 0px rgba(0,0,0,1)" }}
                    whileTap={{ y: 0 }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.1 + index * 0.05 }}
                  >
                    {interest}
                    {userStats.interests.includes(interest) && 
                      <span className="ml-1">✓</span>
                    }
                  </motion.div>
                ))}
              </div>
              
              <div className="flex justify-end">
                <motion.button
                  className="bg-[#4b91ff] text-white py-1.5 px-4 border-2 border-black font-bold text-sm"
                  style={{ boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)' }}
                  whileHover={{ y: -2, boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }}
                  whileTap={{ y: 0, boxShadow: '1px 1px 0px 0px rgba(0,0,0,1)' }}
                >
                  Update Interests
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
        
        <motion.div 
          className="mt-8 flex justify-end gap-3"
          variants={itemVariants}
        >
          <motion.button
            className="bg-white py-2 px-6 border-2 border-black font-bold"
            style={{ boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)' }}
            whileHover={{ 
              y: -2, 
              boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)'
            }}
            whileTap={{ 
              y: 0, 
              boxShadow: '1px 1px 0px 0px rgba(0,0,0,1)'
            }}
          >
            Cancel
          </motion.button>
          <motion.button
            className="bg-[#53dd6c] py-2 px-6 border-2 border-black font-bold"
            style={{ boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }}
            whileHover={{ 
              y: -3, 
              boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)'
            }}
            whileTap={{ 
              y: 0, 
              boxShadow: '2px 2px 0px 0px rgba(0,0,0,1)'
            }}
          >
            Save All Changes
          </motion.button>
        </motion.div>
      </motion.div>
    );
  };
  
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 md:p-6 overflow-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        background: `radial-gradient(circle 500px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.1), transparent 70%),
                    rgba(0, 0, 0, 0.5)`
      }}
    >
      <motion.div 
        className="w-full max-w-3xl bg-[#f5f5f5] p-4 relative overflow-hidden max-h-[80vh] overflow-y-auto"
        style={{ 
          boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)'
        }}
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background decorations - reduce quantity for smaller modal */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {shapes.slice(0, 6).map(shape => (
            <motion.div
              key={shape.id}
              className="absolute opacity-10"
              style={{ 
                top: shape.top,
                left: shape.left,
                width: shape.size * 0.7, // Reduce size of decorations
                height: (shape.type === 'circle' || shape.type === 'square' ? shape.size : shape.size * 0.8) * 0.7,
                backgroundColor: shape.type !== 'triangle' && shape.type !== 'diamond' ? shape.color : 'transparent',
                borderRadius: shape.type === 'circle' ? '50%' : '0',
                clipPath: shape.type === 'triangle' 
                  ? 'polygon(50% 0%, 0% 100%, 100% 100%)' 
                  : shape.type === 'diamond'
                    ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
                    : 'none',
              }}
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, shape.id % 2 ? 10 : -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                repeat: Infinity,
                repeatType: "reverse",
                duration: shape.duration,
                delay: shape.delay
              }}
            />
          ))}
        </div>
        
        {/* Header with close button - more compact */}
        <div className="flex justify-between items-center mb-4">
          <motion.h1 
            className="text-2xl md:text-3xl font-black tracking-tight relative"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            My Profile
            <motion.div 
              className="absolute -bottom-1 left-0 h-2 w-full"
              style={{ backgroundColor: '#fed823', zIndex: -1 }}
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 0.4, duration: 0.8 }}
            />
            
            {/* Decorative corner element */}
            <motion.div 
              className="absolute -top-2 -left-2 w-3 h-3 bg-[#fe5d97] border-2 border-black"
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{
                scale: { delay: 0.6, duration: 0.3 },
                rotate: { delay: 0.6, duration: 3, repeat: Infinity, ease: "linear" }
              }}
            />
          </motion.h1>
          
          <motion.button
            className="w-8 h-8 bg-white border-2 border-black rounded-full flex items-center justify-center font-bold"
            onClick={onClose}
            whileHover={{ rotate: 90, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, rotate: 45 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ delay: 0.3 }}
          >
            ×
          </motion.button>
        </div>
        
        {/* Navigation Tabs - more compact */}
        <div className="flex gap-1 md:gap-2 mb-4 overflow-x-auto pb-2">
          {[
            { id: 'profile', label: 'Profile' },
            { id: 'saved', label: 'Saved Papers' },
            { id: 'settings', label: 'Settings' }
          ].map(tab => (
            <motion.button
              key={tab.id}
              className="py-1.5 px-3 md:px-4 border-2 border-black font-bold text-sm whitespace-nowrap"
              variants={tabVariants}
              animate={activeTab === tab.id ? 'active' : 'inactive'}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
              onClick={() => setActiveTab(tab.id)}
              style={{
                transform: activeTab === tab.id ? 'rotate(-1deg)' : 'rotate(0deg)'
              }}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>
        
        {/* Tab Content - Fixed display issues */}
        <div className="overflow-y-auto pb-2">
          {activeTab === 'profile' && renderProfileCard()}
          {activeTab === 'saved' && renderSavedPapers()}
          {activeTab === 'settings' && renderSettings()}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProfilePage; 