import { createContext, useContext, useState } from 'react';

const DragDropContext = createContext();

export const DragDropProvider = ({ children }) => {
  const [droppedContent, setDroppedContent] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (content) => {
    setDroppedContent(content);
  };

  const clearDroppedContent = () => {
    setDroppedContent(null);
  };

  return (
    <DragDropContext.Provider
      value={{
        droppedContent,
        handleDrop,
        clearDroppedContent,
        isDragging,
        setIsDragging
      }}
    >
      {children}
    </DragDropContext.Provider>
  );
};

export const useDragDrop = () => {
  const context = useContext(DragDropContext);
  if (!context) {
    throw new Error('useDragDrop must be used within a DragDropProvider');
  }
  return context;
};