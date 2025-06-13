import React, { useState } from 'react';
import { FolderOpen, Trash2, Download, Calendar, Music, BookOpen } from 'lucide-react';

const ProjectManager = ({ projects, currentProject, onLoadProject, onDeleteProject, onSaveProject }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('lastModified');
  const [filterBy, setFilterBy] = useState('all');

  const filteredProjects = projects
    .filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.genre?.some(g => g.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesFilter = filterBy === 'all' || 
                           (filterBy === 'withMidi' && project.midiPatterns) ||
                           (filterBy === 'withSamples' && project.samples?.length > 0) ||
                           (filterBy === 'withGuidebook' && project.guidebook);
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'genre':
          return (a.genre?.[0] || '').localeCompare(b.genre?.[0] || '');
        case 'tempo':
          return (a.tempo || 0) - (b.tempo || 0);
        case 'lastModified':
        default:
          return new Date(b.lastModified || 0) - new Date(a.lastModified || 0);
      }
    });

  const exportProject = (project) => {
    const exportData = {
      ...project,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.name}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importProject = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const projectData = JSON.parse(e.target.result);
        const importedProject = {
          ...projectData,
          id: Date.now().toString(), // Generate new ID
          lastModified: new Date().toISOString()
        };
        onSaveProject(importedProject);
        alert('Project imported successfully!');
      } catch (error) {
        console.error('Error importing project:', error);
        alert('Failed to import project. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProjectFeatures = (project) => {
    const features = [];
    if (project.guidebook) features.push('Guidebook');
    if (project.midiPatterns) features.push('MIDI');
    if (project.samples?.length > 0) features.push('Samples');
    return features;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FolderOpen className="w-6 h-6 text-purple-400" />
            Project Manager
          </h2>
          
          <div className="flex gap-3">
            <input
              type="file"
              accept=".json"
              onChange={importProject}
              className="hidden"
              id="import-project"
            />
            <label
              htmlFor="import-project"
              className="btn-secondary cursor-pointer"
            >
              Import Project
            </label>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Search Projects
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field w-full"
              placeholder="Search by name or genre..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field w-full"
            >
              <option value="lastModified">Last Modified</option>
              <option value="name">Name</option>
              <option value="genre">Genre</option>
              <option value="tempo">Tempo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Filter By
            </label>
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="input-field w-full"
            >
              <option value="all">All Projects</option>
              <option value="withGuidebook">With Guidebook</option>
              <option value="withMidi">With MIDI</option>
              <option value="withSamples">With Samples</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {filteredProjects.length === 0 ? (
          <div className="card p-8 text-center">
            <FolderOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              {projects.length === 0 ? 'No Projects Yet' : 'No Projects Found'}
            </h3>
            <p className="text-gray-500">
              {projects.length === 0 
                ? 'Create your first project using the Guidebook Generator'
                : 'Try adjusting your search or filter criteria'
              }
            </p>
          </div>
        ) : (
          filteredProjects.map(project => (
            <div
              key={project.id}
              className={`card p-6 transition-all duration-200 ${
                currentProject?.id === project.id
                  ? 'ring-2 ring-purple-500 bg-purple-900/20'
                  : 'hover:bg-gray-750'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-white">
                      {project.name}
                    </h3>
                    {currentProject?.id === project.id && (
                      <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">
                        Current
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <span className="text-gray-400 text-sm">Genre:</span>
                      <p className="text-white">
                        {project.genre?.join(', ') || 'Not specified'}
                      </p>
                    </div>
                    
                    <div>
                      <span className="text-gray-400 text-sm">Tempo:</span>
                      <p className="text-white">{project.tempo || 'Not set'} BPM</p>
                    </div>
                    
                    <div>
                      <span className="text-gray-400 text-sm">Key:</span>
                      <p className="text-white">{project.key || 'Not set'}</p>
                    </div>
                    
                    <div>
                      <span className="text-gray-400 text-sm">Last Modified:</span>
                      <p className="text-white text-sm">
                        {formatDate(project.lastModified)}
                      </p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-gray-400 text-sm">Features:</span>
                    {getProjectFeatures(project).map(feature => (
                      <span
                        key={feature}
                        className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded flex items-center gap-1"
                      >
                        {feature === 'Guidebook' && <BookOpen className="w-3 h-3" />}
                        {feature === 'MIDI' && <Music className="w-3 h-3" />}
                        {feature === 'Samples' && <Download className="w-3 h-3" />}
                        {feature}
                      </span>
                    ))}
                    {getProjectFeatures(project).length === 0 && (
                      <span className="text-gray-500 text-sm">No content generated yet</span>
                    )}
                  </div>

                  {/* Vibe Tags */}
                  {project.vibe && project.vibe.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {project.vibe.slice(0, 5).map(vibe => (
                        <span
                          key={vibe}
                          className="bg-purple-600/20 text-purple-300 text-xs px-2 py-1 rounded"
                        >
                          {vibe}
                        </span>
                      ))}
                      {project.vibe.length > 5 && (
                        <span className="text-gray-400 text-xs px-2 py-1">
                          +{project.vibe.length - 5} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => onLoadProject(project)}
                    className="btn-primary text-sm px-3 py-1"
                  >
                    Load
                  </button>
                  
                  <button
                    onClick={() => exportProject(project)}
                    className="btn-secondary text-sm px-3 py-1"
                  >
                    Export
                  </button>
                  
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete "${project.name}"?`)) {
                        onDeleteProject(project.id);
                      }
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Statistics */}
      {projects.length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-400">
                {projects.length}
              </div>
              <div className="text-gray-400 text-sm">Total Projects</div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-blue-400">
                {projects.filter(p => p.guidebook).length}
              </div>
              <div className="text-gray-400 text-sm">With Guidebooks</div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-green-400">
                {projects.filter(p => p.midiPatterns).length}
              </div>
              <div className="text-gray-400 text-sm">With MIDI</div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-yellow-400">
                {projects.filter(p => p.samples?.length > 0).length}
              </div>
              <div className="text-gray-400 text-sm">With Samples</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManager;