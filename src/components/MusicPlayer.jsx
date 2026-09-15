import React, { useState, useRef } from 'react';

export default function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setPlaying(true);
      }).catch(() => {
        console.log('Audio autoplay prevented');
      });
    }
  };

  return (
    <div className="music-dock" data-cursor="disable">
      <audio ref={audioRef} src="/enna-sona.mp3" loop />
      <button className="music-dock-play" onClick={togglePlay} aria-label="Toggle Music">
        {playing ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '2px' }}>
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      <div className="music-dock-title">
        Enna Sona — A.R. Rahman
      </div>

      <div className="music-waves">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i} 
            className="music-bar" 
            style={{ animationPlayState: playing ? 'running' : 'paused' }} 
          />
        ))}
      </div>
    </div>
  );
}
