import React, { useState, useEffect } from 'react';
import { Music, Download, Play, Square, RefreshCw, Save } from 'lucide-react';
import { SCALES, CHORD_PROGRESSIONS, TEMPO_RANGES } from '../types';
import aiService from '../services/aiService';
import midiService from '../services/midiService';
import audioService from '../services/audioService';

const MidiGenerator = ({ currentProject, onSaveProject }) => {
  const [midiSettings, setMidiSettings] = useState({
    key: 'C Major',
    tempo: 120,
    timeSignature: [4, 4],
    chordProgression: 'I-V-vi-IV',
    genre: 'Electronic',
    bars: 4
  });

  const [generatedPatterns, setGeneratedPatterns] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState('all');

  useEffect(() => {
    if (currentProject) {
      setMidiSettings(prev => ({
        ...prev,
        key: currentProject.key || 'C Major',
        tempo: currentProject.tempo || 120,
        genre: currentProject.genre?.[0] || 'Electronic'
      }));
    }
  }, [currentProject]);

  const handleSettingChange = (field, value) => {
    setMidiSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateMidiPatterns = async () => {
    setIsGenerating(true);
    try {
      const patterns = await aiService.generateMidiSuggestions(midiSettings);
      setGeneratedPatterns(patterns);
      
      // Update project with MIDI data
      if (currentProject && onSaveProject) {
        const updatedProject = {
          ...currentProject,
          midiPatterns: patterns,
          midiSettings,
          lastModified: new Date().toISOString()
        };
        onSaveProject(updatedProject);
      }
    } catch (error) {
      console.error('Error generating MIDI patterns:', error);
      alert('Failed to generate MIDI patterns. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const playPattern = async (patternType = 'all') => {
    if (!generatedPatterns) return;

    try {
      await audioService.initialize();
      
      let patternToPlay = {};
      
      if (patternType === 'all') {
        patternToPlay = generatedPatterns;
      } else {
        patternToPlay[patternType] = generatedPatterns[patternType];
      }

      await audioService.playMidiPattern(patternToPlay, {
        tempo: midiSettings.tempo,
        loop: true
      });
      
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing pattern:', error);
      alert('Failed to play pattern. Please try again.');
    }
  };

  const stopPlayback = () => {
    audioService.stop();
    setIsPlaying(false);
  };

  const downloadMidi = (patternType = 'all') => {
    if (!generatedPatterns) return;

    let patterns = {};
    let filename = '';

    if (patternType === 'all') {
      patterns = generatedPatterns;
      filename = `${currentProject?.name || 'track'}-full.mid`;
    } else {
      patterns[patternType] = generatedPatterns[patternType];
      filename = `${currentProject?.name || 'track'}-${patternType}.mid`;
    }

    const midiData = midiService.generateMidiFile(patterns, {
      tempo: midiSettings.tempo,
      timeSignature: midiSettings.timeSignature,
      key: midiSettings.key.split(' ')[0],
      trackName: currentProject?.name || 'Generated Track'
    });

    midiService.downloadMidi(midiData, filename);
  };

  const downloadDrums = () => {
    if (!generatedPatterns?.drums) return;

    const drumMidi = midiService.generateDrumMidi(generatedPatterns.drums, {
      tempo: midiSettings.tempo,
      bars: midiSettings.bars
    });

    midiService.downloadMidi(drumMidi, `${currentProject?.name || 'track'}-drums.mid`);
  };

  const getTempoRange = () => {
    const range = TEMPO_RANGES[midiSettings.genre];
    return range ? `${range[0]}-${range[1]} BPM` : '60-200 BPM';
  };

  const getChordProgressions = () => {
    return CHORD_PROGRESSIONS[midiSettings.genre] || CHORD_PROGRESSIONS['Pop'];
  };

  return (
    <div className="space-y-6">
      {/* MIDI Settings */}
      <div className="card p-6">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Music className="w-6 h-6 text-purple-400" />
          MIDI Pattern Generator
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Key */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Key
            </label>
            <select
              value={midiSettings.key}
              onChange={(e) => handleSettingChange('key', e.target.value)}
              className="input-field w-full"
            >
              {SCALES.map(scale => (
                <option key={scale} value={scale}>{scale}</option>
              ))}
            </select>
          </div>

          {/* Tempo */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tempo (BPM)
              <span className="text-xs text-gray-400 ml-2">
                Suggested: {getTempoRange()}
              </span>
            </label>
            <input
              type="number"
              value={midiSettings.tempo}
              onChange={(e) => handleSettingChange('tempo', parseInt(e.target.value))}
              className="input-field w-full"
              min="60"
              max="200"
            />
          </div>

          {/* Time Signature */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Time Signature
            </label>
            <select
              value={`${midiSettings.timeSignature[0]}/${midiSettings.timeSignature[1]}`}
              onChange={(e) => {
                const [num, den] = e.target.value.split('/').map(Number);
                handleSettingChange('timeSignature', [num, den]);
              }}
              className="input-field w-full"
            >
              <option value="4/4">4/4</option>
              <option value="3/4">3/4</option>
              <option value="6/8">6/8</option>
              <option value="7/8">7/8</option>
            </select>
          </div>

          {/* Chord Progression */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Chord Progression
            </label>
            <select
              value={midiSettings.chordProgression}
              onChange={(e) => handleSettingChange('chordProgression', e.target.value)}
              className="input-field w-full"
            >
              {getChordProgressions().map(progression => (
                <option key={progression} value={progression}>{progression}</option>
              ))}
            </select>
          </div>

          {/* Genre */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Genre
            </label>
            <select
              value={midiSettings.genre}
              onChange={(e) => handleSettingChange('genre', e.target.value)}
              className="input-field w-full"
            >
              {Object.keys(CHORD_PROGRESSIONS).map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>

          {/* Number of Bars */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Number of Bars
            </label>
            <input
              type="number"
              value={midiSettings.bars}
              onChange={(e) => handleSettingChange('bars', parseInt(e.target.value))}
              className="input-field w-full"
              min="1"
              max="16"
            />
          </div>
        </div>

        {/* Generate Button */}
        <div className="mt-6">
          <button
            onClick={generateMidiPatterns}
            disabled={isGenerating}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Music className="w-4 h-4" />
            )}
            {isGenerating ? 'Generating...' : 'Generate MIDI Patterns'}
          </button>
        </div>
      </div>

      {/* Generated Patterns */}
      {generatedPatterns && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Generated Patterns</h3>
            <div className="flex gap-2">
              <button
                onClick={isPlaying ? stopPlayback : () => playPattern('all')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isPlaying 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isPlaying ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? 'Stop' : 'Play All'}
              </button>
              <button
                onClick={() => downloadMidi('all')}
                className="btn-secondary flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download All
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chord Pattern */}
            {generatedPatterns.chords && (
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-white">Chord Pattern</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => playPattern('chords')}
                      className="text-green-400 hover:text-green-300 transition-colors"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => downloadMidi('chords')}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-300 space-y-1">
                  {generatedPatterns.chords.slice(0, 8).map((note, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{note.note}</span>
                      <span>{note.time}s</span>
                    </div>
                  ))}
                  {generatedPatterns.chords.length > 8 && (
                    <div className="text-gray-400">
                      +{generatedPatterns.chords.length - 8} more notes...
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Bass Pattern */}
            {generatedPatterns.bass && (
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-white">Bass Pattern</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => playPattern('bass')}
                      className="text-green-400 hover:text-green-300 transition-colors"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => downloadMidi('bass')}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-300 space-y-1">
                  {generatedPatterns.bass.slice(0, 8).map((note, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{note.note}</span>
                      <span>{note.time}s</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Melody Pattern */}
            {generatedPatterns.melody && (
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-white">Melody Pattern</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => playPattern('melody')}
                      className="text-green-400 hover:text-green-300 transition-colors"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => downloadMidi('melody')}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-300 space-y-1">
                  {generatedPatterns.melody.slice(0, 8).map((note, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{note.note}</span>
                      <span>{note.time}s</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Drum Pattern */}
            {generatedPatterns.drums && (
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-white">Drum Pattern</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => playPattern('drums')}
                      className="text-green-400 hover:text-green-300 transition-colors"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                    <button
                      onClick={downloadDrums}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-300 space-y-2">
                  {Object.entries(generatedPatterns.drums).map(([drum, pattern]) => (
                    <div key={drum}>
                      <span className="font-medium capitalize">{drum}:</span>
                      <span className="ml-2">
                        {pattern.slice(0, 4).map(hit => hit.time).join(', ')}
                        {pattern.length > 4 && '...'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MidiGenerator;