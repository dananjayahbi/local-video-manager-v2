# Local Video Management Web App

## Introduction

This document provides detailed instructions for the Agentic AI to develop a web application designed for a video collector to manage and play local videos stored across multiple folders on their PC. The app will consolidate video management into a single, user-friendly interface, featuring a modern design, an advanced embedded video player, and interaction with the local file system via browser APIs. You, the Agentic AI, will build this app using NextJS with TypeScript and Material-UI (MUI) for styling, optimized for 1920x1080 resolution displays.

---

## Requirements

### Functional Requirements

1. **Video Management**
   - Enable the addition of multiple base folder paths where videos are stored using the File System Access API.
   - Display these base folders as clickable icons in a desktop-like dashboard environment.
   - Allow navigation through folders and subfolders within the app, mimicking Windows Explorer functionality.
   - List video files with their thumbnails, generated or retrieved from the local file system.
   - Facilitate video playback via an embedded advanced video player.

2. **Advanced Video Player**
   - Integrate a feature-rich video player with the following capabilities:
     - Play, pause, and stop controls.
     - Seek bar with time indicators.
     - Volume control.
     - Full-screen mode.
     - Subtitle support (load from file or embedded).
     - Playback speed adjustment (e.g., 0.5x, 1x, 1.5x, 2x).
     - Picture-in-picture mode.
     - Keyboard shortcuts for all major controls.

3. **User Interface**
   - Utilize Material-UI (MUI) to craft a modern, professional-looking interface.
   - Ensure all UI elements are aligned and optimized for 1920x1080 resolution displays.
   - Build the app using the latest version of NextJS with TypeScript.

4. **Local File System Interaction**
   - Use the File System Access API to access and read video files.
   - Retrieve or generate thumbnails for each video and display them in the app.

### Non-Functional Requirements

1. **Performance**
   - Efficiently manage a large number of video files without significant delays.
   - Ensure quick loading of folder contents and thumbnails, even with extensive libraries.

2. **Usability**
   - Design an intuitive, easy-to-navigate interface suitable for a video collector.

3. **Security**
   - Adhere to browser security constraints, ensuring user consent for file access.

4. **Scalability**
   - Support an increasing number of videos and folders as the collection grows.

5. **Maintainability**
   - Produce well-structured, modular code that adheres to best practices for future updates.

---

## Design Specifications

### Color Palette
- **Primary Color:** #1976D2 (MUI Blue) - Used for buttons, highlights, and active elements.
- **Secondary Color:** #424242 (Dark Gray) - For secondary text, borders, and accents.
- **Background Color:** #F5F5F5 (Light Gray) - Main background to maintain a clean, professional look.

### Typography
- **Font:** Roboto - Default MUI font for consistency and readability.
- **Sizes:** 
  - Headings: 24px (h1), 20px (h2), 16px (h3).
  - Body text: 14px.

### Icons
- Use MUI’s built-in icons (e.g., `@mui/icons-material`) for folder representations, navigation, and player controls.
- Optional: Create custom icons for unique video or folder indicators if desired.

### Layout
- **Dashboard:**
  - A grid layout of folder icons representing base folder paths.
  - Each icon is 100x100px with a label beneath, clickable to enter Folder View.
- **Folder View:**
  - A grid or list layout displaying subfolders (as icons) and video files (with thumbnails).
  - Thumbnails are 150x100px, with file names below.
- **Video Player:**
  - Pops up in a modal or dedicated section when a video is selected.
  - Control bar at the bottom with all advanced features accessible.

---

## Development Instructions

Follow these steps sequentially to build the app:

### Step 1: Set Up the Project
- Initialize a new NextJS project with TypeScript (`npx create-next-app@latest --typescript`).
- Install core dependencies:
  - Material-UI: `@mui/material`, `@emotion/react`, `@emotion/styled`.
  - Video player: `video.js` or `react-player`.
  - File System Access API polyfill if necessary.

### Step 2: Implement File System Access
- Use the File System Access API to allow users to select folders:
  - Implement a function to request folder access and store the directory handle.
  - Create utility functions in `src/utils/fileSystem.ts`:
    - `getFolderContents(handle)`: Returns an array of files and subfolders with metadata (name, handle, type).
    - `generateThumbnail(videoHandle)`: Generates a thumbnail client-side using the video file.

