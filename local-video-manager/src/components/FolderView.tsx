import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActionArea,
  CardMedia,
  IconButton,
  Breadcrumbs,
  Link,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import VideoFileIcon from '@mui/icons-material/VideoFile';

import { useAppContext } from '../utils/AppContext';
import { getFolderContents, getFileFromHandle } from '../utils/fileSystem';
import { generateThumbnail, getCachedThumbnail, cacheThumbnail } from '../utils/thumbnailGenerator';

// Types from fileSystem.ts
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

const FolderView: React.FC = () => {
  const { currentPath, setCurrentPath, setCurrentVideo, navigateBack } = useAppContext();
  const [contents, setContents] = useState<FileSystemItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load folder contents when currentPath changes
  useEffect(() => {
    const loadFolderContents = async () => {
      if (!currentPath) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const folderContents = await getFolderContents(currentPath);
        setContents(folderContents);
      } catch (err) {
        console.error('Error loading folder contents:', err);
        setError('Failed to load folder contents. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadFolderContents();
  }, [currentPath]);

  // Load thumbnails for video files
  useEffect(() => {
    const loadThumbnails = async () => {
      if (!contents.length) return;
      
      // Process only video files
      const videoFiles = contents.filter(item => 
        item.type === 'file' && 'isVideo' in item && item.isVideo
      ) as FileInfo[];
      
      if (!videoFiles.length) return;
      
      // For each video file, try to get/generate thumbnail
      for (const videoFile of videoFiles) {
        try {
          // Try to get cached thumbnail first
          const cachedThumb = getCachedThumbnail(videoFile.name);
          if (cachedThumb) {
            // Update the file with cached thumbnail
            setContents(prev => prev.map(item => {
              if (item.type === 'file' && item.name === videoFile.name) {
                return { ...item, thumbnail: cachedThumb };
              }
              return item;
            }));
            continue;
          }
          
          // If no cached thumbnail, generate one
          const videoUrl = await getFileFromHandle(videoFile.handle);
          if (videoUrl) {
            const thumbnailUrl = await generateThumbnail(videoUrl);
            
            // Cache the thumbnail
            cacheThumbnail(videoFile.name, thumbnailUrl);
            
            // Update the file with new thumbnail
            setContents(prev => prev.map(item => {
              if (item.type === 'file' && item.name === videoFile.name) {
                return { ...item, thumbnail: thumbnailUrl };
              }
              return item;
            }));
          }
        } catch (err) {
          console.error(`Error generating thumbnail for ${videoFile.name}:`, err);
        }
      }
    };
    
    loadThumbnails();
  }, [contents]);

  // Handle folder click
  const handleFolderClick = (folderHandle: FileSystemDirectoryHandle) => {
    setCurrentPath(folderHandle);
  };

  // Handle video click
  const handleVideoClick = async (fileHandle: FileSystemFileHandle) => {
    try {
      const videoUrl = await getFileFromHandle(fileHandle);
      if (videoUrl) {
        setCurrentVideo(videoUrl);
      }
    } catch (err) {
      console.error('Error loading video:', err);
      setError('Failed to load video. Please try again.');
    }
  };

  // Handle back button click
  const handleBackClick = () => {
    navigateBack();
  };

  // Handle home button click
  const handleHomeClick = () => {
    setCurrentPath(null);
  };

  if (!currentPath) {
    return null; // Don't render anything if no current path
  }

  return (
    <Box sx={{ p: 3, maxWidth: '1920px', margin: '0 auto' }}>
      {/* Header with breadcrumbs and navigation */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={handleBackClick} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        
        <IconButton onClick={handleHomeClick} sx={{ mr: 2 }}>
          <HomeIcon />
        </IconButton>
        
        <Breadcrumbs aria-label="breadcrumb">
          <Typography variant="h2">
            {currentPath.name}
          </Typography>
        </Breadcrumbs>
      </Box>
      
      {/* Loading indicator */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {/* Error message */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>
      
      {/* Folder contents */}
      {!loading && (
        <Grid container spacing={3}>
          {contents.map((item) => (
            <Grid item key={item.name} xs={6} sm={4} md={3} lg={2}>
              {item.type === 'directory' ? (
                // Folder card
                <Card sx={{ height: '150px', display: 'flex', flexDirection: 'column' }}>
                  <CardActionArea 
                    sx={{ 
                      flex: 1, 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      p: 2
                    }}
                    onClick={() => handleFolderClick(item.handle)}
                  >
                    <FolderIcon sx={{ fontSize: 60, color: 'primary.main', mb: 1 }} />
                    <CardContent sx={{ p: 1, textAlign: 'center' }}>
                      <Typography variant="body1" noWrap sx={{ maxWidth: '100%' }}>
                        {item.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ) : (
                // File card (only show video files)
                'isVideo' in item && item.isVideo && (
                  <Card sx={{ height: '150px', display: 'flex', flexDirection: 'column' }}>
                    <CardActionArea 
                      sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}
                      onClick={() => handleVideoClick(item.handle)}
                    >
                      {item.thumbnail ? (
                        <CardMedia
                          component="img"
                          height="100"
                          image={item.thumbnail}
                          alt={item.name}
                        />
                      ) : (
                        <Box sx={{ 
                          height: '100px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          bgcolor: 'background.paper'
                        }}>
                          <VideoFileIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                        </Box>
                      )}
                      <CardContent sx={{ p: 1, flexGrow: 1 }}>
                        <Typography variant="body1" noWrap sx={{ maxWidth: '100%' }}>
                          {item.name}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                )
              )}
            </Grid>
          ))}
          
          {contents.length === 0 && !loading && (
            <Grid item xs={12}>
              <Box sx={{ 
                height: '200px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                bgcolor: 'background.paper',
                borderRadius: 1,
                p: 3
              }}>
                <Typography variant="h3">
                  This folder is empty
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default FolderView;