// Music production types and constants

export const GENRES = {
  // Electronic Dance Music
  'House': { 
    category: 'Electronic', 
    tempoRange: [120, 130], 
    keyPreferences: ['F minor', 'C minor', 'G minor', 'A minor']
  },
  'Deep House': { 
    category: 'Electronic', 
    tempoRange: [120, 130], 
    keyPreferences: ['F minor', 'C minor', 'G minor', 'A minor']
  },
  'Progressive House': { 
    category: 'Electronic', 
    tempoRange: [120, 130], 
    keyPreferences: ['F minor', 'C minor', 'G minor', 'A minor']
  },
  'Tech House': { 
    category: 'Electronic', 
    tempoRange: [120, 130], 
    keyPreferences: ['F minor', 'C minor', 'G minor', 'A minor']
  },
  'Bass House': { 
    category: 'Electronic', 
    tempoRange: [120, 130], 
    keyPreferences: ['F minor', 'C minor', 'G minor', 'A minor']
  },
  'Acid House': { 
    category: 'Electronic', 
    tempoRange: [120, 130], 
    keyPreferences: ['F minor', 'C minor', 'G minor', 'A minor']
  },
  'Tribal House': { 
    category: 'Electronic', 
    tempoRange: [120, 130], 
    keyPreferences: ['F minor', 'C minor', 'G minor', 'A minor']
  },
  'Techno': { 
    category: 'Electronic', 
    tempoRange: [125, 140], 
    keyPreferences: ['A minor', 'C minor', 'F minor']
  },
  'Minimal Techno': { 
    category: 'Electronic', 
    tempoRange: [125, 140], 
    keyPreferences: ['A minor', 'C minor', 'F minor']
  },
  'Industrial Techno': { 
    category: 'Electronic', 
    tempoRange: [125, 140], 
    keyPreferences: ['A minor', 'C minor', 'F minor']
  },
  'Melodic Techno': { 
    category: 'Electronic', 
    tempoRange: [125, 140], 
    keyPreferences: ['A minor', 'C minor', 'F minor']
  },
  'Hard Techno': { 
    category: 'Electronic', 
    tempoRange: [125, 140], 
    keyPreferences: ['A minor', 'C minor', 'F minor']
  },
  'Acid Techno': { 
    category: 'Electronic', 
    tempoRange: [125, 140], 
    keyPreferences: ['A minor', 'C minor', 'F minor']
  },
  'Trance': { 
    category: 'Electronic', 
    tempoRange: [130, 150], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Progressive Trance': { 
    category: 'Electronic', 
    tempoRange: [130, 150], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Psytrance': { 
    category: 'Electronic', 
    tempoRange: [130, 150], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Hard Trance': { 
    category: 'Electronic', 
    tempoRange: [130, 150], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Uplifting Trance': { 
    category: 'Electronic', 
    tempoRange: [130, 150], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Tech Trance': { 
    category: 'Electronic', 
    tempoRange: [130, 150], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Dubstep': { 
    category: 'Electronic', 
    tempoRange: [140, 150], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Riddim': { 
    category: 'Electronic', 
    tempoRange: [140, 150], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Brostep': { 
    category: 'Electronic', 
    tempoRange: [140, 150], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Melodic Dubstep': { 
    category: 'Electronic', 
    tempoRange: [140, 150], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Future Riddim': { 
    category: 'Electronic', 
    tempoRange: [140, 150], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Future Bass': { 
    category: 'Electronic', 
    tempoRange: [140, 150], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Melodic Bass': { 
    category: 'Electronic', 
    tempoRange: [140, 150], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Hybrid Trap': { 
    category: 'Electronic', 
    tempoRange: [140, 150], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Wave': { 
    category: 'Electronic', 
    tempoRange: [140, 150], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Trap (EDM)': { 
    category: 'Electronic', 
    tempoRange: [140, 150], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Festival Trap': { 
    category: 'Electronic', 
    tempoRange: [140, 150], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Hard Trap': { 
    category: 'Electronic', 
    tempoRange: [140, 150], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Drum and Bass': { 
    category: 'Electronic', 
    tempoRange: [160, 180], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Jungle': { 
    category: 'Electronic', 
    tempoRange: [160, 180], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Liquid DnB': { 
    category: 'Electronic', 
    tempoRange: [160, 180], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Neurofunk': { 
    category: 'Electronic', 
    tempoRange: [160, 180], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Jump Up': { 
    category: 'Electronic', 
    tempoRange: [160, 180], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Hardstep': { 
    category: 'Electronic', 
    tempoRange: [160, 180], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Breakbeat': { 
    category: 'Electronic', 
    tempoRange: [160, 180], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Big Beat': { 
    category: 'Electronic', 
    tempoRange: [160, 180], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'UK Garage': { 
    category: 'Electronic', 
    tempoRange: [160, 180], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  '2-Step': { 
    category: 'Electronic', 
    tempoRange: [160, 180], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Speed Garage': { 
    category: 'Electronic', 
    tempoRange: [160, 180], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Hardcore': { 
    category: 'Electronic', 
    tempoRange: [160, 180], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Happy Hardcore': { 
    category: 'Electronic', 
    tempoRange: [160, 180], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Gabber': { 
    category: 'Electronic', 
    tempoRange: [160, 180], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Speedcore': { 
    category: 'Electronic', 
    tempoRange: [160, 180], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Electro': { 
    category: 'Electronic', 
    tempoRange: [160, 180], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Electro House': { 
    category: 'Electronic', 
    tempoRange: [160, 180], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Complextro': { 
    category: 'Electronic', 
    tempoRange: [160, 180], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Moombahton': { 
    category: 'Electronic', 
    tempoRange: [160, 180], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Moombahcore': { 
    category: 'Electronic', 
    tempoRange: [160, 180], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  
  // Ambient & Atmospheric
  'Ambient': { 
    category: 'Ambient', 
    tempoRange: [60, 90], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Dark Ambient': { 
    category: 'Ambient', 
    tempoRange: [60, 90], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Drone': { 
    category: 'Ambient', 
    tempoRange: [60, 90], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Space Ambient': { 
    category: 'Ambient', 
    tempoRange: [60, 90], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Cinematic Ambient': { 
    category: 'Ambient', 
    tempoRange: [60, 90], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Downtempo': { 
    category: 'Ambient', 
    tempoRange: [60, 90], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Chillout': { 
    category: 'Ambient', 
    tempoRange: [60, 90], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Lounge': { 
    category: 'Ambient', 
    tempoRange: [60, 90], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Trip Hop': { 
    category: 'Ambient', 
    tempoRange: [60, 90], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Chillstep': { 
    category: 'Ambient', 
    tempoRange: [60, 90], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'New Age': { 
    category: 'Ambient', 
    tempoRange: [60, 90], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Meditation': { 
    category: 'Ambient', 
    tempoRange: [60, 90], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Nature Sounds': { 
    category: 'Ambient', 
    tempoRange: [60, 90], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  
  // Synthwave & Retro
  'Synthwave': { 
    category: 'Synthwave', 
    tempoRange: [120, 130], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Retrowave': { 
    category: 'Synthwave', 
    tempoRange: [120, 130], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Darksynth': { 
    category: 'Synthwave', 
    tempoRange: [120, 130], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Cyberpunk': { 
    category: 'Synthwave', 
    tempoRange: [120, 130], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Outrun': { 
    category: 'Synthwave', 
    tempoRange: [120, 130], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Vaporwave': { 
    category: 'Synthwave', 
    tempoRange: [120, 130], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Future Funk': { 
    category: 'Synthwave', 
    tempoRange: [120, 130], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Mallsoft': { 
    category: 'Synthwave', 
    tempoRange: [120, 130], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Slushwave': { 
    category: 'Synthwave', 
    tempoRange: [120, 130], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  
  // Hip Hop & Urban
  'Hip Hop': { 
    category: 'Hip Hop', 
    tempoRange: [70, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Boom Bap': { 
    category: 'Hip Hop', 
    tempoRange: [70, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Trap': { 
    category: 'Hip Hop', 
    tempoRange: [70, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Lo-fi Hip Hop': { 
    category: 'Hip Hop', 
    tempoRange: [70, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Cloud Rap': { 
    category: 'Hip Hop', 
    tempoRange: [70, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Drill': { 
    category: 'Hip Hop', 
    tempoRange: [70, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Phonk': { 
    category: 'Hip Hop', 
    tempoRange: [70, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Memphis Rap': { 
    category: 'Hip Hop', 
    tempoRange: [70, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Crunk': { 
    category: 'Hip Hop', 
    tempoRange: [70, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Gangsta Rap': { 
    category: 'Hip Hop', 
    tempoRange: [70, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Conscious Rap': { 
    category: 'Hip Hop', 
    tempoRange: [70, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Grime': { 
    category: 'Hip Hop', 
    tempoRange: [70, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'UK Drill': { 
    category: 'Hip Hop', 
    tempoRange: [70, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Afrobeat': { 
    category: 'Hip Hop', 
    tempoRange: [70, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Afro House': { 
    category: 'Hip Hop', 
    tempoRange: [70, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  
  // R&B & Soul
  'R&B': { 
    category: 'R&B', 
    tempoRange: [70, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Contemporary R&B': { 
    category: 'R&B', 
    tempoRange: [70, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Neo-Soul': { 
    category: 'R&B', 
    tempoRange: [70, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Soul': { 
    category: 'R&B', 
    tempoRange: [70, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Funk': { 
    category: 'R&B', 
    tempoRange: [70, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'P-Funk': { 
    category: 'R&B', 
    tempoRange: [70, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Gospel': { 
    category: 'R&B', 
    tempoRange: [70, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Blues': { 
    category: 'R&B', 
    tempoRange: [70, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Smooth Jazz': { 
    category: 'R&B', 
    tempoRange: [70, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  
  // Pop & Mainstream
  'Pop': { 
    category: 'Pop', 
    tempoRange: [100, 130], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Indie Pop': { 
    category: 'Pop', 
    tempoRange: [100, 130], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Synth-Pop': { 
    category: 'Pop', 
    tempoRange: [100, 130], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Electropop': { 
    category: 'Pop', 
    tempoRange: [100, 130], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'K-Pop': { 
    category: 'Pop', 
    tempoRange: [100, 130], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'J-Pop': { 
    category: 'Pop', 
    tempoRange: [100, 130], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Dance Pop': { 
    category: 'Pop', 
    tempoRange: [100, 130], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Teen Pop': { 
    category: 'Pop', 
    tempoRange: [100, 130], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Art Pop': { 
    category: 'Pop', 
    tempoRange: [100, 130], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Bedroom Pop': { 
    category: 'Pop', 
    tempoRange: [100, 130], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  
  // Rock & Alternative
  'Rock': { 
    category: 'Rock', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Alternative Rock': { 
    category: 'Rock', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Indie Rock': { 
    category: 'Rock', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Post-Rock': { 
    category: 'Rock', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Math Rock': { 
    category: 'Rock', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Hard Rock': { 
    category: 'Rock', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Metal': { 
    category: 'Rock', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Heavy Metal': { 
    category: 'Rock', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Death Metal': { 
    category: 'Rock', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Black Metal': { 
    category: 'Rock', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Punk Rock': { 
    category: 'Rock', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Post-Punk': { 
    category: 'Rock', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Hardcore Punk': { 
    category: 'Rock', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Pop Punk': { 
    category: 'Rock', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Nu Metal': { 
    category: 'Rock', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Metalcore': { 
    category: 'Rock', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Deathcore': { 
    category: 'Rock', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Progressive Metal': { 
    category: 'Rock', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Shoegaze': { 
    category: 'Rock', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Dream Pop': { 
    category: 'Rock', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Noise Rock': { 
    category: 'Rock', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  
  // World & Traditional
  'Jazz': { 
    category: 'World', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Smooth Jazz': { 
    category: 'World', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Fusion Jazz': { 
    category: 'World', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Bebop': { 
    category: 'World', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Swing': { 
    category: 'World', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Reggae': { 
    category: 'World', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Dub': { 
    category: 'World', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Dancehall': { 
    category: 'World', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Ska': { 
    category: 'World', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Rocksteady': { 
    category: 'World', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Latin': { 
    category: 'World', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Salsa': { 
    category: 'World', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Bachata': { 
    category: 'World', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Reggaeton': { 
    category: 'World', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Cumbia': { 
    category: 'World', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Flamenco': { 
    category: 'World', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Tango': { 
    category: 'World', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Bossa Nova': { 
    category: 'World', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Samba': { 
    category: 'World', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'World Music': { 
    category: 'World', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Celtic': { 
    category: 'World', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Indian Classical': { 
    category: 'World', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Arabic': { 
    category: 'World', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'African': { 
    category: 'World', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  
  // Experimental & Avant-garde
  'Experimental': { 
    category: 'Experimental', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Noise': { 
    category: 'Experimental', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Industrial': { 
    category: 'Experimental', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'EBM': { 
    category: 'Experimental', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Darkwave': { 
    category: 'Experimental', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'IDM': { 
    category: 'Experimental', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Glitch': { 
    category: 'Experimental', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Microsound': { 
    category: 'Experimental', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Lowercase': { 
    category: 'Experimental', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Field Recording': { 
    category: 'Experimental', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Musique Concrète': { 
    category: 'Experimental', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Acousmatic': { 
    category: 'Experimental', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  },
  'Electroacoustic': { 
    category: 'Experimental', 
    tempoRange: [110, 140], 
    keyPreferences: ['A minor', 'E minor', 'F minor']
  }
};

export const VIBES = [
  'Dark', 'Atmospheric', 'Energetic', 'Uplifting', 'Chill', 'Relaxed',
  'Aggressive', 'Intense', 'Melancholic', 'Euphoric', 'Dreamy', 'Ethereal',
  'Raw', 'Gritty', 'Smooth', 'Sophisticated', 'Nostalgic', 'Retro',
  'Futuristic', 'Hypnotic', 'Driving', 'Peaceful', 'Romantic', 'Joyful'
];

export const DAWS = [
  'Ableton Live', 'Logic Pro X', 'FL Studio', 'Pro Tools', 'Cubase',
  'Studio One', 'Reason', 'Bitwig Studio', 'Reaper', 'GarageBand'
];

export const SCALES = [
  'C Major', 'G Major', 'D Major', 'A Major', 'E Major', 'B Major',
  'F# Major', 'C# Major', 'F Major', 'Bb Major', 'Eb Major', 'Ab Major',
  'Db Major', 'Gb Major', 'Cb Major',
  'A Minor', 'E Minor', 'B Minor', 'F# Minor', 'C# Minor', 'G# Minor',
  'D# Minor', 'A# Minor', 'D Minor', 'G Minor', 'C Minor', 'F Minor',
  'Bb Minor', 'Eb Minor', 'Ab Minor'
];

export const CHORD_PROGRESSIONS = {
  'Pop': ['I-V-vi-IV', 'vi-IV-I-V', 'I-vi-IV-V'],
  'Rock': ['I-bVII-IV-I', 'vi-IV-I-V', 'I-V-vi-IV'],
  'Jazz': ['ii-V-I', 'I-vi-ii-V', 'iii-vi-ii-V-I'],
  'Electronic': ['i-bVII-bVI-bVII', 'i-v-bVI-bVII', 'i-bIII-bVII-bVI'],
  'Hip Hop': ['i-bVII-bVI-bVII', 'i-iv-bVII-bIII', 'i-bVI-bVII-i'],
  'Ambient': ['I-iii-vi-IV', 'vi-I-iii-IV', 'I-V-iii-vi']
};

export const TEMPO_RANGES = {
  'Ambient': [60, 90],
  'Hip Hop': [70, 140],
  'House': [120, 130],
  'Techno': [120, 150],
  'Trance': [128, 140],
  'Dubstep': [140, 150],
  'Drum and Bass': [160, 180],
  'Pop': [100, 130],
  'Rock': [110, 140]
};