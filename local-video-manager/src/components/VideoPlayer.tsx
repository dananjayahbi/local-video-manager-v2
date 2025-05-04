import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Dialog,
  DialogContent,
  IconButton,
  Slider,
  Tooltip,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Stack,
} from '@mui/material';
import ReactPlayer from 'react-player';
import {
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
  Fullscreen,
  SkipPrevious,
  SkipNext,
  Close,
  PictureInPicture,
  Settings,
  Subtitles,
} from '@mui/icons-material';
import { useAppContext } from '../utils/AppContext';

const VideoPlayer: React.FC = () => {
  const { currentVideo, setCurrentVideo } = useAppContext();
  const playerRef = useRef<ReactPlayer>(null);
  
  // Player state
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);

  // Control visibility timeout
  const controlsTimeoutRef = useRef<number | null>(null);

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!currentVideo) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'Space':
          setPlaying(prev => !prev);
          break;
        case 'ArrowRight':
          playerRef.current?.seekTo((playerRef.current.getCurrentTime() || 0) + 10);
          break;
        case 'ArrowLeft':
          playerRef.current?.seekTo((playerRef.current.getCurrentTime() || 0) - 10);
          break;
        case 'ArrowUp':
          setVolume(prev => Math.min(prev + 0.1, 1));
          break;
        case 'ArrowDown':
          setVolume(prev => Math.max(prev - 0.1, 0));
          break;
        case 'KeyM':
          setMuted(prev => !prev);
          break;
        case 'KeyF':
          handleFullscreen();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentVideo]);

  // Reset controls visibility on mouse movement
  useEffect(() => {
    if (!currentVideo) return;

    const resetControlsTimeout = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        window.clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = window.setTimeout(() => {
        if (!seeking && playing) {
          setShowControls(false);
        }
      }, 3000);
    };

    resetControlsTimeout();

    const handleMouseMove = () => {
      resetControlsTimeout();
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (controlsTimeoutRef.current) {
        window.clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [currentVideo, seeking, playing]);

  // Handle progress updates
  const handleProgress = (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => {
    if (!seeking) {
      setPlayed(state.played);
    }
  };

  // Handle play/pause toggle
  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  // Handle volume change
  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    setVolume(newValue as number);
    if (muted && (newValue as number) > 0) {
      setMuted(false);
    }
  };

  // Handle mute toggle
  const handleMute = () => {
    setMuted(!muted);
  };

  // Handle seeking
  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekChange = (event: Event, newValue: number | number[]) => {
    setPlayed(newValue as number);
  };

  const handleSeekMouseUp = (event: React.MouseEvent<HTMLSpanElement, MouseEvent> | React.TouchEvent<HTMLSpanElement>) => {
    setSeeking(false);
    if (playerRef.current) {
      playerRef.current.seekTo(played);
    }
  };

  // Handle playback rate change
  const handlePlaybackRateChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setPlaybackRate(event.target.value as number);
  };

  // Handle fullscreen
  const handleFullscreen = () => {
    const videoElement = document.querySelector('.react-player video') as HTMLVideoElement;
    if (videoElement) {
      if (videoElement.requestFullscreen) {
        videoElement.requestFullscreen();
      }
    }
  };

  // Handle picture in picture
  const handlePictureInPicture = () => {
    const videoElement = document.querySelector('.react-player video') as HTMLVideoElement;
    if (videoElement && document.pictureInPictureEnabled) {
      if (document.pictureInPictureElement === videoElement) {
        document.exitPictureInPicture();
      } else {
        videoElement.requestPictureInPicture();
      }
    }
  };

  // Format time for display
  const formatTime = (seconds: number) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  // Handle dialog close
  const handleClose = () => {
    setCurrentVideo(null);
    setPlaying(false);
  };

  // Return null if no video is selected
  if (!currentVideo) {
    return null;
  }

  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      open={!!currentVideo}
      onClose={handleClose}
      PaperProps={{
        style: {
          backgroundColor: '#000',
          boxShadow: 'none',
          maxHeight: '90vh',
          height: '90vh',
        },
      }}
    >
      <DialogContent sx={{ p: 0, position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Close button */}
        <IconButton
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            zIndex: 10,
            '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
          }}
          onClick={handleClose}
        >
          <Close />
        </IconButton>

        {/* Video player */}
        <Box 
          sx={{ 
            position: 'relative', 
            width: '100%', 
            height: '100%',
            cursor: showControls ? 'default' : 'none',
          }}
          onMouseOver={() => setShowControls(true)}
        >
          <ReactPlayer
            ref={playerRef}
            url={currentVideo}
            width="100%"
            height="100%"
            playing={playing}
            volume={volume}
            muted={muted}
            playbackRate={playbackRate}
            onProgress={handleProgress}
            onDuration={setDuration}
            progressInterval={100}
            onClick={handlePlayPause}
            className="react-player"
          />

          {/* Controls overlay */}
          {showControls && (
            <Paper
              sx={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                p: 2,
                bgcolor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                borderRadius: 0,
                transition: 'opacity 0.3s',
              }}
            >
              {/* Progress bar */}
              <Slider
                value={played}
                min={0}
                max={0.999999}
                step={0.001}
                onChange={handleSeekChange}
                onMouseDown={handleSeekMouseDown}
                onChangeCommitted={handleSeekMouseUp}
                sx={{
                  color: '#1976D2',
                  height: 4,
                  '& .MuiSlider-thumb': {
                    width: 8,
                    height: 8,
                    '&:hover, &.Mui-focusVisible': {
                      boxShadow: '0px 0px 0px 8px rgba(25, 118, 210, 0.16)',
                    },
                  },
                }}
              />

              {/* Control buttons */}
              <Stack 
                direction="row" 
                spacing={1} 
                alignItems="center" 
                justifyContent="space-between"
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {/* Play/Pause */}
                  <IconButton onClick={handlePlayPause} color="inherit">
                    {playing ? <Pause /> : <PlayArrow />}
                  </IconButton>

                  {/* Volume control */}
                  <Box sx={{ display: 'flex', alignItems: 'center', width: 150 }}>
                    <IconButton onClick={handleMute} color="inherit">
                      {muted ? <VolumeOff /> : <VolumeUp />}
                    </IconButton>
                    <Slider
                      value={muted ? 0 : volume}
                      min={0}
                      max={1}
                      step={0.01}
                      onChange={handleVolumeChange}
                      sx={{ mx: 1, color: 'white' }}
                      size="small"
                    />
                  </Box>

                  {/* Time display */}
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {formatTime(played * duration)} / {formatTime(duration)}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {/* Playback rate */}
                  <FormControl size="small" variant="outlined" sx={{ m: 1, minWidth: 80 }}>
                    <Select
                      value={playbackRate}
                      onChange={handlePlaybackRateChange}
                      sx={{ 
                        color: 'white', 
                        '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                        '.MuiSvgIcon-root': { color: 'white' }
                      }}
                    >
                      <MenuItem value={0.5}>0.5x</MenuItem>
                      <MenuItem value={1}>1x</MenuItem>
                      <MenuItem value={1.5}>1.5x</MenuItem>
                      <MenuItem value={2}>2x</MenuItem>
                    </Select>
                  </FormControl>

                  {/* Picture in Picture */}
                  <Tooltip title="Picture in Picture">
                    <IconButton onClick={handlePictureInPicture} color="inherit">
                      <PictureInPicture />
                    </IconButton>
                  </Tooltip>

                  {/* Fullscreen */}
                  <Tooltip title="Fullscreen">
                    <IconButton onClick={handleFullscreen} color="inherit">
                      <Fullscreen />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Stack>
            </Paper>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayer;