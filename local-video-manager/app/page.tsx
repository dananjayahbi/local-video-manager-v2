"use client";

import React from "react";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import Dashboard from "../src/components/Dashboard";
import FolderView from "../src/components/FolderView";
import VideoPlayer from "../src/components/VideoPlayer";
import Settings from "../src/components/Settings";
import { AppProvider, useAppContext } from "../src/utils/AppContext";
import theme from "../src/styles/theme";

// Main content component that decides what to render based on app state
const MainContent: React.FC = () => {
  const { currentPath } = useAppContext();

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "1920px",
        margin: "0 auto",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      {!currentPath && <Dashboard />}
      {currentPath && <FolderView />}
      <VideoPlayer />
      <Settings />
    </Box>
  );
};

// Main app component
export default function Home() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <MainContent />
      </AppProvider>
    </ThemeProvider>
  );
}
