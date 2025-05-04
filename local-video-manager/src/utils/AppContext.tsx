import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types for our context
interface BaseFolderInfo {
  name: string;
  handle: FileSystemDirectoryHandle;
}

interface AppContextType {
  baseFolders: BaseFolderInfo[];
  addBaseFolder: (folder: BaseFolderInfo) => void;
  removeBaseFolder: (folderName: string) => void;
  currentPath: FileSystemDirectoryHandle | null;
  setCurrentPath: (path: FileSystemDirectoryHandle | null) => void;
  currentVideo: string | null;
  setCurrentVideo: (videoUrl: string | null) => void;
  pathHistory: FileSystemDirectoryHandle[];
  navigateBack: () => void;
}

// Create context with default values
const AppContext = createContext<AppContextType>({
  baseFolders: [],
  addBaseFolder: () => {},
  removeBaseFolder: () => {},
  currentPath: null,
  setCurrentPath: () => {},
  currentVideo: null,
  setCurrentVideo: () => {},
  pathHistory: [],
  navigateBack: () => {},
});

// Provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [baseFolders, setBaseFolders] = useState<BaseFolderInfo[]>([]);
  const [currentPath, setCurrentPath] = useState<FileSystemDirectoryHandle | null>(null);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [pathHistory, setPathHistory] = useState<FileSystemDirectoryHandle[]>([]);

  // Load saved folders on initial load
  useEffect(() => {
    const loadSavedFolders = async () => {
      try {
        // In a real app, we would verify permissions and restore handles here
        // This is a placeholder as FileSystemDirectoryHandle can't be directly stored
        const savedFolderNames = localStorage.getItem('baseFolders');
        if (savedFolderNames) {
          // In practice, we would need the user to reselect folders
          // as handles can't be persisted across sessions directly
          console.log('Found saved folder names:', savedFolderNames);
        }
      } catch (error) {
        console.error('Error loading saved folders:', error);
      }
    };

    loadSavedFolders();
  }, []);

  // Add a new base folder
  const addBaseFolder = (folder: BaseFolderInfo) => {
    setBaseFolders(prev => {
      // Avoid duplicates
      if (prev.some(f => f.name === folder.name)) {
        return prev;
      }
      const newFolders = [...prev, folder];
      
      // Save folder names (not handles) to localStorage
      try {
        const folderNames = newFolders.map(f => f.name);
        localStorage.setItem('baseFolders', JSON.stringify(folderNames));
      } catch (error) {
        console.error('Error saving folder names:', error);
      }
      
      return newFolders;
    });
  };

  // Remove a base folder
  const removeBaseFolder = (folderName: string) => {
    setBaseFolders(prev => {
      const newFolders = prev.filter(f => f.name !== folderName);
      
      // Update localStorage
      try {
        const folderNames = newFolders.map(f => f.name);
        localStorage.setItem('baseFolders', JSON.stringify(folderNames));
      } catch (error) {
        console.error('Error saving folder names:', error);
      }
      
      return newFolders;
    });
  };

  // Update path history when current path changes
  useEffect(() => {
    if (currentPath) {
      setPathHistory(prev => [...prev, currentPath]);
    }
  }, [currentPath]);

  // Navigate back in folder hierarchy
  const navigateBack = () => {
    if (pathHistory.length > 1) {
      // Remove current path and go to previous
      const newHistory = [...pathHistory];
      newHistory.pop(); // Remove current
      const previousPath = newHistory[newHistory.length - 1];
      
      setCurrentPath(previousPath);
      setPathHistory(newHistory);
    } else if (pathHistory.length === 1) {
      // If only one item in history, go back to dashboard
      setCurrentPath(null);
      setPathHistory([]);
    }
  };

  return (
    <AppContext.Provider
      value={{
        baseFolders,
        addBaseFolder,
        removeBaseFolder,
        currentPath,
        setCurrentPath,
        currentVideo,
        setCurrentVideo,
        pathHistory,
        navigateBack,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for using the context
export const useAppContext = () => useContext(AppContext);