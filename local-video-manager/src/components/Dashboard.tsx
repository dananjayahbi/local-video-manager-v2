import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActionArea,
  Button,
  IconButton,
  Tooltip
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import { requestDirectoryAccess } from '../utils/fileSystem';
import { useAppContext } from '../utils/AppContext';

const Dashboard: React.FC = () => {
  const { baseFolders, addBaseFolder, removeBaseFolder, setCurrentPath } = useAppContext();

  // Handler to add a new folder
  const handleAddFolder = async () => {
    const directoryHandle = await requestDirectoryAccess();
    if (directoryHandle) {
      addBaseFolder({
        name: directoryHandle.name,
        handle: directoryHandle,
      });
    }
  };

  // Handler to open a folder
  const handleOpenFolder = (handle: FileSystemDirectoryHandle) => {
    setCurrentPath(handle);
  };

  // Handler to remove a folder
  const handleRemoveFolder = (name: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the folder
    removeBaseFolder(name);
  };

  return (
    <Box sx={{ p: 3, maxWidth: '1920px', margin: '0 auto' }}>
      <Typography variant="h1" component="h1" gutterBottom>
        Local Video Manager
      </Typography>
      
      <Button 
        variant="contained" 
        startIcon={<AddIcon />} 
        onClick={handleAddFolder}
        sx={{ mb: 4 }}
      >
        Add Video Folder
      </Button>
      
      <Grid container spacing={3}>
        {baseFolders.map((folder) => (
          <Grid item key={folder.name} xs={6} sm={4} md={3} lg={2}>
            <Card 
              sx={{ 
                height: '150px', 
                display: 'flex', 
                flexDirection: 'column',
                position: 'relative'
              }}
            >
              <CardActionArea 
                sx={{ 
                  flex: 1, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  p: 2
                }}
                onClick={() => handleOpenFolder(folder.handle)}
              >
                <FolderIcon sx={{ fontSize: 60, color: 'primary.main', mb: 1 }} />
                <CardContent sx={{ p: 1, textAlign: 'center' }}>
                  <Typography variant="body1" noWrap sx={{ maxWidth: '100%' }}>
                    {folder.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <Tooltip title="Remove folder">
                <IconButton 
                  size="small" 
                  sx={{ 
                    position: 'absolute', 
                    top: 4, 
                    right: 4,
                    bgcolor: 'rgba(255,255,255,0.7)',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.9)',
                    }
                  }}
                  onClick={(e) => handleRemoveFolder(folder.name, e)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Card>
          </Grid>
        ))}
        
        {baseFolders.length === 0 && (
          <Grid item xs={12}>
            <Box sx={{ 
              height: '200px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexDirection: 'column',
              bgcolor: 'background.paper',
              borderRadius: 1,
              p: 3
            }}>
              <Typography variant="h3" gutterBottom>
                No folders added yet
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Click "Add Video Folder" to start browsing your video collection.
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />} 
                onClick={handleAddFolder}
              >
                Add Video Folder
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Dashboard;