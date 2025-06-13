import React, { useState, useEffect } from 'react';
import { BookOpen, Download, Save, Sparkles, RefreshCw } from 'lucide-react';
import { GENRES, VIBES, DAWS } from '../types';
import aiService from '../services/aiService';
import interactiveContentService from '../services/interactiveContentService.js';
import InteractiveGuidebook from './InteractiveGuidebook.jsx';

const GuidebookGenerator = ({ currentProject, onSaveProject }) => {
  const [formData, setFormData] = useState({
    name: '',
    genre: [],
    vibe: [],
    artistReference: '',
    daw: '',
    plugins: '',
    instruments: '',
    tempo: 120,
    key: 'C Major'
  });
  
  const [guidebook, setGuidebook] = useState('');
  const [interactiveElements, setInteractiveElements] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (currentProject) {
      setFormData(currentProject);
      setGuidebook(currentProject.guidebook || '');
      setInteractiveElements(currentProject.interactiveElements || []);
    }
  }, [currentProject]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMultiSelect = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const generateGuidebook = async () => {
    if (!formData.name.trim()) {
      alert('Please enter a project name');
      return;
    }

    setIsGenerating(true);
    try {
      const generatedGuidebook = await aiService.generateGuidebook(formData);
      setGuidebook(generatedGuidebook);
      
      // Generate interactive content (MIDI and samples)
      const interactive = await interactiveContentService.generateInteractiveGuidebook(generatedGuidebook, formData);
      setInteractiveElements(interactive);
      
      // Auto-save project
      const project = {
        ...formData,
        id: currentProject?.id || Date.now().toString(),
        guidebook: generatedGuidebook,
        interactiveElements: interactive,
        lastModified: new Date().toISOString()
      };
      
      onSaveProject(project);
    } catch (error) {
      console.error('Error generating guidebook:', error);
      alert('Failed to generate guidebook. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const saveProject = () => {
    if (!formData.name.trim()) {
      alert('Please enter a project name');
      return;
    }

    const project = {
      ...formData,
      id: currentProject?.id || Date.now().toString(),
      guidebook,
      lastModified: new Date().toISOString()
    };
    
    onSaveProject(project);
    alert('Project saved successfully!');
  };

  const downloadGuidebook = () => {
    if (!guidebook) {
      alert('No guidebook to download');
      return;
    }

    const blob = new Blob([guidebook], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${formData.name || 'guidebook'}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Project Settings */}
      <div className="card p-6">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-purple-400" />
          Production Guidebook Generator
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Project Name */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Project Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="input-field w-full"
              placeholder="Enter your project name"
            />
          </div>

          {/* Genre Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Genre(s)
            </label>
            <div className="max-h-40 overflow-y-auto bg-gray-700 rounded-lg p-3 space-y-2">
              {GENRES.map(genre => (
                <label key={genre} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.genre.includes(genre)}
                    onChange={() => handleMultiSelect('genre', genre)}
                    className="rounded text-purple-600"
                  />
                  <span className="text-sm text-gray-300">{genre}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Vibe Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Vibe(s)
            </label>
            <div className="max-h-40 overflow-y-auto bg-gray-700 rounded-lg p-3 space-y-2">
              {VIBES.map(vibe => (
                <label key={vibe} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.vibe.includes(vibe)}
                    onChange={() => handleMultiSelect('vibe', vibe)}
                    className="rounded text-purple-600"
                  />
                  <span className="text-sm text-gray-300">{vibe}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Artist Reference */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Artist Reference
            </label>
            <input
              type="text"
              value={formData.artistReference}
              onChange={(e) => handleInputChange('artistReference', e.target.value)}
              className="input-field w-full"
              placeholder="e.g., Deadmau5, Porter Robinson"
            />
          </div>

          {/* DAW */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              DAW
            </label>
            <select
              value={formData.daw}
              onChange={(e) => handleInputChange('daw', e.target.value)}
              className="input-field w-full"
            >
              <option value="">Select DAW</option>
              {DAWS.map(daw => (
                <option key={daw} value={daw}>{daw}</option>
              ))}
            </select>
          </div>

          {/* Advanced Settings Toggle */}
          <div className="md:col-span-2">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
            </button>
          </div>

          {/* Advanced Settings */}
          {showAdvanced && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tempo (BPM)
                </label>
                <input
                  type="number"
                  value={formData.tempo}
                  onChange={(e) => handleInputChange('tempo', parseInt(e.target.value))}
                  className="input-field w-full"
                  min="60"
                  max="200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Key
                </label>
                <input
                  type="text"
                  value={formData.key}
                  onChange={(e) => handleInputChange('key', e.target.value)}
                  className="input-field w-full"
                  placeholder="e.g., C Major, A Minor"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Available Plugins
                </label>
                <textarea
                  value={formData.plugins}
                  onChange={(e) => handleInputChange('plugins', e.target.value)}
                  className="input-field w-full h-20"
                  placeholder="List your available plugins (e.g., Serum, FabFilter Pro-Q, Valhalla VintageVerb)"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Available Instruments
                </label>
                <textarea
                  value={formData.instruments}
                  onChange={(e) => handleInputChange('instruments', e.target.value)}
                  className="input-field w-full h-20"
                  placeholder="List your available instruments and hardware"
                />
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mt-6">
          <button
            onClick={generateGuidebook}
            disabled={isGenerating || !formData.name.trim()}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {isGenerating ? 'Generating...' : 'Generate Guidebook'}
          </button>

          <button
            onClick={saveProject}
            disabled={!formData.name.trim()}
            className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            Save Project
          </button>

          {guidebook && (
            <button
              onClick={downloadGuidebook}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Guidebook
            </button>
          )}
        </div>
      </div>

      {/* Generated Guidebook */}
      {guidebook && (
        <div className="card p-6">
          <InteractiveGuidebook 
            content={guidebook} 
            interactiveElements={interactiveElements}
          />
        </div>
      )}
    </div>
  );
};

export default GuidebookGenerator;