import React, { useState } from 'react';
import { Play, Pause, Download, Music, Volume2 } from 'lucide-react';
import midiService from '../services/midiService.js';
import audioService from '../services/audioService.js';

const InteractiveGuidebook = ({ content, interactiveElements = [] }) => {
  const [playingElement, setPlayingElement] = useState(null);
  const [audioContext, setAudioContext] = useState(null);

  const playMidiElement = async (element) => {
    try {
      if (playingElement === element.id) {
        // Stop playing
        if (audioContext) {
          audioContext.stop();
          setAudioContext(null);
        }
        setPlayingElement(null);
        return;
      }

      // Stop any currently playing audio
      if (audioContext) {
        audioContext.stop();
      }

      setPlayingElement(element.id);
      const audio = await midiService.playMidiData(element.midiData);
      setAudioContext(audio);

      // Auto-stop when finished
      setTimeout(() => {
        setPlayingElement(null);
        setAudioContext(null);
      }, (element.midiData.duration || 4) * 1000);

    } catch (error) {
      console.error('Error playing MIDI:', error);
      setPlayingElement(null);
    }
  };

  const playSampleElement = async (element) => {
    try {
      if (playingElement === element.id) {
        // Stop playing
        if (audioContext) {
          audioContext.stop();
          setAudioContext(null);
        }
        setPlayingElement(null);
        return;
      }

      // Stop any currently playing audio
      if (audioContext) {
        audioContext.stop();
      }

      setPlayingElement(element.id);
      const audio = await audioService.playSample(element.audioData);
      setAudioContext(audio);

      // Auto-stop when finished
      setTimeout(() => {
        setPlayingElement(null);
        setAudioContext(null);
      }, (element.audioData.duration || 1) * 1000);

    } catch (error) {
      console.error('Error playing sample:', error);
      setPlayingElement(null);
    }
  };

  const downloadMidiElement = async (element) => {
    try {
      const midiBlob = await midiService.exportMidiData(element.midiData);
      const url = URL.createObjectURL(midiBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${element.title.replace(/\s+/g, '_')}.mid`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading MIDI:', error);
    }
  };

  const downloadSampleElement = async (element) => {
    try {
      const audioBlob = await audioService.exportSample(element.audioData);
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${element.title.replace(/\s+/g, '_')}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading sample:', error);
    }
  };

  const renderInteractiveElement = (element) => {
    const isPlaying = playingElement === element.id;
    
    return (
      <div key={element.id} className="bg-gray-800 rounded-lg p-4 border border-purple-500/30 my-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {element.type === 'midi' ? (
              <Music className="w-5 h-5 text-purple-400" />
            ) : (
              <Volume2 className="w-5 h-5 text-blue-400" />
            )}
            <h4 className="text-lg font-semibold text-white">{element.title}</h4>
            <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full">
              {element.type.toUpperCase()}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => element.type === 'midi' ? playMidiElement(element) : playSampleElement(element)}
              className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
                isPlaying 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span className="text-sm">{isPlaying ? 'Stop' : 'Play'}</span>
            </button>
            
            <button
              onClick={() => element.type === 'midi' ? downloadMidiElement(element) : downloadSampleElement(element)}
              className="flex items-center space-x-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm">Download</span>
            </button>
          </div>
        </div>
        
        <p className="text-gray-300 text-sm mb-3">{element.description}</p>
        
        {element.type === 'midi' && element.midiData && (
          <div className="bg-gray-900 rounded p-3">
            <div className="text-xs text-gray-400 mb-2">MIDI Info:</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Notes:</span> 
                <span className="text-white ml-2">{element.midiData.notes?.length || 0}</span>
              </div>
              <div>
                <span className="text-gray-400">Duration:</span> 
                <span className="text-white ml-2">{element.midiData.duration || 4} bars</span>
              </div>
              <div>
                <span className="text-gray-400">Tempo:</span> 
                <span className="text-white ml-2">{element.midiData.tempo || 120} BPM</span>
              </div>
              <div>
                <span className="text-gray-400">Key:</span> 
                <span className="text-white ml-2">{element.midiData.key || 'C Major'}</span>
              </div>
            </div>
          </div>
        )}
        
        {element.type === 'sample' && element.audioData && (
          <div className="bg-gray-900 rounded p-3">
            <div className="text-xs text-gray-400 mb-2">Sample Info:</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Type:</span> 
                <span className="text-white ml-2 capitalize">{element.audioData.type || 'Unknown'}</span>
              </div>
              <div>
                <span className="text-gray-400">Duration:</span> 
                <span className="text-white ml-2">{element.audioData.duration || 1}s</span>
              </div>
              <div>
                <span className="text-gray-400">Frequency:</span> 
                <span className="text-white ml-2">{element.audioData.frequency || 440}Hz</span>
              </div>
              <div>
                <span className="text-gray-400">Format:</span> 
                <span className="text-white ml-2">WAV 44.1kHz</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const insertInteractiveElements = (text, elements) => {
    if (!elements || elements.length === 0) {
      return <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, '<br>') }} />;
    }

    // Split content into sections and insert interactive elements
    const lines = text.split('\n');
    const result = [];
    let elementIndex = 0;

    lines.forEach((line, lineIndex) => {
      result.push(
        <div key={`line-${lineIndex}`} className="mb-2">
          {line}
        </div>
      );

      // Insert interactive elements at appropriate positions
      if (elementIndex < elements.length) {
        const element = elements[elementIndex];
        
        // Simple heuristic: insert after sections that mention relevant keywords
        const shouldInsert = (
          (element.type === 'midi' && (line.toLowerCase().includes('chord') || line.toLowerCase().includes('melody') || line.toLowerCase().includes('bass'))) ||
          (element.type === 'sample' && (line.toLowerCase().includes('drum') || line.toLowerCase().includes('kick') || line.toLowerCase().includes('snare')))
        );

        if (shouldInsert) {
          result.push(renderInteractiveElement(element));
          elementIndex++;
        }
      }
    });

    // Add any remaining elements at the end
    while (elementIndex < elements.length) {
      result.push(renderInteractiveElement(elements[elementIndex]));
      elementIndex++;
    }

    return result;
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-2 flex items-center">
          <Music className="w-6 h-6 mr-2 text-purple-400" />
          Interactive Production Guide
        </h3>
        <p className="text-gray-400 text-sm">
          This guide includes playable MIDI patterns and downloadable samples to help you create your track.
        </p>
      </div>

      <div className="text-gray-200 leading-relaxed">
        {insertInteractiveElements(content, interactiveElements)}
      </div>

      {interactiveElements.length > 0 && (
        <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-purple-500/30">
          <h4 className="text-lg font-semibold text-white mb-2">Interactive Elements Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className="text-gray-300">
              <span className="text-purple-400">MIDI Files:</span> {interactiveElements.filter(e => e.type === 'midi').length}
            </div>
            <div className="text-gray-300">
              <span className="text-blue-400">Audio Samples:</span> {interactiveElements.filter(e => e.type === 'sample').length}
            </div>
          </div>
          <p className="text-gray-400 text-xs mt-2">
            Click play buttons to preview, download buttons to save files to your computer.
          </p>
        </div>
      )}
    </div>
  );
};

export default InteractiveGuidebook;