### Step 3: Build Core Components
- **Dashboard Component (`src/components/Dashboard.tsx`):**
  - Fetch base folder handles from local storage or state.
  - Render a grid of folder icons using MUI’s `Grid` and `Card` components.
  - On click, navigate to the Folder View for the selected folder.
- **Folder View Component (`src/components/FolderView.tsx`):**
  - Use `getFolderContents` to list subfolders and videos.
  - Display subfolders as icons and videos with thumbnails in a grid or list layout.
  - Enable navigation to subfolders and trigger the Video Player on video click.
- **Video Player Component (`src/components/VideoPlayer.tsx`):**
  - Embed the chosen video player library with the specified advanced features.
  - Load videos using file handles or URLs.
  - Present in a modal (MUI `Dialog`) or dedicated section.
- **Settings Component (`src/components/Settings.tsx`):**
  - Include a form to add/remove base folder paths.
  - Save settings to local storage.

### Step 4: Integrate Video Player
- Configure the video player library to support local file playback:
  - Use the File System Access API to read video files.
  - Ensure compatibility with formats like MP4, AVI, MKV, etc.
- Implement all required features (seek bar, subtitles, etc.) as specified.

### Step 5: UI and Styling
- Create a custom MUI theme in `src/styles/theme.ts` using the defined color palette.
- Apply MUI components (e.g., `Button`, `Card`, `Grid`) consistently across the app.
- Optimize layout for 1920x1080:
  - Use fixed or responsive design with a max-width of 1920px.
  - Ensure proper padding and spacing (e.g., 16px margins).

### Step 6: Additional Features (Optional Enhancements)
- **Search Functionality:**
  - Add a search bar on the Dashboard to find videos by name across all folders.
- **Tagging and Categorization:**
  - Allow users to tag videos and filter by tags in Folder View.
- **Playlist Creation:**
  - Enable users to select videos and save them as playlists, accessible from the Dashboard.
- **Favorites:**
  - Add a “Favorite” button per video, with a dedicated Favorites section.
- **Video Metadata Display:**
  - Show details (duration, resolution, format) below each thumbnail.
- **Dark Mode:**
  - Implement a toggle in Settings for a dark theme (e.g., background #121212, text #FFFFFF).

### Step 7: Testing and Deployment
- Test key functionalities:
  - File system access and thumbnail generation.
  - Video playback across different formats.
  - UI alignment at 1920x1080 resolution.
- Handle errors gracefully:
  - Show messages for missing files or inaccessible folders.
  - Use loading states during folder loading or thumbnail generation.
- Deploy the app using NextJS's built-in server or a platform like Vercel.

---

## Best Practices

- **Code Structure:**
  - Organize files into `src/components/`, `src/pages/`, `src/styles/`, and `src/utils/`.
  - Use functional components with React hooks.
- **State Management:**
  - Use React Context for global state (e.g., folder paths, settings).
- **Performance Optimization:**
  - Lazy load thumbnails and components with `React.lazy` or dynamic imports.
  - Process thumbnail generation in the background using worker threads or async queues.
- **Accessibility:**
  - Add ARIA labels to interactive elements.
  - Ensure keyboard navigation (e.g., Tab key support).
- **Testing:**
  - Write unit tests for components and utils using Jest and React Testing Library.
- **Documentation:**
  - Include inline comments for complex logic.
  - Maintain a changelog in the project root.

---

## File Structure Example

```
project-root/
├── public/
│   └── cache/              # Thumbnail storage
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx    # Folder icon grid
│   │   ├── FolderView.tsx   # Folder contents display
│   │   ├── VideoPlayer.tsx  # Advanced video player
│   │   └── Settings.tsx     # App settings
│   ├── pages/
│   │   └── index.tsx        # Main app entry
│   ├── styles/
│   │   └── theme.ts         # MUI theme configuration
│   ├── utils/
│   │   ├── fileSystem.ts    # File system utilities
│   │   └── thumbnailGenerator.ts  # Thumbnail logic
└── package.json
```

---

## Notes for Agentic AI

- Ensure the app is compatible with modern browsers that support the File System Access API.
- Provide a fallback for browsers that do not support the API, such as manual file selection.
- Cache thumbnails to avoid regenerating them repeatedly, improving performance.
- Test with a variety of video formats and folder structures to ensure robustness.
- Prioritize user feedback (e.g., loaders, error messages) for a smooth experience.

This document provides a clear, step-by-step roadmap for you, the Agentic AI, to build the Local Video Management Web App. Follow these instructions meticulously to deliver a high-quality, professional application tailored to the video collector’s needs.