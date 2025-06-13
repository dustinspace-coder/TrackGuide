import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Volume2, VolumeX } from 'lucide-react';
import audioService from '../services/audioService';

const AudioPlayer = ({ currentProject }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    // Initialize audio service when component mounts
    audioService.initialize();
    
    return () => {
      // Cleanup when component unmounts
      audioService.stop();
    };
  }, []);

  useEffect(() => {
    // Update playing state based on audio service
    setIsPlaying(audioService.isPlaying);
  }, [audioService.isPlaying]);

  const handlePlay = async () => {
    if (!currentProject?.midiPatterns) {
      alert('No MIDI patterns available. Generate some patterns first!');
      return;
    }

    try {
      if (isPlaying) {
        audioService.pause();
        setIsPlaying(false);
      } else {
        await audioService.playMidiPattern(currentProject.midiPatterns, {
          tempo: currentProject.tempo || 120,
          loop: true
        });
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error controlling playback:', error);
    }
  };

  const handleStop = () => {
    audioService.stop();
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    // Note: Tone.js volume control would be implemented here
    // For now, we'll just update the UI state
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // Implement actual muting logic with Tone.js
  };

  // Don't render if no current project
  if (!currentProject) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 max-w-4xl mx-auto">
      <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-4">
        <div className="flex items-center justify-between">
          {/* Project Info */}
          <div className="flex items-center gap-4">
            <div>
              <h4 className="text-white font-medium">{currentProject.name}</h4>
              <p className="text-gray-400 text-sm">
                {currentProject.genre?.join(', ')} • {currentProject.tempo} BPM
              </p>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePlay}
              disabled={!currentProject.midiPatterns}
              className={`p-2 rounded-full transition-colors ${
                currentProject.midiPatterns
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </button>

            <button
              onClick={handleStop}
              className="p-2 rounded-full bg-gray-600 hover:bg-gray-700 text-white transition-colors"
            >
              <Square className="w-5 h-5" />
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-20"
              />
            </div>
          </div>

          {/* Pattern Info */}
          <div className="text-right">
            <div className="text-sm text-gray-400">
              {currentProject.midiPatterns ? (
                <div className="flex gap-2">
                  {currentProject.midiPatterns.chords && (
                    <span className="bg-blue-600 px-2 py-1 rounded text-xs">Chords</span>
                  )}
                  {currentProject.midiPatterns.bass && (
                    <span className="bg-green-600 px-2 py-1 rounded text-xs">Bass</span>
                  )}
                  {currentProject.midiPatterns.melody && (
                    <span className="bg-purple-600 px-2 py-1 rounded text-xs">Melody</span>
                  )}
                  {currentProject.midiPatterns.drums && (
                    <span className="bg-red-600 px-2 py-1 rounded text-xs">Drums</span>
                  )}
                </div>
              ) : (
                <span>No patterns generated</span>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar (placeholder for future implementation) */}
        {isPlaying && (
          <div className="mt-3">
            <div className="w-full bg-gray-700 rounded-full h-1">
              <div 
                className="bg-purple-600 h-1 rounded-full transition-all duration-1000"
                style={{ width: '0%' }} // This would be calculated based on actual playback position
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioPlayer;