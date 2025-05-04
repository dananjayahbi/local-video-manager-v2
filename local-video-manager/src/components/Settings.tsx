import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Paper
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

import { useAppContext } from '../utils/AppContext';
import { requestDirectoryAccess } from '../utils/fileSystem';

const Settings: React.FC = () => {
  const { baseFolders, addBaseFolder, removeBaseFolder } = useAppContext();
  const [open, setOpen] = useState(false);

  // Open settings dialog
  const handleOpenSettings = () => {
    setOpen(true);
  };

  // Close settings dialog
  const handleCloseSettings = () => {
    setOpen(false);
  };

  // Add a new folder
  const handleAddFolder = async () => {
    const directoryHandle = await requestDirectoryAccess();
    if (directoryHandle) {
      addBaseFolder({
        name: directoryHandle.name,
        handle: directoryHandle,
      });
    }
  };

  // Remove a folder
  const handleRemoveFolder = (folderName: string) => {
    removeBaseFolder(folderName);
  };

  return (
    <>
      <IconButton 
        onClick={handleOpenSettings}
        color="primary"
        aria-label="settings"
        sx={{ 
          position: 'fixed', 
          bottom: 16, 
          right: 16,
          bgcolor: 'background.paper',
          boxShadow: 2,
          '&:hover': {
            bgcolor: 'background.paper',
            opacity: 0.9,
          }
        }}
      >
        <SettingsIcon />
      </IconButton>

      <Dialog
        open={open}
        onClose={handleCloseSettings}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h2">Settings</Typography>
          <IconButton edge="end" color="inherit" onClick={handleCloseSettings} aria-label="close">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent dividers>
          <Typography variant="h3" gutterBottom>
            Manage Video Folders
          </Typography>
          
          <Paper elevation={0} variant="outlined" sx={{ mb: 2 }}>
            <List dense>
              {baseFolders.length > 0 ? (
                baseFolders.map((folder, index) => (
                  <React.Fragment key={folder.name}>
                    {index > 0 && <Divider />}
                    <ListItem>
                      <ListItemText 
                        primary={folder.name} 
                      />
                      <ListItemSecondaryAction>
                        <IconButton 
                          edge="end" 
                          aria-label="delete" 
                          onClick={() => handleRemoveFolder(folder.name)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </React.Fragment>
                ))
              ) : (
                <ListItem>
                  <ListItemText 
                    primary="No folders added yet" 
                    secondary="Add a folder to start managing your videos"
                    primaryTypographyProps={{ color: 'text.secondary' }}
                  />
                </ListItem>
              )}
            </List>
          </Paper>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddFolder}
            fullWidth
          >
            Add Video Folder
          </Button>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleCloseSettings} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Settings;