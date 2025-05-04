// File System Access API utilities

// Types for file system access
interface FileInfo {
  name: string;
  handle: FileSystemFileHandle;
  type: 'file';
  thumbnail?: string;
  isVideo: boolean;
}

interface FolderInfo {
  name: string;
  handle: FileSystemDirectoryHandle;
  type: 'directory';
}

type FileSystemItem = FileInfo | FolderInfo;

// Check if File System Access API is supported
export const isFileSystemAccessSupported = (): boolean => {
  return 'showDirectoryPicker' in window;
};

// Request access to a directory and return its handle
export const requestDirectoryAccess = async (): Promise<FileSystemDirectoryHandle | null> => {
  try {
    if (!isFileSystemAccessSupported()) {
      throw new Error('File System Access API is not supported in this browser');
    }
    
    const directoryHandle = await window.showDirectoryPicker({
      mode: 'read'
    });
    
    return directoryHandle;
  } catch (error) {
    console.error('Error accessing directory:', error);
    return null;
  }
};

// Check if a file is a video
export const isVideoFile = (fileName: string): boolean => {
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mkv', '.avi', '.mov', '.wmv', '.flv'];
  return videoExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
};

// Get the contents of a directory
export const getFolderContents = async (
  directoryHandle: FileSystemDirectoryHandle
): Promise<FileSystemItem[]> => {
  const items: FileSystemItem[] = [];

  try {
    // Iterate over all entries in the directory
    for await (const [name, handle] of directoryHandle.entries()) {
      if (handle.kind === 'file') {
        const isVideo = isVideoFile(name);
        items.push({
          name,
          handle: handle as FileSystemFileHandle,
          type: 'file',
          isVideo
        });
      } else if (handle.kind === 'directory') {
        items.push({
          name,
          handle: handle as FileSystemDirectoryHandle,
          type: 'directory'
        });
      }
    }

    // Sort by type (directories first) then by name
    return items.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'directory' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
  } catch (error) {
    console.error('Error reading directory contents:', error);
    return [];
  }
};

// Get file from handle and return as a blob URL
export const getFileFromHandle = async (
  fileHandle: FileSystemFileHandle
): Promise<string> => {
  try {
    const file = await fileHandle.getFile();
    return URL.createObjectURL(file);
  } catch (error) {
    console.error('Error getting file from handle:', error);
    return '';
  }
};