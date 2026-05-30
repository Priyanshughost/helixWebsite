import React, { createContext, useState, useContext } from 'react';

// Create the context
const CursorContext = createContext();

// Custom hook to easily use the context
export const useCursor = () => useContext(CursorContext);

export const CursorProvider = ({ children }) => {
  // State to manage the cursor's shape/behavior (e.g., 'default', 'reel-hover')
  const [cursorVariant, setCursorVariant] = useState('default');
  
  // State to hold the image URL you want to show inside the cursor
  const [cursorImage, setCursorImage] = useState(null);

  return (
    <CursorContext.Provider value={{ 
      cursorVariant, 
      setCursorVariant, 
      cursorImage, 
      setCursorImage 
    }}>
      {children}
    </CursorContext.Provider>
  );
};