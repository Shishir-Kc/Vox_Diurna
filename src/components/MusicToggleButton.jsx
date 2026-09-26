import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const TRACKS = [
  { title: '2:00 AM', src: '/audio/2am.mp3' },
  { title: 'Dreamy Mode', src: '/audio/dreamy-mode.mp3' },
  { title: 'In Dreamland', src: '/audio/in-dreamland.mp3' },
  { title: 'Loading', src: '/audio/loading.mp3' },
  { title: 'One Thing', src: '/audio/one-thing.mp3' },
  { title: 'Purple', src: '/audio/purple.mp3' },
  { title: 'Taiyaki', src: '/audio/taiyaki.mp3' },
];

const BAR_COUNT = 5;

function randomHeights() {
  return Array.from({ length: BAR_COUNT }, () => Math.random() * 0.8 + 0.2);
}

export default function MusicToggleButton() {
  const audioRef = useRef(null);
  const initialAutoplayAttempted = useRef(false);
  const resumeAfterTrackChange = useRef(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [heights, setHeights] = useState(() => randomHeights());
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const volume = 0.2;
  const track = TRACKS[trackIndex];

  useEffect(() => {
    if (!isPlaying) {
      setHeights(Array(BAR_COUNT).fill(0.1));
      return undefined;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setHeights(Array(BAR_COUNT).fill(0.65));
      return undefined;
    }

    const intervalId = window.setInterval(() => setHeights(randomHeights()), 100);
    return () => window.clearInterval(intervalId);
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
    if (!initialAutoplayAttempted.current) {
      initialAutoplayAttempted.current = true;
      requestPlayback(audio);
      return;
    }

    if (resumeAfterTrackChange.current) {
      resumeAfterTrackChange.current = false;
      requestPlayback(audio);
    }
  }, [trackIndex]);

  function requestPlayback(audio = audioRef.current) {
    if (!audio) return;

    const playback = audio.play();
    playback?.then(() => {
      setAudioError(false);
    }).catch(() => {
      setIsPlaying(false);
    });
  }

  function selectTrack(offset) {
    const shouldResume = isPlaying;
    audioRef.current?.pause();
    setIsPlaying(false);
    setAudioError(false);
    resumeAfterTrackChange.current = shouldResume;
    setTrackIndex((currentIndex) => (currentIndex + offset + TRACKS.length) % TRACKS.length);
  }

  function handleToggle() {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    setAudioError(false);
    // Calling play from the click handler also lets the visitor satisfy
    // browsers that block audible autoplay until an interaction.
    requestPlayback(audio);
  }

  function handleTrackEnded() {
    resumeAfterTrackChange.current = true;
    setTrackIndex((currentIndex) => (currentIndex + 1) % TRACKS.length);
  }

  return (
    <div className="footer-music-control" role="group" aria-label="Music player">
      <audio
        ref={audioRef}
        src={track.src}
        preload="none"
        onPlay={() => {
          setAudioError(false);
          setIsPlaying(true);
        }}
        onPause={() => setIsPlaying(false)}
        onEnded={handleTrackEnded}
        onError={() => {
          setIsPlaying(false);
          setAudioError(true);
        }}
      />
      <button
        className="footer-music-skip"
        type="button"
        onClick={() => selectTrack(-1)}
        aria-label="Previous song"
        title="Previous song"
      >
        ‹
      </button>
      <motion.button
        type="button"
        className="footer-music-toggle"
        onClick={handleToggle}
        aria-label={audioError ? `Could not load ${track.title}` : `${isPlaying ? 'Pause' : 'Play'} ${track.title}`}
        aria-pressed={isPlaying}
        title={audioError ? 'Could not load this song' : `${isPlaying ? 'Pause' : 'Play'} ${track.title}`}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 420, damping: 24 }}
      >
        <span className="footer-music-bars" aria-hidden="true">
          {heights.map((height, index) => (
            <motion.span
              key={index}
              className="footer-music-bar"
              animate={{ height: Math.max(3, height * 16) }}
              transition={{ type: 'spring', stiffness: 300, damping: 14 }}
            />
          ))}
        </span>
      </motion.button>
      <button
        className="footer-music-skip"
        type="button"
        onClick={() => selectTrack(1)}
        aria-label="Next song"
        title="Next song"
      >
        ›
      </button>
      <span className="footer-music-track" title={track.title}>{track.title}</span>
      <span className="music-toggle-sr-only" aria-live="polite">
        {audioError ? 'Audio could not be loaded.' : isPlaying ? `Playing ${track.title}.` : `${track.title} paused.`}
      </span>
    </div>
  );
}
