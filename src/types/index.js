// Music production types and constants

export const GENRES = [
  // Electronic Dance Music
  'House', 'Deep House', 'Progressive House', 'Tech House', 'Bass House', 'Acid House', 'Tribal House',
  'Techno', 'Minimal Techno', 'Industrial Techno', 'Melodic Techno', 'Hard Techno', 'Acid Techno',
  'Trance', 'Progressive Trance', 'Psytrance', 'Hard Trance', 'Uplifting Trance', 'Tech Trance',
  'Dubstep', 'Riddim', 'Brostep', 'Melodic Dubstep', 'Future Riddim',
  'Future Bass', 'Melodic Bass', 'Hybrid Trap', 'Wave',
  'Trap (EDM)', 'Festival Trap', 'Hard Trap',
  'Drum and Bass', 'Jungle', 'Liquid DnB', 'Neurofunk', 'Jump Up', 'Hardstep',
  'Breakbeat', 'Big Beat', 'UK Garage', '2-Step', 'Speed Garage',
  'Hardcore', 'Happy Hardcore', 'Gabber', 'Speedcore',
  'Electro', 'Electro House', 'Complextro', 'Moombahton', 'Moombahcore',
  
  // Ambient & Atmospheric
  'Ambient', 'Dark Ambient', 'Drone', 'Space Ambient', 'Cinematic Ambient',
  'Downtempo', 'Chillout', 'Lounge', 'Trip Hop', 'Chillstep',
  'New Age', 'Meditation', 'Nature Sounds',
  
  // Synthwave & Retro
  'Synthwave', 'Retrowave', 'Darksynth', 'Cyberpunk', 'Outrun',
  'Vaporwave', 'Future Funk', 'Mallsoft', 'Slushwave',
  
  // Hip Hop & Urban
  'Hip Hop', 'Boom Bap', 'Trap', 'Lo-fi Hip Hop', 'Cloud Rap', 'Drill',
  'Phonk', 'Memphis Rap', 'Crunk', 'Gangsta Rap', 'Conscious Rap',
  'Grime', 'UK Drill', 'Afrobeat', 'Afro House',
  
  // R&B & Soul
  'R&B', 'Contemporary R&B', 'Neo-Soul', 'Soul', 'Funk', 'P-Funk',
  'Gospel', 'Blues', 'Smooth Jazz',
  
  // Pop & Mainstream
  'Pop', 'Indie Pop', 'Synth-Pop', 'Electropop', 'K-Pop', 'J-Pop',
  'Dance Pop', 'Teen Pop', 'Art Pop', 'Bedroom Pop',
  
  // Rock & Alternative
  'Rock', 'Alternative Rock', 'Indie Rock', 'Post-Rock', 'Math Rock',
  'Hard Rock', 'Metal', 'Heavy Metal', 'Death Metal', 'Black Metal',
  'Punk Rock', 'Post-Punk', 'Hardcore Punk', 'Pop Punk',
  'Nu Metal', 'Metalcore', 'Deathcore', 'Progressive Metal',
  'Shoegaze', 'Dream Pop', 'Noise Rock',
  
  // World & Traditional
  'Jazz', 'Smooth Jazz', 'Fusion Jazz', 'Bebop', 'Swing',
  'Reggae', 'Dub', 'Dancehall', 'Ska', 'Rocksteady',
  'Latin', 'Salsa', 'Bachata', 'Reggaeton', 'Cumbia',
  'Flamenco', 'Tango', 'Bossa Nova', 'Samba',
  'World Music', 'Celtic', 'Indian Classical', 'Arabic', 'African',
  
  // Experimental & Avant-garde
  'Experimental', 'Noise', 'Industrial', 'EBM', 'Darkwave',
  'IDM', 'Glitch', 'Microsound', 'Lowercase', 'Field Recording',
  'Musique Concrète', 'Acousmatic', 'Electroacoustic'
];

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