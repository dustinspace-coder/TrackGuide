import React, { useState, useEffect } from 'react';
import { Music, BookOpen, Download, Play, Square, Settings } from 'lucide-react';
import GuidebookGenerator from './components/GuidebookGenerator';
import MidiGenerator from './components/MidiGenerator';
import SampleGenerator from './components/SampleGenerator';
import AudioPlayer from './components/AudioPlayer';
import ProjectManager from './components/ProjectManager';

function App() {
  const [activeTab, setActiveTab] = useState('guidebook');
  const [currentProject, setCurrentProject] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Load projects from localStorage
    const savedProjects = localStorage.getItem('musicProducerProjects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  const saveProject = (project) => {
    const updatedProjects = [...projects];
    const existingIndex = updatedProjects.findIndex(p => p.id === project.id);
    
    if (existingIndex >= 0) {
      updatedProjects[existingIndex] = project;
    } else {
      updatedProjects.push(project);
    }
    
    setProjects(updatedProjects);
    setCurrentProject(project);
    localStorage.setItem('musicProducerProjects', JSON.stringify(updatedProjects));
  };

  const loadProject = (project) => {
    setCurrentProject(project);
  };

  const deleteProject = (projectId) => {
    const updatedProjects = projects.filter(p => p.id !== projectId);
    setProjects(updatedProjects);
    localStorage.setItem('musicProducerProjects', JSON.stringify(updatedProjects));
    
    if (currentProject && currentProject.id === projectId) {
      setCurrentProject(null);
    }
  };

  const tabs = [
    { id: 'guidebook', label: 'Guidebook', icon: BookOpen },
    { id: 'midi', label: 'MIDI Generator', icon: Music },
    { id: 'samples', label: 'Sample Generator', icon: Download },
    { id: 'projects', label: 'Projects', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Music className="w-10 h-10 text-purple-400" />
            Music Producer Suite
          </h1>
          <p className="text-gray-300 text-lg">
            AI-powered guidebooks, MIDI generation, and sample creation for music producers
          </p>
        </header>

        {/* Navigation Tabs */}
        <nav className="flex justify-center mb-8">
          <div className="bg-gray-800 rounded-lg p-1 flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Current Project Info */}
        {currentProject && activeTab !== 'projects' && (
          <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Current Project: {currentProject.name}
                </h3>
                <p className="text-gray-400 text-sm">
                  {currentProject.genre?.join(', ')} • {currentProject.tempo} BPM • {currentProject.key}
                </p>
              </div>
              <button
                onClick={() => setCurrentProject(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Square className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="max-w-6xl mx-auto">
          {activeTab === 'guidebook' && (
            <GuidebookGenerator 
              currentProject={currentProject}
              onSaveProject={saveProject}
            />
          )}
          
          {activeTab === 'midi' && (
            <MidiGenerator 
              currentProject={currentProject}
              onSaveProject={saveProject}
            />
          )}
          
          {activeTab === 'samples' && (
            <SampleGenerator 
              currentProject={currentProject}
              onSaveProject={saveProject}
            />
          )}
          
          {activeTab === 'projects' && (
            <ProjectManager
              projects={projects}
              currentProject={currentProject}
              onLoadProject={loadProject}
              onDeleteProject={deleteProject}
              onSaveProject={saveProject}
            />
          )}
        </main>

        {/* Audio Player */}
        <AudioPlayer currentProject={currentProject} />

        {/* Footer */}
        <footer className="text-center mt-12 text-gray-400">
          <p>Music Producer Suite - Empowering creativity through AI</p>
        </footer>
      </div>
    </div>
  );
}

export default App;