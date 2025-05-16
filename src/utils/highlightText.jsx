import React from 'react';

/**
 * Highlights occurrences of the search query in the given text
 * @param {string} text - The text to search within
 * @param {string} query - The search query to highlight
 * @returns {JSX.Element[]} Array of text fragments and highlighted matches
 */
export const highlightText = (text, query) => {
  if (!query || !text) return text;

  try {
    // Simple case-insensitive split approach to avoid regex issues
    const lowerText = String(text).toLowerCase();
    const lowerQuery = query.toLowerCase();
    
    if (!lowerText.includes(lowerQuery)) return text;
    
    const parts = [];
    let lastIndex = 0;
    let index = lowerText.indexOf(lowerQuery);
    
    while (index !== -1) {
      // Add text before match
      if (index > lastIndex) {
        parts.push({
          text: text.substring(lastIndex, index),
          isMatch: false
        });
      }
      
      // Add matched text
      parts.push({
        text: text.substring(index, index + query.length),
        isMatch: true
      });
      
      lastIndex = index + query.length;
      index = lowerText.indexOf(lowerQuery, lastIndex);
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({
        text: text.substring(lastIndex),
        isMatch: false
      });
    }
    
    return parts.map((part, i) => (
      part.isMatch 
        ? <mark key={i} className="bg-[#fed823] font-bold px-1">{part.text}</mark>
        : <span key={i}>{part.text}</span>
    ));
  } catch (error) {
    console.error("Error in highlightText:", error);
    return text;
  }
}; 