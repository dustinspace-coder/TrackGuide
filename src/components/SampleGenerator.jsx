import React, { useState, useEffect } from 'react';
import { Download, Play, Square, RefreshCw, Volume2 } from 'lucide-react';
import audioService from '../services/audioService';

const SampleGenerator = ({ currentProject, onSaveProject }) => {
  const [sampleSettings, setSampleSettings] = useState({
    type: 'kick',
    duration: 2,
    frequency: 440,
    effects: {
      reverb: 0,
      delay: 0,
      distortion: 0,
      filter: 1000
    }
  });

  const [generatedSamples, setGeneratedSamples] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [playingSample, setPlayingSample] = useState(null);

  const sampleTypes = [
    { id: 'kick', name: 'Kick Drum', description: 'Deep, punchy kick drums' },
    { id: 'snare', name: 'Snare Drum', description: 'Crisp snare hits' },
    { id: 'hihat', name: 'Hi-Hat', description: 'Sharp hi-hat sounds' },
    { id: 'bass', name: 'Bass', description: 'Sub bass tones' },
    { id: 'lead', name: 'Lead Synth', description: 'Lead synthesizer sounds' },
    { id: 'pad', name: 'Pad', description: 'Atmospheric pad sounds' },
    { id: 'pluck', name: 'Pluck', description: 'Plucked string sounds' }
  ];

  useEffect(() => {
    if (currentProject?.samples) {
      setGeneratedSamples(currentProject.samples);
    }
  }, [currentProject]);

  const handleSettingChange = (field, value) => {
    setSampleSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEffectChange = (effect, value) => {
    setSampleSettings(prev => ({
      ...prev,
      effects: {
        ...prev.effects,
        [effect]: value
      }
    }));
  };

  const generateSample = async () => {
    setIsGenerating(true);
    try {
      await audioService.initialize();
      
      // Apply effects settings
      Object.entries(sampleSettings.effects).forEach(([effect, value]) => {
        audioService.setEffectParameter(effect, 'wet', value);
      });

      const sampleUrl = await audioService.generateWavSample(sampleSettings.type, {
        duration: sampleSettings.duration,
        frequency: sampleSettings.frequency
      });

      const newSample = {
        id: Date.now().toString(),
        type: sampleSettings.type,
        url: sampleUrl,
        settings: { ...sampleSettings },
        name: `${sampleSettings.type}-${Date.now()}`,
        createdAt: new Date().toISOString()
      };

      const updatedSamples = [...generatedSamples, newSample];
      setGeneratedSamples(updatedSamples);

      // Update project
      if (currentProject && onSaveProject) {
        const updatedProject = {
          ...currentProject,
          samples: updatedSamples,
          lastModified: new Date().toISOString()
        };
        onSaveProject(updatedProject);
      }

    } catch (error) {
      console.error('Error generating sample:', error);
      alert('Failed to generate sample. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const playSample = async (sample) => {
    try {
      if (playingSample === sample.id) {
        audioService.stop();
        setPlayingSample(null);
        return;
      }

      // Create audio element to play the sample
      const audio = new Audio(sample.url);
      audio.play();
      setPlayingSample(sample.id);

      audio.onended = () => {
        setPlayingSample(null);
      };

    } catch (error) {
      console.error('Error playing sample:', error);
    }
  };

  const downloadSample = (sample) => {
    audioService.downloadWavSample(sample.url, `${sample.name}.wav`);
  };

  const deleteSample = (sampleId) => {
    const updatedSamples = generatedSamples.filter(s => s.id !== sampleId);
    setGeneratedSamples(updatedSamples);

    if (currentProject && onSaveProject) {
      const updatedProject = {
        ...currentProject,
        samples: updatedSamples,
        lastModified: new Date().toISOString()
      };
      onSaveProject(updatedProject);
    }
  };

  const downloadAllSamples = () => {
    generatedSamples.forEach((sample, index) => {
      setTimeout(() => {
        downloadSample(sample);
      }, index * 500); // Stagger downloads
    });
  };

  return (
    <div className="space-y-6">
      {/* Sample Generator Settings */}
      <div className="card p-6">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Volume2 className="w-6 h-6 text-purple-400" />
          WAV Sample Generator
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sample Type */}
          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Sample Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {sampleTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => handleSettingChange('type', type.id)}
                  className={`p-3 rounded-lg border transition-all ${
                    sampleSettings.type === type.id
                      ? 'border-purple-500 bg-purple-500/20 text-white'
                      : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <div className="font-medium">{type.name}</div>
                  <div className="text-xs text-gray-400 mt-1">{type.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Duration (seconds)
            </label>
            <input
              type="range"
              min="0.5"
              max="10"
              step="0.5"
              value={sampleSettings.duration}
              onChange={(e) => handleSettingChange('duration', parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="text-center text-sm text-gray-400 mt-1">
              {sampleSettings.duration}s
            </div>
          </div>

          {/* Frequency (for tonal samples) */}
          {['bass', 'lead', 'pad', 'pluck'].includes(sampleSettings.type) && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Frequency (Hz)
              </label>
              <input
                type="range"
                min="80"
                max="2000"
                step="10"
                value={sampleSettings.frequency}
                onChange={(e) => handleSettingChange('frequency', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-center text-sm text-gray-400 mt-1">
                {sampleSettings.frequency} Hz
              </div>
            </div>
          )}

          {/* Effects */}
          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Effects
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Reverb</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={sampleSettings.effects.reverb}
                  onChange={(e) => handleEffectChange('reverb', parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="text-center text-xs text-gray-400">
                  {Math.round(sampleSettings.effects.reverb * 100)}%
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Delay</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={sampleSettings.effects.delay}
                  onChange={(e) => handleEffectChange('delay', parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="text-center text-xs text-gray-400">
                  {Math.round(sampleSettings.effects.delay * 100)}%
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Distortion</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={sampleSettings.effects.distortion}
                  onChange={(e) => handleEffectChange('distortion', parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="text-center text-xs text-gray-400">
                  {Math.round(sampleSettings.effects.distortion * 100)}%
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Filter (Hz)</label>
                <input
                  type="range"
                  min="100"
                  max="5000"
                  step="100"
                  value={sampleSettings.effects.filter}
                  onChange={(e) => handleEffectChange('filter', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-center text-xs text-gray-400">
                  {sampleSettings.effects.filter} Hz
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="mt-6">
          <button
            onClick={generateSample}
            disabled={isGenerating}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
            {isGenerating ? 'Generating...' : 'Generate Sample'}
          </button>
        </div>
      </div>

      {/* Generated Samples */}
      {generatedSamples.length > 0 && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Generated Samples</h3>
            <button
              onClick={downloadAllSamples}
              className="btn-secondary flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {generatedSamples.map(sample => (
              <div key={sample.id} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-white capitalize">
                      {sample.type} Sample
                    </h4>
                    <p className="text-xs text-gray-400">
                      {sample.settings.duration}s • {sample.settings.frequency}Hz
                    </p>
                  </div>
                  <button
                    onClick={() => deleteSample(sample.id)}
                    className="text-red-400 hover:text-red-300 transition-colors text-sm"
                  >
                    Delete
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => playSample(sample)}
                    className={`flex items-center gap-1 px-3 py-1 rounded text-sm transition-colors ${
                      playingSample === sample.id
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {playingSample === sample.id ? (
                      <Square className="w-3 h-3" />
                    ) : (
                      <Play className="w-3 h-3" />
                    )}
                    {playingSample === sample.id ? 'Stop' : 'Play'}
                  </button>

                  <button
                    onClick={() => downloadSample(sample)}
                    className="flex items-center gap-1 px-3 py-1 rounded text-sm bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    Download
                  </button>
                </div>

                {/* Effects Preview */}
                <div className="mt-3 text-xs text-gray-400">
                  <div className="grid grid-cols-2 gap-1">
                    <span>Reverb: {Math.round(sample.settings.effects.reverb * 100)}%</span>
                    <span>Delay: {Math.round(sample.settings.effects.delay * 100)}%</span>
                    <span>Distortion: {Math.round(sample.settings.effects.distortion * 100)}%</span>
                    <span>Filter: {sample.settings.effects.filter}Hz</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SampleGenerator;