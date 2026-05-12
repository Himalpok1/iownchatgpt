/**
 * CHOR KHOJA v9 - Complete Implementation
 * 
 * v9 FEATURES IMPLEMENTED:
 * 1. ✅ All Game On Family references removed (clean, standalone app)
 * 2. ✅ Reveal Word button ("Shabda Dekhaunu") shown for EVERY player before revealing
 * 3. ✅ Minimum 3 players strictly enforced with validation
 * 
 * Additional Features:
 * - 17+ word categories with Nepali cultural themes
 * - Classic Mode & In the Dark Mode
 * - Web3Forms feedback integration
 * - Responsive design for all devices
 * - Nepali flag, mountains, and cultural design elements
 */

// Game State (stored in memory, not localStorage)
const gameState = {
  numKhiladis: 4,
  players: [],
  category: 'nepali_ho_ni',
  difficulty: 'easy',
  mode: 'classic',
  numImposters: 1,
  hintsEnabled: false,
  secretWord: '',
  imposters: [],
  currentRevealIndex: 0,
  clues: {},
  votes: {},
  eliminated: [],
  theme: 'default',
  hapticEnabled: true,
  currentHints: [],
  eliminationOrder: [],
  playerWords: {}
};

// Hints Database - Subtle, less obvious hints
const wordHints = {
  cat: ['Frequently referenced in ancient Egyptian art', 'Popular subject of internet memes', 'Often seen lounging on windowsills'],
  dog: ['Featured prominently in many classic movies', 'Known for varied breeds worldwide', 'Common household companion globally'],
  bird: ['Studied extensively by ornithologists', 'Featured in many early morning sounds', 'Descendants of ancient creatures'],
  fish: ['Popular in many restaurant aquariums', 'Subject of sport and hobby', 'Requires specific temperature environments'],
  cow: ['Significant in various cultural traditions', 'Common sight in rural landscapes', 'Important agricultural animal'],
  pig: ['Often featured in children\'s literature', 'Raised on many farms worldwide', 'Unexpectedly intelligent animal'],
  duck: ['Often found at park ponds', 'Featured in various cartoons', 'Migratory patterns tracked worldwide'],
  frog: ['Subject of many biology classes', 'Undergoes dramatic life changes', 'Important environmental indicator'],
  bee: ['Critical for ecosystem health', 'Lives in highly organized societies', 'Produces valuable natural product'],
  ant: ['Remarkable strength for size', 'Complex underground networks', 'Often uninvited at picnics'],
  elephant: ['Never forgets, according to legend', 'Highly social and intelligent', 'Endangered in many regions'],
  tiger: ['Featured in many Asian cultures', 'Solitary hunter by nature', 'Critically endangered species'],
  lion: ['Social structure led by females', 'Featured on many emblems', 'Native to specific continents'],
  rabbit: ['Reproduces prolifically', 'Symbol of spring holidays', 'Popular in magic shows'],
  horse: ['Used in competitive sports', 'Measured in hands', 'Domesticated thousands of years ago'],
  dolphin: ['Uses echolocation', 'Highly social marine mammal', 'Protected in many countries'],
  penguin: ['Waddles on land but graceful in water', 'Monogamous in many species', 'Lives in southern hemisphere'],
  bear: ['Featured in many children\'s stories', 'Varies greatly in size by species', 'Sleeps through winter months'],
  rhinoceros: ['Poached for body parts', 'Poor eyesight compensated by other senses', 'Ancient lineage dating back millennia'],
  hippopotamus: ['Deceptively dangerous', 'Spends most time submerged', 'Secretes natural sunscreen'],
  pizza: ['Originated in Naples', 'Has countless topping variations', 'Often delivered to your door'],
  cake: ['Comes in many layers', 'Often decorated elaborately', 'Center of birthday celebrations'],
  apple: ['Subject of famous tech company', 'Falls from trees according to physics legend', 'Comes in thousands of varieties'],
  bread: ['Has been staple for millennia', 'Requires yeast in many forms', 'Cultural variations worldwide'],
  milk: ['Pasteurized for safety', 'Comes from various animals', 'Forms base of many products'],
  burger: ['All-American classic', 'Named after a German city', 'Endless customization options'],
  pasta: ['Hundreds of shape varieties', 'Al dente is the goal', 'Marco Polo didn\'t discover it'],
  sushi: ['Requires years to master', 'Not always raw', 'Served with specific accompaniments'],
  chocolate: ['From Central American origins', 'Contains mood-enhancing compounds', 'Processed from tropical beans'],
  quinoa: ['Complete protein source', 'Requires thorough rinsing', 'Grown at high altitudes'],
  avocado: ['Called "green gold" in farming', 'Single seed inside', 'Ripens after harvesting'],
  car: ['Requires regular maintenance', 'Comes in manual or automatic', 'Major purchase for most families'],
  phone: ['Rarely used for original purpose', 'Contains more computing power than early spacecraft', 'Replaced many single-purpose devices'],
  book: ['Smells distinctive when old', 'Digital versions increasingly popular', 'Can transport you anywhere'],
  chair: ['Design varies by culture', 'Ergonomics important for health', 'Can be collectible and valuable'],
  computer: ['Binary is its language', 'Desktop or portable varieties', 'Central to modern work'],
  camera: ['Megapixels matter but aren\'t everything', 'Professional versions quite expensive', 'Now built into most phones'],
  watch: ['Mechanical versions highly collectible', 'Now often "smart"', 'Worn on dominant or non-dominant wrist'],
  telescope: ['Amateur astronomers love these', 'Needs dark skies for best results', 'Invented in the Netherlands'],
  teacher: ['Requires special certification', 'Often underappreciated profession', 'Shapes future generations'],
  christmas: ['Celebrated on different dates by some', 'Associated with specific colors', 'Retail shopping peak season'],
  santa: ['Based on historical figure', 'Depicted differently across cultures', 'Travels impossibly fast according to legend'],
  reindeer: ['Actually called caribou in North America', 'Both genders grow antlers', 'Domesticated in some regions'],
  turkey: ['Benjamin Franklin advocated for this', 'Named after wrong country', 'Farm-raised are different from wild'],
  pumpkin: ['Technically a fruit', 'Originated in North America', 'Carved for autumn tradition'],
  unicorn: ['National animal of Scotland', 'Appears in medieval tapestries', 'Symbol of purity in mythology']
};

// Word Categories - 18 Categories with 100+ words each
const wordCategories = {
  nepali_ho_ni: {
    easy: ['Nibba', 'Bheda', 'Kanda', 'Lodu', 'Taas', 'Charo', 'Chappar', 'Keto', 'Sel Roti', 'Bidesh', 'IELTS', 'Gen-Z', 'Neta', 'Budo', 'Chiya', 'Churot', 'Chutiya', 'Swag keto', 'Jhola-Gang', 'Jhap', 'Gidi', 'Baal ho', 'Kaathe', 'Patyaune', 'Waalchyaal', 'Lyang-lyang', 'Pasa', 'Mama ghar', 'Baal xaina', 'Pagal Ho', 'Comdey', 'Dar', 'NepoBaby', 'Balen', 'KP-Baa', 'Deuba', 'Rajesh', 'Maha Nayak', 'Pashupati', 'Bouddha', 'Ghantaa', 'Jhapali', 'Bhele', 'Kavreli', 'Samdhi', 'Newari', 'Bahun', 'Jhaarpaat', 'Belauti', 'Velu', 'Aashika', 'Dashai', 'Tihar', 'Jado', 'Tika', 'Dhila ayo kada ayo', 'Thulo Manchhe', 'Sathi'],
    medium: ['Nibba', 'Bheda', 'Kanda', 'Lodu', 'Taas', 'Charo', 'Chappar', 'Keto', 'Sel Roti', 'Bidesh', 'IELTS', 'Gen-Z', 'Neta', 'Budo', 'Chiya', 'Churot', 'Chutiya', 'Swag keto', 'Jhola-Gang', 'Jhap', 'Gidi', 'Baal ho', 'Kaathe', 'Patyaune', 'Waalchyaal', 'Lyang-lyang', 'Pasa', 'Mama ghar', 'Baal xaina', 'Pagal Ho', 'Comdey', 'Dar', 'NepoBaby', 'Balen', 'KP-Baa', 'Deuba', 'Rajesh', 'Maha Nayak', 'Pashupati', 'Bouddha', 'Ghantaa', 'Jhapali', 'Bhele', 'Kavreli', 'Samdhi', 'Newari', 'Bahun', 'Jhaarpaat', 'Belauti', 'Velu', 'Aashika', 'Dashai', 'Tihar', 'Jado', 'Tika', 'Dhila ayo kada ayo', 'Thulo Manchhe', 'Sathi'],
    hard: ['Nibba', 'Bheda', 'Kanda', 'Lodu', 'Taas', 'Charo', 'Chappar', 'Keto', 'Sel Roti', 'Bidesh', 'IELTS', 'Gen-Z', 'Neta', 'Budo', 'Chiya', 'Churot', 'Chutiya', 'Swag keto', 'Jhola-Gang', 'Jhap', 'Gidi', 'Baal ho', 'Kaathe', 'Patyaune', 'Waalchyaal', 'Lyang-lyang', 'Pasa', 'Mama ghar', 'Baal xaina', 'Pagal Ho', 'Comdey', 'Dar', 'NepoBaby', 'Balen', 'KP-Baa', 'Deuba', 'Rajesh', 'Maha Nayak', 'Pashupati', 'Bouddha', 'Ghantaa', 'Jhapali', 'Bhele', 'Kavreli', 'Samdhi', 'Newari', 'Bahun', 'Jhaarpaat', 'Belauti', 'Velu', 'Aashika', 'Dashai', 'Tihar', 'Jado', 'Tika', 'Dhila ayo kada ayo', 'Thulo Manchhe', 'Sathi']
  },
  animals: {
    easy: ['cat', 'dog', 'bird', 'fish', 'cow', 'pig', 'duck', 'frog', 'bee', 'ant', 'rat', 'mouse', 'bat', 'fly', 'moth', 'crab', 'snail', 'slug', 'worm', 'spider', 'snake', 'lizard', 'seal', 'otter', 'beaver', 'moose', 'zebra', 'camel', 'goose', 'swan', 'crow', 'dove', 'hawk', 'parrot', 'robin', 'wasp', 'beetle', 'ladybug', 'cricket', 'mantis'],
    medium: ['elephant', 'tiger', 'lion', 'rabbit', 'horse', 'sheep', 'goat', 'chicken', 'turtle', 'butterfly', 'whale', 'dolphin', 'shark', 'penguin', 'eagle', 'owl', 'bear', 'wolf', 'fox', 'deer', 'giraffe', 'leopard', 'cheetah', 'hyena', 'gazelle', 'antelope', 'buffalo', 'bison', 'yak', 'llama', 'alpaca', 'donkey', 'mule', 'pony', 'squirrel', 'chipmunk', 'raccoon', 'skunk', 'badger', 'weasel', 'mink', 'ferret', 'hedgehog', 'porcupine', 'armadillo', 'sloth', 'anteater', 'aardvark', 'mongoose', 'meerkat', 'lemur', 'koala', 'wombat', 'opossum', 'wallaby', 'octopus', 'squid', 'jellyfish', 'starfish', 'seahorse', 'clownfish', 'swordfish', 'tuna', 'salmon', 'trout', 'bass', 'catfish', 'pike', 'stingray', 'eel', 'lobster', 'shrimp', 'oyster', 'clam', 'mussel', 'scallop', 'urchin'],
    hard: ['rhinoceros', 'hippopotamus', 'orangutan', 'chimpanzee', 'kangaroo', 'platypus', 'chameleon', 'iguana', 'salamander', 'axolotl', 'narwhal', 'beluga', 'manatee', 'dugong', 'walrus', 'pangolin', 'tapir', 'capybara', 'chinchilla', 'dingo', 'jackal', 'wolverine', 'lynx', 'bobcat', 'ocelot', 'cougar', 'jaguar', 'panther', 'caracal', 'serval']
  },
  food: {
    easy: ['pizza', 'cake', 'apple', 'bread', 'milk', 'egg', 'rice', 'soup', 'candy', 'cookie', 'pie', 'jam', 'honey', 'salt', 'sugar', 'tea', 'coffee', 'juice', 'water', 'soda', 'chips', 'fries', 'hotdog', 'donut', 'muffin', 'waffle', 'pancake', 'toast', 'cereal', 'oatmeal', 'yogurt', 'butter', 'cream', 'jelly', 'syrup', 'ketchup', 'mustard', 'mayo', 'sauce', 'gravy'],
    medium: ['burger', 'pasta', 'salad', 'sandwich', 'taco', 'sushi', 'cheese', 'bacon', 'chicken', 'beef', 'noodles', 'ice cream', 'chocolate', 'banana', 'orange', 'grape', 'carrot', 'potato', 'tomato', 'corn', 'burrito', 'enchilada', 'quesadilla', 'nachos', 'curry', 'stew', 'chili', 'casserole', 'lasagna', 'ravioli', 'tortellini', 'gnocchi', 'risotto', 'paella', 'biryani', 'kebab', 'falafel', 'hummus', 'guacamole', 'salsa', 'pesto', 'marinara', 'alfredo', 'carbonara', 'bolognese', 'ramen', 'pho', 'udon', 'soba', 'dumplings', 'spring rolls', 'tempura', 'teriyaki', 'kimchi', 'bibimbap', 'bulgogi', 'pad thai', 'satay', 'rendang', 'goulash', 'schnitzel', 'bratwurst', 'pretzels', 'croissant', 'baguette', 'focaccia', 'ciabatta', 'sourdough', 'rye', 'pumpernickel', 'brioche', 'challah', 'naan', 'pita', 'tortilla', 'crepe', 'quiche', 'frittata', 'omelet'],
    hard: ['quinoa', 'avocado', 'artichoke', 'asparagus', 'eggplant', 'zucchini', 'cauliflower', 'brussels sprouts', 'kale', 'arugula', 'borscht', 'gazpacho', 'bouillabaisse', 'cassoulet', 'coq au vin', 'ratatouille', 'bourguignon', 'Wellington', 'consomme', 'bisque', 'chowder', 'minestrone', 'pistou', 'cacciatore', 'osso buco', 'scaloppine', 'piccata', 'marsala', 'puttanesca', 'arrabiata']
  },
  objects: {
    easy: ['car', 'bike', 'book', 'pen', 'chair', 'table', 'bed', 'lamp', 'clock', 'key', 'door', 'window', 'wall', 'floor', 'roof', 'mirror', 'brush', 'comb', 'towel', 'soap', 'shampoo', 'toothbrush', 'fork', 'spoon', 'knife', 'bowl', 'mug', 'pillow', 'blanket', 'sheet', 'curtain', 'rug', 'couch', 'desk', 'shelf', 'drawer', 'closet', 'hanger', 'box', 'bag'],
    medium: ['phone', 'computer', 'camera', 'television', 'radio', 'microwave', 'refrigerator', 'vacuum', 'hammer', 'scissors', 'wallet', 'shoes', 'shirt', 'hat', 'glasses', 'watch', 'bottle', 'cup', 'plate', 'laptop', 'tablet', 'keyboard', 'mouse', 'monitor', 'printer', 'scanner', 'router', 'modem', 'charger', 'cable', 'headphones', 'speaker', 'remote', 'controller', 'console', 'projector', 'screen', 'whiteboard', 'marker', 'eraser', 'stapler', 'paperclip', 'folder', 'binder', 'notebook', 'calculator', 'ruler', 'compass', 'protractor', 'pencil', 'crayon', 'paint', 'canvas', 'easel', 'suitcase', 'backpack', 'purse', 'briefcase', 'umbrella', 'raincoat', 'jacket', 'scarf', 'gloves', 'boots', 'sandals', 'slippers', 'belt', 'tie', 'necklace', 'bracelet', 'ring', 'earrings', 'lipstick', 'mascara', 'perfume', 'deodorant'],
    hard: ['oscilloscope', 'theodolite', 'spectrophotometer', 'centrifuge', 'chronometer', 'barometer', 'hygrometer', 'anemometer', 'seismograph', 'telescope', 'microscope', 'stethoscope', 'sphygmomanometer', 'thermometer', 'metronome', 'astrolabe', 'sextant', 'octant', 'quadrant', 'sundial', 'hourglass', 'abacus', 'slide rule', 'protractor', 'calipers', 'micrometer', 'tachometer', 'odometer', 'altimeter', 'voltmeter']
  },
  school: {
    easy: ['book', 'pen', 'desk', 'teacher', 'student', 'test', 'homework', 'math', 'art', 'gym', 'class', 'lesson', 'paper', 'pencil', 'eraser', 'ruler', 'crayon', 'marker', 'glue', 'tape', 'scissors', 'folder', 'binder', 'notebook', 'lunch', 'recess', 'bell', 'locker', 'hall', 'door', 'bus', 'flag', 'map', 'globe', 'clock', 'calendar', 'chart', 'poster', 'board', 'chalk'],
    medium: ['classroom', 'chalkboard', 'whiteboard', 'calculator', 'backpack', 'textbook', 'quiz', 'grade', 'library', 'science', 'history', 'english', 'music', 'cafeteria', 'playground', 'diploma', 'semester', 'quarter', 'trimester', 'period', 'schedule', 'syllabus', 'assignment', 'project', 'presentation', 'report', 'essay', 'paragraph', 'sentence', 'word', 'letter', 'number', 'equation', 'formula', 'theorem', 'hypothesis', 'experiment', 'observation', 'conclusion', 'microscope', 'telescope', 'beaker', 'flask', 'test tube', 'bunsen burner', 'periodic table', 'atom', 'molecule', 'element', 'compound', 'mixture', 'solution', 'reaction', 'biology', 'chemistry', 'physics', 'geology', 'astronomy', 'geography', 'algebra', 'geometry', 'calculus', 'trigonometry', 'statistics', 'probability', 'literature', 'grammar', 'vocabulary', 'spelling', 'reading', 'writing', 'composition', 'poetry', 'fiction', 'nonfiction', 'drama', 'orchestra', 'band', 'choir'],
    hard: ['curriculum', 'pedagogy', 'etymology', 'bibliography', 'laboratory', 'observatory', 'auditorium', 'symposium', 'thesis', 'dissertation', 'methodology', 'epistemology', 'ontology', 'phenomenology', 'hermeneutics', 'heuristics', 'mnemonics', 'semantics', 'syntax', 'lexicon', 'morphology', 'phonetics', 'phonology', 'prosody', 'orthography', 'calligraphy', 'stenography', 'cryptography', 'cartography', 'topography']
  },
  sports: {
    easy: ['basketball', 'soccer', 'football', 'tennis', 'baseball', 'golf', 'hockey', 'swimming', 'running', 'jumping', 'skating', 'skiing', 'boxing', 'wrestling', 'cycling', 'racing', 'climbing', 'hiking', 'fishing', 'hunting', 'surfing', 'sailing', 'rowing', 'diving', 'volleyball', 'softball', 'cricket', 'rugby', 'polo', 'bowling', 'darts', 'pool', 'ping pong', 'badminton', 'frisbee', 'dodgeball', 'kickball', 'handball', 'tetherball', 'hopscotch'],
    medium: ['chess', 'poker', 'trophy', 'medal', 'scoreboard', 'referee', 'coach', 'athlete', 'champion', 'winner', 'team', 'goal', 'score', 'racket', 'bat', 'stadium', 'arena', 'field', 'court', 'track', 'pool', 'rink', 'course', 'lane', 'net', 'hoop', 'basket', 'backboard', 'rim', 'base', 'plate', 'mound', 'outfield', 'infield', 'dugout', 'penalty', 'foul', 'timeout', 'halftime', 'overtime', 'quarter', 'inning', 'round', 'set', 'match', 'game', 'tournament', 'championship', 'playoff', 'finals', 'offense', 'defense', 'goalie', 'goalkeeper', 'pitcher', 'catcher', 'batter', 'runner', 'forward', 'guard', 'center', 'tackle', 'quarterback', 'linebacker', 'receiver', 'kicker', 'punter', 'serve', 'volley', 'spike', 'dunk', 'layup', 'free throw', 'three pointer', 'home run', 'touchdown', 'field goal', 'safety', 'tackle', 'interception', 'fumble'],
    hard: ['lacrosse', 'squash', 'curling', 'archery', 'fencing', 'bobsled', 'luge', 'skeleton', 'pentathlon', 'decathlon', 'heptathlon', 'triathlon', 'biathlon', 'steeplechase', 'hurdles', 'javelin', 'discus', 'shot put', 'hammer throw', 'pole vault', 'high jump', 'long jump', 'triple jump', 'gymnastics', 'pommel horse', 'parallel bars', 'uneven bars', 'balance beam', 'floor exercise', 'vault']
  },
  movies: {
    easy: ['cinema', 'movie', 'actor', 'popcorn', 'film', 'character', 'comedy', 'hero', 'villain', 'scene', 'trailer', 'sequel', 'remake', 'poster', 'rating', 'genre', 'western', 'musical', 'romance', 'horror', 'mystery', 'action', 'drama', 'sitcom', 'series', 'episode', 'season', 'finale', 'cliffhanger', 'star', 'extra', 'stunt', 'makeup', 'costume', 'prop', 'set', 'studio', 'producer', 'editor', 'writer'],
    medium: ['actress', 'script', 'director', 'camera', 'screen', 'ticket', 'premiere', 'thriller', 'superhero', 'adventure', 'fantasy', 'animation', 'plot', 'screenplay', 'blockbuster', 'documentary', 'biopic', 'noir', 'suspense', 'satire', 'parody', 'mockumentary', 'anthology', 'franchise', 'trilogy', 'prequel', 'spin-off', 'reboot', 'adaptation', 'soundtrack', 'score', 'composer', 'narrator', 'voice actor', 'motion capture', 'green screen', 'CGI', 'special effects', 'visual effects', 'practical effects', 'makeup artist', 'prosthetics', 'wardrobe', 'hairstylist', 'cinematographer', 'gaffer', 'grip', 'boom operator', 'sound mixer', 'foley artist', 'colorist', 'dailies', 'rough cut', 'final cut', 'directors cut', 'theatrical release', 'streaming', 'box office', 'opening weekend', 'matinee', 'IMAX', '3D', '4K', 'widescreen', 'aspect ratio', 'frame rate', 'slow motion', 'time lapse', 'dolly', 'crane shot', 'tracking shot', 'steadicam', 'handheld', 'POV', 'close-up', 'wide shot', 'establishing shot'],
    hard: ['cinematography', 'montage', 'flashback', 'foreshadowing', 'metaphor', 'symbolism', 'protagonist', 'antagonist', 'climax', 'denouement', 'exposition', 'rising action', 'falling action', 'resolution', 'deus ex machina', 'MacGuffin', 'red herring', 'Chekhov\'s gun', 'fourth wall', 'mise-en-scene', 'auteur', 'neorealism', 'expressionism', 'surrealism', 'existentialism', 'postmodernism', 'metacinema', 'intertextuality', 'subtext', 'allegory']
  },
  music: {
    easy: ['guitar', 'piano', 'drum', 'violin', 'saxophone', 'microphone', 'song', 'music', 'singer', 'band', 'concert', 'stage', 'radio', 'headphones', 'speaker', 'stereo', 'album', 'CD', 'vinyl', 'cassette', 'playlist', 'genre', 'rock', 'pop', 'jazz', 'blues', 'country', 'folk', 'gospel', 'rap', 'hip hop', 'metal', 'punk', 'disco', 'techno', 'house', 'trance', 'reggae', 'ska', 'soul'],
    medium: ['trumpet', 'flute', 'rhythm', 'beat', 'melody', 'harmony', 'artist', 'musician', 'conductor', 'orchestra', 'note', 'chord', 'lyrics', 'bass', 'cello', 'viola', 'harp', 'banjo', 'ukulele', 'mandolin', 'accordion', 'harmonica', 'clarinet', 'oboe', 'bassoon', 'trombone', 'tuba', 'French horn', 'cornet', 'piccolo', 'recorder', 'xylophone', 'marimba', 'vibraphone', 'tambourine', 'cymbals', 'gong', 'triangle', 'cowbell', 'castanets', 'bongos', 'congas', 'timpani', 'snare drum', 'bass drum', 'tom-tom', 'hi-hat', 'synthesizer', 'keyboard', 'organ', 'electric guitar', 'acoustic guitar', 'bass guitar', 'twelve-string', 'sitar', 'lute', 'balalaika', 'bagpipes', 'didgeridoo', 'pan flute', 'ocarina', 'kazoo', 'verse', 'chorus', 'bridge', 'refrain', 'hook', 'riff', 'solo', 'duet', 'trio', 'quartet', 'quintet', 'ensemble', 'choir', 'soprano', 'alto', 'tenor', 'baritone', 'treble', 'tempo', 'pitch', 'tone', 'timbre'],
    hard: ['sonata', 'concerto', 'symphony', 'crescendo', 'diminuendo', 'arpeggio', 'staccato', 'legato', 'vibrato', 'tremolo', 'pizzicato', 'glissando', 'portamento', 'rubato', 'fermata', 'sforzando', 'fortissimo', 'pianissimo', 'adagio', 'andante', 'allegro', 'presto', 'largo', 'moderato', 'vivace', 'accelerando', 'ritardando', 'cadenza', 'coda', 'ostinato']
  },
  nature: {
    easy: ['tree', 'forest', 'mountain', 'river', 'ocean', 'beach', 'lake', 'sky', 'sun', 'moon', 'star', 'cloud', 'rain', 'snow', 'wind', 'storm', 'lightning', 'thunder', 'rainbow', 'fog', 'mist', 'dew', 'frost', 'ice', 'water', 'fire', 'earth', 'air', 'leaf', 'branch', 'trunk', 'root', 'bark', 'seed', 'plant', 'flower', 'grass', 'bush', 'shrub', 'vine'],
    medium: ['hill', 'cave', 'waterfall', 'island', 'valley', 'volcano', 'garden', 'park', 'trail', 'rock', 'stone', 'desert', 'swamp', 'meadow', 'prairie', 'plain', 'plateau', 'canyon', 'gorge', 'ravine', 'cliff', 'boulder', 'pebble', 'sand', 'mud', 'clay', 'soil', 'dirt', 'dust', 'stream', 'creek', 'brook', 'pond', 'marsh', 'wetland', 'bayou', 'estuary', 'delta', 'fjord', 'glacier', 'iceberg', 'avalanche', 'landslide', 'earthquake', 'tsunami', 'hurricane', 'tornado', 'cyclone', 'typhoon', 'monsoon', 'blizzard', 'hailstorm', 'drought', 'flood', 'wildfire', 'sunrise', 'sunset', 'dawn', 'dusk', 'twilight', 'noon', 'midnight', 'equinox', 'solstice', 'season', 'spring', 'summer', 'autumn', 'winter', 'tide', 'wave', 'current', 'whirlpool', 'rapids', 'geyser', 'hot spring', 'mineral spring', 'oasis', 'dune', 'mesa', 'butte', 'pinnacle'],
    hard: ['tundra', 'taiga', 'savanna', 'ecosystem', 'biosphere', 'topography', 'erosion', 'sediment', 'mineral', 'fossil', 'stratosphere', 'troposphere', 'ionosphere', 'magnetosphere', 'aurora borealis', 'aurora australis', 'precipitation', 'condensation', 'evaporation', 'sublimation', 'metamorphosis', 'photosynthesis', 'transpiration', 'pollination', 'germination', 'decomposition', 'biodiversity', 'habitat', 'niche', 'symbiosis']
  },
  technology: {
    easy: ['computer', 'phone', 'tablet', 'laptop', 'keyboard', 'mouse', 'monitor', 'screen', 'button', 'switch', 'remote', 'cable', 'wire', 'plug', 'outlet', 'battery', 'charger', 'adapter', 'USB', 'wifi', 'bluetooth', 'email', 'text', 'call', 'video', 'photo', 'selfie', 'emoji', 'like', 'share', 'post', 'tweet', 'snap', 'story', 'filter', 'hashtag', 'viral', 'meme', 'gif', 'icon'],
    medium: ['printer', 'router', 'headphones', 'camera', 'smartwatch', 'drone', 'robot', 'AI', 'software', 'app', 'internet', 'website', 'code', 'pixel', 'circuit', 'server', 'data', 'smartphone', 'touchscreen', 'webcam', 'microphone', 'speaker', 'earbuds', 'VR headset', 'console', 'joystick', 'controller', 'hard drive', 'SSD', 'RAM', 'CPU', 'GPU', 'processor', 'chip', 'transistor', 'capacitor', 'resistor', 'diode', 'LED', 'LCD', 'OLED', 'resolution', 'refresh rate', 'bandwidth', 'download', 'upload', 'streaming', 'buffering', 'lag', 'ping', 'fps', 'browser', 'search engine', 'homepage', 'bookmark', 'tab', 'window', 'menu', 'toolbar', 'sidebar', 'notification', 'update', 'upgrade', 'download', 'install', 'uninstall', 'backup', 'restore', 'sync', 'cloud', 'password', 'username', 'login', 'logout', 'profile', 'avatar', 'settings', 'preferences', 'customize'],
    hard: ['algorithm', 'blockchain', 'cryptography', 'quantum', 'protocol', 'encryption', 'firmware', 'motherboard', 'semiconductor', 'nanotechnology', 'biotechnology', 'cybersecurity', 'malware', 'ransomware', 'phishing', 'firewall', 'antivirus', 'VPN', 'proxy', 'cookie', 'cache', 'metadata', 'API', 'SDK', 'IDE', 'compiler', 'interpreter', 'debugger', 'repository', 'version control']
  },
  jobs: {
    easy: ['doctor', 'teacher', 'engineer', 'chef', 'pilot', 'soldier', 'firefighter', 'police', 'nurse', 'dentist', 'lawyer', 'judge', 'farmer', 'baker', 'butcher', 'waiter', 'cashier', 'clerk', 'guard', 'driver', 'plumber', 'painter', 'builder', 'cleaner', 'janitor', 'maid', 'nanny', 'babysitter', 'mailman', 'postman', 'delivery', 'tailor', 'barber', 'stylist', 'florist', 'gardener', 'landscaper', 'miner', 'logger', 'fisher'],
    medium: ['carpenter', 'mechanic', 'artist', 'musician', 'actor', 'athlete', 'coach', 'reporter', 'director', 'manager', 'boss', 'secretary', 'accountant', 'banker', 'broker', 'analyst', 'consultant', 'advisor', 'counselor', 'therapist', 'psychologist', 'psychiatrist', 'pharmacist', 'paramedic', 'EMT', 'surgeon', 'specialist', 'veterinarian', 'scientist', 'researcher', 'professor', 'librarian', 'architect', 'designer', 'photographer', 'videographer', 'editor', 'writer', 'author', 'journalist', 'broadcaster', 'announcer', 'DJ', 'producer', 'composer', 'conductor', 'dancer', 'choreographer', 'model', 'fashion designer', 'jeweler', 'watchmaker', 'locksmith', 'electrician', 'welder', 'mason', 'roofer', 'glazier', 'tiler', 'plasterer', 'drywaller', 'insulator', 'HVAC technician', 'machinist', 'toolmaker', 'blacksmith', 'cobbler', 'upholsterer', 'seamstress', 'tailor', 'weaver', 'spinner', 'dyer', 'tanner', 'furrier', 'taxidermist'],
    hard: ['geologist', 'archaeologist', 'entomologist', 'meteorologist', 'oceanographer', 'astronomer', 'cardiologist', 'orthopedist', 'dermatologist', 'neurologist', 'oncologist', 'radiologist', 'anesthesiologist', 'pathologist', 'epidemiologist', 'immunologist', 'endocrinologist', 'gastroenterologist', 'hematologist', 'nephrologist', 'pulmonologist', 'rheumatologist', 'urologist', 'ophthalmologist', 'otolaryngologist', 'podiatrist', 'chiropractor', 'osteopath', 'acupuncturist', 'homeopath']
  },
  superheroes: {
    easy: ['Superman', 'Batman', 'Spider-Man', 'Iron Man', 'Wonder Woman', 'Thor', 'Hulk', 'Flash', 'Aquaman', 'Green Lantern', 'Hawkeye', 'Black Widow', 'Captain America', 'Black Panther', 'Ant-Man', 'Wasp', 'Wolverine', 'Cyclops', 'Storm', 'Rogue', 'Gambit', 'Beast', 'Iceman', 'Phoenix', 'Jean Grey', 'Professor X', 'Daredevil', 'Punisher', 'Luke Cage', 'Jessica Jones', 'Deadpool', 'Catwoman', 'Robin', 'Nightwing', 'Batgirl', 'Supergirl', 'Power Girl', 'Hawkman', 'Hawkgirl', 'Shazam'],
    medium: ['Joker', 'Lex Luthor', 'Thanos', 'Darth Vader', 'Voldemort', 'Maleficent', 'Cruella', 'Ursula', 'Scar', 'Gaston', 'Sauron', 'Loki', 'Venom', 'Green Goblin', 'Doctor Octopus', 'Sandman', 'Mysterio', 'Vulture', 'Kingpin', 'Penguin', 'Riddler', 'Two-Face', 'Scarecrow', 'Bane', 'Poison Ivy', 'Harley Quinn', 'Ra\'s al Ghul', 'Deathstroke', 'Sinestro', 'Black Adam', 'Reverse Flash', 'Zoom', 'Gorilla Grodd', 'Captain Cold', 'Heat Wave', 'Weather Wizard', 'Mirror Master', 'Trickster', 'Pied Piper', 'Abra Kadabra', 'Black Manta', 'Ocean Master', 'Cheetah', 'Ares', 'Circe', 'Giganta', 'Doctor Psycho', 'Silver Banshee', 'Livewire', 'Metallo', 'Brainiac', 'Darkseid', 'Mongul', 'Doomsday', 'Bizarro', 'Parasite', 'Toyman', 'Mister Mxyzptlk', 'Cyborg Superman', 'General Zod', 'Ultron', 'Red Skull', 'Hydra', 'AIM', 'Baron Zemo', 'Winter Soldier', 'Taskmaster', 'Bullseye', 'Electra', 'The Hand', 'Mandarin', 'Whiplash', 'Justin Hammer', 'Obadiah Stane', 'Killmonger', 'Klaw', 'Man-Ape', 'Yellowjacket', 'Ghost'],
    hard: ['Apocalypse', 'Magneto', 'Doctor Doom', 'Galactus', 'Dormammu', 'Hela', 'Ronan', 'Nebula', 'Gamora', 'Star-Lord', 'Mephisto', 'Nightmare', 'Shuma-Gorath', 'Cyttorak', 'Eternity', 'Infinity', 'Living Tribunal', 'Celestials', 'Beyonder', 'Molecule Man', 'Franklin Richards', 'Scarlet Witch', 'Doctor Strange', 'Ancient One', 'Wong', 'Mordo', 'Kaecilius', 'Ebony Maw', 'Corvus Glaive', 'Proxima Midnight']
  },
  mythology: {
    easy: ['Zeus', 'Poseidon', 'Hades', 'Medusa', 'Dragon', 'Phoenix', 'Unicorn', 'Mermaid', 'Fairy', 'Elf', 'Dwarf', 'Giant', 'Troll', 'Ogre', 'Goblin', 'Witch', 'Wizard', 'Vampire', 'Werewolf', 'Ghost', 'Zombie', 'Mummy', 'Cyclops', 'Centaur', 'Satyr', 'Nymph', 'Angel', 'Demon', 'Devil', 'God', 'Goddess', 'Hero', 'Titan', 'Olympian', 'Atlantis', 'Avalon', 'Camelot', 'Valhalla', 'Asgard', 'Olympus'],
    medium: ['Aphrodite', 'Ares', 'Pegasus', 'Minotaur', 'Sphinx', 'Kraken', 'Cerberus', 'Valkyrie', 'Odin', 'Loki', 'Merlin', 'Arthur', 'Excalibur', 'Ra', 'Anubis', 'Isis', 'Apollo', 'Artemis', 'Athena', 'Hermes', 'Hephaestus', 'Dionysus', 'Demeter', 'Hera', 'Hestia', 'Persephone', 'Hercules', 'Perseus', 'Theseus', 'Achilles', 'Odysseus', 'Orpheus', 'Icarus', 'Daedalus', 'Pandora', 'Prometheus', 'Sisyphus', 'Tantalus', 'Atlas', 'Helios', 'Selene', 'Eos', 'Nike', 'Nemesis', 'Eris', 'Hecate', 'Morpheus', 'Hypnos', 'Thanatos', 'Charon', 'Styx', 'Acheron', 'Thor', 'Freya', 'Frigg', 'Baldur', 'Tyr', 'Heimdall', 'Fenrir', 'Jormungandr', 'Sleipnir', 'Yggdrasil', 'Ragnarok', 'Amaterasu', 'Susanoo', 'Tsukuyomi', 'Izanagi', 'Izanami', 'Inari', 'Kitsune', 'Tengu', 'Oni', 'Kappa', 'Ryu', 'Hou-ou', 'Qilin', 'Baku'],
    hard: ['Laocoon', 'Chimera', 'Banshee', 'Gorgon', 'Gargoyle', 'Leviathan', 'Golem', 'Naga', 'Hydra', 'Typhon', 'Echidna', 'Scylla', 'Charybdis', 'Orthrus', 'Nemean Lion', 'Erymanthian Boar', 'Cretan Bull', 'Ceryneian Hind', 'Stymphalian Birds', 'Lernaean Hydra', 'Caucasian Eagle', 'Teumessian Fox', 'Calydonian Boar', 'Hippocampus', 'Gryphon', 'Basilisk', 'Cockatrice', 'Manticore', 'Wyvern', 'Ouroboros']
  },
  countries: {
    easy: ['France', 'Japan', 'Brazil', 'Egypt', 'Canada', 'USA', 'China', 'India', 'Mexico', 'Spain', 'Italy', 'Germany', 'England', 'Russia', 'Australia', 'Argentina', 'Chile', 'Peru', 'Colombia', 'Venezuela', 'Cuba', 'Jamaica', 'Greece', 'Turkey', 'Iran', 'Iraq', 'Israel', 'Saudi Arabia', 'UAE', 'Thailand', 'Vietnam', 'Korea', 'Philippines', 'Indonesia', 'Malaysia', 'Singapore', 'Pakistan', 'Bangladesh', 'Nepal', 'Kenya'],
    medium: ['London', 'Paris', 'Tokyo', 'New York', 'Rome', 'Sydney', 'Dubai', 'Bangkok', 'Barcelona', 'Venice', 'Amsterdam', 'Cairo', 'Moscow', 'Berlin', 'Madrid', 'Istanbul', 'Mumbai', 'Toronto', 'Mexico City', 'Rio de Janeiro', 'Buenos Aires', 'Lima', 'Bogota', 'Santiago', 'Havana', 'Kingston', 'Athens', 'Jerusalem', 'Mecca', 'Riyadh', 'Tehran', 'Baghdad', 'Kabul', 'Karachi', 'Delhi', 'Kolkata', 'Chennai', 'Bangalore', 'Dhaka', 'Kathmandu', 'Colombo', 'Hanoi', 'Seoul', 'Pyongyang', 'Beijing', 'Shanghai', 'Hong Kong', 'Taipei', 'Manila', 'Jakarta', 'Kuala Lumpur', 'Nairobi', 'Lagos', 'Cape Town', 'Johannesburg', 'Alexandria', 'Casablanca', 'Tunis', 'Algiers', 'Tripoli', 'Addis Ababa', 'Khartoum', 'Dakar', 'Accra', 'Abuja', 'Kinshasa', 'Luanda', 'Harare', 'Maputo', 'Antananarivo', 'Mauritius', 'Seychelles', 'Maldives', 'Fiji', 'Samoa', 'Tahiti', 'Auckland', 'Wellington', 'Melbourne', 'Perth', 'Brisbane'],
    hard: ['Luxembourg', 'Montenegro', 'Macedonia', 'Azerbaijan', 'Tajikistan', 'Kyrgyzstan', 'Turkmenistan', 'Uzbekistan', 'Kazakhstan', 'Liechtenstein', 'Andorra', 'Monaco', 'San Marino', 'Vatican', 'Malta', 'Cyprus', 'Iceland', 'Greenland', 'Faroe Islands', 'Svalbard', 'Reykjavik', 'Nuuk', 'Torshavn', 'Longyearbyen', 'Helsinki', 'Tallinn', 'Riga', 'Vilnius', 'Minsk', 'Chisinau']
  },
  vehicles: {
    easy: ['car', 'truck', 'bus', 'bicycle', 'motorcycle', 'airplane', 'boat', 'ship', 'train', 'taxi', 'van', 'SUV', 'jeep', 'sedan', 'coupe', 'wagon', 'minivan', 'pickup', 'tractor', 'bulldozer', 'crane', 'forklift', 'ambulance', 'police car', 'fire truck', 'scooter', 'moped', 'ATV', 'quad', 'go-kart', 'golf cart', 'rickshaw', 'tuk-tuk', 'tricycle', 'unicycle', 'segway', 'hoverboard', 'skateboard', 'roller skates', 'inline skates'],
    medium: ['helicopter', 'subway', 'tram', 'trolley', 'monorail', 'metro', 'bullet train', 'maglev', 'freight train', 'steam locomotive', 'diesel locomotive', 'electric train', 'cable car', 'funicular', 'gondola', 'chairlift', 'ski lift', 'escalator', 'moving walkway', 'rocket', 'spaceship', 'space shuttle', 'lunar module', 'rover', 'satellite', 'space station', 'jet', 'fighter jet', 'bomber', 'cargo plane', 'jumbo jet', 'private jet', 'propeller plane', 'ultralight', 'hang glider', 'paraglider', 'parachute', 'hot air balloon', 'airship', 'blimp', 'zeppelin', 'dirigible', 'yacht', 'cruise ship', 'ocean liner', 'cargo ship', 'container ship', 'tanker', 'freighter', 'ferry', 'hovercraft', 'jetski', 'speedboat', 'motorboat', 'pontoon boat', 'sailboat', 'catamaran', 'trimaran', 'schooner', 'sloop', 'ketch', 'yawl', 'dinghy', 'rowboat', 'canoe', 'kayak', 'raft', 'inflatable boat', 'submarine', 'U-boat', 'destroyer', 'cruiser', 'battleship', 'aircraft carrier', 'frigate', 'corvette', 'patrol boat'],
    hard: ['hydroplane', 'biplane', 'triplane', 'seaplane', 'floatplane', 'amphibious plane', 'glider', 'sailplane', 'gyrocopter', 'autogyro', 'tiltrotor', 'VTOL', 'hovercraft', 'hydrofoil', 'ekranoplan', 'ground effect vehicle', 'maglev train', 'hyperloop', 'pod racer', 'land speeder', 'snow speeder', 'swamp speeder', 'cloud car', 'airspeeder', 'landspeeder', 'speeder bike', 'podracer', 'starfighter', 'X-wing', 'TIE fighter']
  },
  colors_emotions: {
    easy: ['red', 'blue', 'green', 'yellow', 'happy', 'sad', 'angry', 'excited', 'brown', 'tan', 'beige', 'gold', 'silver', 'bronze', 'copper', 'grey', 'white', 'black', 'calm', 'tired', 'bored', 'shy', 'brave', 'scared', 'worried', 'relaxed', 'sleepy', 'hungry', 'thirsty', 'sick', 'hurt', 'lonely', 'friendly', 'kind', 'mean', 'nice', 'rude', 'polite', 'grateful'],
    medium: ['purple', 'orange', 'pink', 'nervous', 'confused', 'lazy', 'silly', 'crazy', 'cute', 'cool', 'awesome', 'amazing', 'wonderful', 'proud', 'jealous', 'violet', 'lavender', 'lilac', 'mauve', 'plum', 'maroon', 'burgundy', 'scarlet', 'ruby', 'cherry', 'rose', 'salmon', 'coral', 'peach', 'apricot', 'tangerine', 'amber', 'mustard', 'lemon', 'lime', 'mint', 'sage', 'olive', 'emerald', 'jade', 'teal', 'cyan', 'aqua', 'sky', 'navy', 'royal', 'cobalt', 'sapphire', 'periwinkle', 'anxious', 'frustrated', 'disappointed', 'embarrassed', 'ashamed', 'guilty', 'regretful', 'hopeful', 'optimistic', 'pessimistic', 'confident', 'insecure', 'comfortable', 'uncomfortable', 'peaceful', 'stressed', 'overwhelmed', 'relieved', 'satisfied', 'content', 'grateful', 'thankful', 'appreciative', 'loving', 'caring', 'compassionate', 'sympathetic', 'empathetic', 'indifferent', 'apathetic'],
    hard: ['turquoise', 'magenta', 'indigo', 'azure', 'crimson', 'melancholy', 'nostalgic', 'euphoric', 'serene', 'anguished', 'chartreuse', 'vermillion', 'ochre', 'sienna', 'umber', 'sepia', 'taupe', 'ecru', 'ivory', 'pearl', 'alabaster', 'ebony', 'jet', 'onyx', 'obsidian', 'charcoal', 'slate', 'pewter', 'despondent', 'forlorn', 'wistful', 'pensive', 'contemplative', 'introspective', 'reflective', 'meditative', 'tranquil', 'placid']
  },
  holidays: {
    easy: ['Christmas', 'Halloween', 'Easter', 'Thanksgiving', 'Birthday', 'New Year', 'Party', 'Picnic', 'Barbecue', 'Festival', 'Fair', 'Parade', 'Concert', 'Show', 'Game', 'Match', 'Race', 'Marathon', 'Tournament', 'Championship', 'Graduation', 'Prom', 'Homecoming', 'Reunion', 'Retirement', 'Baby shower', 'Bridal shower', 'Baptism', 'Christening', 'Confirmation', 'Bar mitzvah', 'Bat mitzvah', 'Quinceanera', 'Sweet sixteen', 'Coming of age', 'Memorial', 'Funeral', 'Wake', 'Celebration', 'Ceremony'],
    medium: ['Valentine\'s Day', 'Wedding', 'Anniversary', 'Independence Day', 'St. Patrick\'s Day', 'Carnival', 'Diwali', 'Hanukkah', 'Ramadan', 'Eid', 'Kwanzaa', 'Mother\'s Day', 'Father\'s Day', 'Labor Day', 'Memorial Day', 'Veterans Day', 'Presidents Day', 'Martin Luther King Day', 'Columbus Day', 'Cinco de Mayo', 'Mardi Gras', 'Chinese New Year', 'Lunar New Year', 'Spring Festival', 'Lantern Festival', 'Dragon Boat Festival', 'Mid-Autumn Festival', 'Moon Festival', 'Cherry Blossom Festival', 'Songkran', 'Holi', 'Navratri', 'Durga Puja', 'Ganesh Chaturthi', 'Janmashtami', 'Raksha Bandhan', 'Karva Chauth', 'Baisakhi', 'Pongal', 'Onam', 'Vishu', 'Ugadi', 'Gudi Padwa', 'Makar Sankranti', 'Lohri', 'Basant Panchami', 'Mahashivratri', 'Ram Navami', 'Hanuman Jayanti', 'Buddha Purnima', 'Guru Nanak Jayanti', 'Passover', 'Rosh Hashanah', 'Yom Kippur', 'Sukkot', 'Simchat Torah', 'Purim', 'Shavuot', 'Tisha B\'Av', 'Tu B\'Shevat', 'Lag B\'Omer', 'All Saints Day', 'All Souls Day', 'Ash Wednesday', 'Good Friday', 'Palm Sunday', 'Ascension', 'Corpus Christi', 'Assumption', 'Immaculate Conception'],
    hard: ['Oktoberfest', 'Beltane', 'Samhain', 'Lughnasadh', 'Imbolc', 'Pentecost', 'Epiphany', 'Candlemas', 'Lammas', 'Michaelmas', 'Ostara', 'Litha', 'Mabon', 'Yule', 'Solstice', 'Equinox', 'Saturnalia', 'Lupercalia', 'Floralia', 'Vestalia', 'Lemuria', 'Parentalia', 'Feralia', 'Caristia', 'Terminalia', 'Regifugium', 'Quinquatria', 'Tubilustrium', 'Parilia', 'Vinalia']
  },
  fruits_vegetables: {
    easy: ['apple', 'banana', 'orange', 'grape', 'strawberry', 'watermelon', 'carrot', 'broccoli', 'pear', 'plum', 'peach', 'cherry', 'melon', 'berry', 'lemon', 'lime', 'grapefruit', 'tangerine', 'clementine', 'mandarin', 'potato', 'tomato', 'lettuce', 'cabbage', 'peas', 'beans', 'corn', 'squash', 'pumpkin', 'zucchini', 'cucumber', 'pickle', 'radish', 'turnip', 'beet', 'onion', 'garlic', 'leek', 'shallot', 'scallion'],
    medium: ['mango', 'pineapple', 'kiwi', 'blueberry', 'raspberry', 'blackberry', 'cranberry', 'gooseberry', 'mulberry', 'elderberry', 'boysenberry', 'loganberry', 'huckleberry', 'currant', 'fig', 'date', 'prune', 'raisin', 'apricot', 'nectarine', 'papaya', 'guava', 'passion fruit', 'lychee', 'longan', 'coconut', 'avocado', 'pomegranate', 'persimmon', 'quince', 'medlar', 'loquat', 'jujube', 'tamarind', 'star fruit', 'breadfruit', 'plantain', 'spinach', 'kale', 'chard', 'collards', 'arugula', 'endive', 'radicchio', 'watercress', 'bok choy', 'celery', 'bell pepper', 'chili pepper', 'jalapeno', 'habanero', 'cayenne', 'poblano', 'serrano', 'eggplant', 'okra', 'artichoke', 'asparagus', 'cauliflower', 'brussels sprouts', 'kohlrabi', 'fennel', 'celeriac', 'parsnip', 'rutabaga', 'jicama', 'yam', 'sweet potato', 'cassava', 'taro', 'yucca', 'ginger', 'turmeric', 'horseradish', 'wasabi', 'daikon', 'bamboo shoots', 'water chestnuts', 'lotus root', 'mushroom'],
    hard: ['jackfruit', 'dragon fruit', 'rambutan', 'durian', 'cherimoya', 'kumquat', 'mangosteen', 'salak', 'ackee', 'soursop', 'custard apple', 'sugar apple', 'sweetsop', 'pawpaw', 'feijoa', 'kiwano', 'pepino', 'naranjilla', 'mamey sapote', 'sapodilla', 'canistel', 'lucuma', 'jabuticaba', 'camu camu', 'acai', 'acerola', 'cupuacu', 'guarana', 'pitaya', 'pitanga']
  },
  dashain: {
    easy: ['Tika', 'Jamara', 'Raxi', 'Dahi', 'Chiura', 'Aluwa', 'Sel Roti', 'Khasi', 'Chaku', 'Godi', 'Phool', 'Mala', 'Puja', 'Durga', 'Kali', 'Vishnu', 'Lakshmi', 'Saraswati', 'Bhagwati', 'Sukunda', 'Batti', 'Dhunga', 'Aarati', 'Prasad', 'Sagan', 'Ashirbad', 'Bardan', 'Kotha', 'Toran', 'Makai', 'Sagun', 'Nariwal', 'Supari', 'Paan', 'Sindoor', 'Abir', 'Badam', 'Kismis', 'Amala', 'Kaagati'],
    medium: ['Fulpati', 'Kalratri', 'Mahagauri', 'Siddhidatri', 'Vijaya Dashami', 'Ghatasthapana', 'Navami', 'Ashtami', 'Dashami', 'Phulpati', 'Maha Ashtami', 'Maha Navami', 'Taleju', 'Kumari', 'Rani Pokhari', 'Kot Square', 'Hanuman Dhoka', 'Durbar Square', 'Chamunda', 'Tripurasundari', 'Bhadrakali', 'Masan Kali', 'Pachabali', 'Mahakal', 'Bhairab', 'Bageshwori', 'Naya Bazaar', 'Gorkha Durbar', 'Ramailo', 'Jatra', 'Kirtana', 'Bhajana', 'Mangala Patha', 'Sundari Chowk', 'Nasal Chowk', 'Basantapur', 'Kasthamandap', 'Mahadev', 'Ganesh', 'Kartik', 'Parbat', 'Mansarovar', 'Kailash', 'Melamchi'],
    hard: ['Ghatasthapana Tithi', 'Phulpati Julus', 'Malshree Dhune', 'Khadga Jatra', 'Swet Bhairab', 'Akash Bhairab', 'Barahi Mandir', 'Manakamana', 'Ghalegaun', 'Dolakha Bhimsen', 'Bhadrakali Thaan', 'Pachali Bhairab', 'Balkumari', 'Kalikasthan', 'Dattatreya', 'Nyatapola', 'Bhupatindra', 'Patan Darbar', 'Mahaboudha', 'Changu Narayan']
  },
  tihar: {
    easy: ['Diya', 'Batti', 'Lakshmi', 'Saraswati', 'Ganesh', 'Kukkur', 'Kaag', 'Gai', 'Baigini', 'Kukur Puja', 'Gai Puja', 'Kaag Puja', 'Govardhan', 'Mha Puja', 'Bhai Tika', 'Deusi', 'Bhailo', 'Rangioli', 'Mandala', 'Phool', 'Mala', 'Tel', 'Baati', 'Sweets', 'Mithai', 'Laddoo', 'Barfi', 'Peda', 'Sel Roti', 'Chatamari', 'Yomari', 'Sukuti', 'Thakali', 'Khaja', 'Nakul', 'Paisa', 'Dakshina', 'Upahar', 'Tyohar', 'Ujyalo'],
    medium: ['Tihar Geet', 'Newari Bhailo', 'Deusi Bhailo Gaan', 'Panchak', 'Yamapanchak', 'Kag Tihar', 'Kukur Tihar', 'Gai Tihar', 'Goru Tihar', 'Govardhan Puja', 'Mha Puja Nakha', 'Bhai Tika Dine', 'Bhai Dooj', 'Yamadwitiya', 'Kartik Shukla', 'Lakshmi Chowk', 'Dhana Devi', 'Aishwarya Devi', 'Vibhuti Devi', 'Dhan Lakshmi', 'Dhanya Lakshmi', 'Gaja Lakshmi', 'Santana Lakshmi', 'Veera Lakshmi', 'Vijaya Lakshmi', 'Vidya Lakshmi', 'Adi Lakshmi', 'Moolasthan', 'Ghat Puja', 'Kalasha', 'Jal', 'Narikela', 'Akshata', 'Durva', 'Parijata', 'Marigold', 'Sayapatri', 'Makhamali', 'Laligurans', 'Bakhra'],
    hard: ['Yamapanchak Parva', 'Newari Mha Puja', 'Nepal Sambat', 'Shakya Dynasty', 'Licchavi Period', 'Bhaktapur Durbar', 'Chandraswori', 'Karunamaya', 'Swayambhunath', 'Bouddhanath', 'Ashtalakshmi', 'Mahalakshmi', 'Kubera', 'Kuber Devata', 'Dhana Kuber', 'Alakapuri', 'Tantric Rituals', 'Vajracharya', 'Shakya Priest', 'Newari Jyapu', 'Tansen Darbar', 'Gorkha Nath', 'Manakamana Devi', 'Bhadrakali Devi', 'Taleju Bhawani']
  },
  holi: {
    easy: ['Rang', 'Pichkari', 'Gulal', 'Abir', 'Laal', 'Peela', 'Hara', 'Neela', 'Gulabi', 'Bhang', 'Thandai', 'Gujiya', 'Mathura', 'Vrindavan', 'Krishna', 'Radha', 'Prem', 'Pyar', 'Khusi', 'Ramailo', 'Dhol', 'Nagara', 'Madal', 'Baja', 'Naach', 'Gaan', 'Holi Geet', 'Phool', 'Rang Khel', 'Holika', 'Prahlad', 'Agni', 'Aag', 'Jalaaunu', 'Holika Dahan', 'Chowk', 'Galli', 'Sarak', 'Pani'],
    medium: ['Holi Dahan', 'Phagu Purnima', 'Falgun Maas', 'Rang Panchami', 'Basant Ritu', 'Barsana', 'Nandgaon', 'Lathmar Holi', 'Dhulandi', 'Dhuleti', 'Dol Purnima', 'Dol Jatra', 'Chaiti', 'Chaita Maas', 'Hiranyakashipu', 'Vishnu Avatar', 'Narasimha', 'Bhakt Prahlad', 'Holika Aarti', 'Holashtak', 'Vasant Utsav', 'Madana Mahotsava', 'Kama Dahana', 'Shiva', 'Parvati', 'Ganga', 'Yamuna', 'Saraswati', 'Godavari', 'Koshi', 'Gandaki', 'Karnali', 'Mechi', 'Kanchan', 'Terai Region', 'Madhesh Pradesh', 'Janakpur', 'Birgunj', 'Rajbiraj', 'Nepalgunj'],
    hard: ['Rangapanchami Tithi', 'Chaitra Purnima', 'Kamadahana Parva', 'Vasanta Mahotsava', 'Madana Bhashma', 'Phagu Yatra', 'Newari Holi', 'Kama Devata', 'Rati Devi', 'Manmatha', 'Ananga', 'Makara Dwaja', 'Pushpa Bana', 'Vasanta Ritu', 'Kusuma Shara', 'Holi Mandala', 'Rangoli Utsav', 'Falgun Nakshatra', 'Purnamasi Tithi', 'Holika Tantra']
  },
  losar: {
    easy: ['Losar', 'Nayo Barsha', 'Phewa', 'Guthak', 'Khe Tshe', 'Lama', 'Gompa', 'Mandir', 'Puja', 'Prarthana', 'Buddha', 'Dharma', 'Sangha', 'Jhanda', 'Prayer Flag', 'Lhakhang', 'Sherpa', 'Tamang', 'Gurung', 'Tibetan', 'Yak', 'Dzo', 'Changra', 'Butter Tea', 'Tsampa', 'Momos', 'Thukpa', 'Tingmo', 'Barley', 'Wheat', 'Millet', 'Buckwheat', 'Kathmandu', 'Pokhara', 'Mustang', 'Manang', 'Dolpo', 'Humla', 'Solukhumbu', 'Everest'],
    medium: ['Gyalpo Losar', 'Tamu Losar', 'Sonam Losar', 'Buddhist Calendar', 'Tibetan Calendar', 'Lunar New Year', 'Snowfall', 'Mountain Festival', 'Sherpa Culture', 'Tamang Culture', 'Gurung Culture', 'Himalayan Region', 'Sagarmatha Zone', 'Annapurna Range', 'Langtang Valley', 'Helambu', 'Solu', 'Khumbu', 'Namche Bazaar', 'Tengboche', 'Monastery Ritual', 'Cham Dance', 'Lama Dance', 'Butter Lamp', 'Prayer Wheel', 'Mani Stone', 'Om Mani Padme Hum', 'Bodhi Tree', 'Stupas', 'Swayambhu', 'Boudha Stupa', 'Dalai Lama', 'Panchen Lama', 'Rinpoche', 'Tulku', 'Khenpo', 'Geshe', 'Khada Scarf', 'Tashi Delek', 'Namaste'],
    hard: ['Gyalpo Losar Rituals', 'Sonam Lhosar Tradition', 'Tamu Lhosar Ceremony', 'Bon Religion', 'Vajrayana Buddhism', 'Nyingma Tradition', 'Kagyu Lineage', 'Gelug School', 'Sakya Order', 'Padmasambhava', 'Guru Rinpoche', 'Avalokiteshvara', 'Manjushri', 'Tara Devi', 'Green Tara', 'White Tara', 'Chenrezig', 'Mahakala', 'Dorje', 'Vajra', 'Ghanta', 'Mandala Offering', 'Torma', 'Tsok Offering', 'Khata Ceremony', 'Tsampa Ritual', 'Lungta Flags', 'Darchok', 'Sherpa Yul Lha', 'Tamang Pla']
  },
  chhath: {
    easy: ['Chhath', 'Surya', 'Suraj', 'Arghya', 'Ghat', 'Nadi', 'Pokhari', 'Talau', 'Jal', 'Pani', 'Thekua', 'Thakuwa', 'Puri', 'Kheer', 'Rabri', 'Kasar', 'Ganna', 'Kelaa', 'Santara', 'Narikela', 'Aankha', 'Mewa', 'Badam', 'Kismis', 'Shakarkand', 'Taroi', 'Kaddu', 'Singhara', 'Lahsun', 'Haldi', 'Chandan', 'Roli', 'Akshat', 'Diya', 'Batti', 'Soop', 'Daura', 'Chutiya', 'Vrat', 'Upwaas'],
    medium: ['Chhath Maiya', 'Chhathi Maiya', 'Surya Devta', 'Surya Bhagwan', 'Arghya Dena', 'Sandhya Arghya', 'Usha Arghya', 'Nahay Khay', 'Kharna', 'Sandhya Ghat', 'Prabhat Ghat', 'Maithili Culture', 'Bhojpuri Culture', 'Terai Tradition', 'Madhesh Culture', 'Janakpur Tradition', 'Bihar Custom', 'Eastern UP', 'Ganga River', 'Koshi River', 'Gandaki River', 'Bagmati River', 'Kamala River', 'Kankai River', 'Mechi River', 'Rapti River', 'Tinau River', 'Narayani River', 'Saptakoshi', 'Sapta Gandaki', 'Ghat Preparation', 'Banana Leaf', 'Bamboo Basket', 'Clay Lamp', 'Earthen Pot', 'Sugarcane Stalk', 'Fresh Fruit', 'Seasonal Vegetable', 'Pure Ghee', 'Jaggery'],
    hard: ['Kartik Shukla Shashthi', 'Chhath Parva Mahatmya', 'Surya Shashti Vrat', 'Dala Chhath', 'Pahili Arghya', 'Dusri Arghya', 'Parna Ceremony', 'Kosi Bharai', 'Durva Grass', 'Gangajal', 'Panchamrit', 'Panchgavya', 'Tulsi Patra', 'Ganga Stotram', 'Surya Namaskara', 'Gayatri Mantra', 'Savitri Stotra', 'Aditya Hridayam', 'Surya Kavach', 'Pratakal Sankalp']
  }
};

// Haptic removed per user request
function triggerHaptic(pattern = 'light') {
  // Disabled
  return;
}

// Theme Management
function setTheme(themeName) {
  gameState.theme = themeName;
  document.body.className = `theme-${themeName}`;
  
  // Remove existing decorations
  const existingDecorations = document.querySelectorAll('.holiday-decoration');
  existingDecorations.forEach(el => el.remove());
  
  // Add theme-specific decorations
  if (themeName === 'christmas') {
    createSnowfall();
  } else if (themeName === 'thanksgiving') {
    createFallingLeaves();
  }
}

function createSnowfall() {
  const snowContainer = document.createElement('div');
  snowContainer.className = 'holiday-decoration';
  // Limit to 15 snowflakes for less distraction
  for (let i = 0; i < 15; i++) {
    const snow = document.createElement('div');
    snow.className = 'snowfall';
    snow.textContent = '❄️';
    snow.style.position = 'absolute';
    snow.style.left = Math.random() * 100 + '%';
    snow.style.animationDelay = Math.random() * 10 + 's';
    snow.style.animationDuration = (Math.random() * 15 + 20) + 's';
    snowContainer.appendChild(snow);
  }
  document.body.appendChild(snowContainer);
}

function createFallingLeaves() {
  const leavesContainer = document.createElement('div');
  leavesContainer.className = 'holiday-decoration';
  // Limit to 12 leaves for less distraction
  for (let i = 0; i < 12; i++) {
    const leaf = document.createElement('div');
    leaf.className = 'falling-leaves';
    leaf.textContent = '🍂';
    leaf.style.position = 'absolute';
    leaf.style.left = Math.random() * 100 + '%';
    leaf.style.animationDelay = Math.random() * 8 + 's';
    leaf.style.animationDuration = (Math.random() * 10 + 15) + 's';
    leavesContainer.appendChild(leaf);
  }
  document.body.appendChild(leavesContainer);
}

function detectHoliday() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  
  // Nepali festivals (approximate Gregorian dates - vary each year)
  if (month === 10 && day >= 1 && day <= 25) return 'dashain'; // Dashain - October
  if (month === 10 && day >= 26 || (month === 11 && day <= 5)) return 'tihar'; // Tihar - Late Oct/Early Nov
  if (month === 3 && day >= 1 && day <= 15) return 'holi'; // Holi - March
  if (month === 2 && day >= 10 && day <= 25) return 'losar'; // Losar - Feb
  if (month === 10 && day >= 20 && day <= 31) return 'chhath'; // Chhath - Late October
  
  return 'default';
}

// Category Display Names (Nepali)
const categoryNames = {
  nepali_ho_ni: '🇳🇵 Nepali ho ni',
  animals: '🐾 Janwar',
  food: '🍕 Khana',
  objects: '📦 Vastu',
  school: '📚 Pathshala',
  sports: '⚽ Khel',
  movies: '🎬 Film',
  music: '🎵 Sangeet',
  nature: '🌲 Prakrati',
  technology: '💻 Pratigyya',
  jobs: '👔 Kaam',
  superheroes: '🦸 Super Nayak',
  mythology: '⚡ Itihas Kahani',
  countries: '🌍 Desh',
  vehicles: '🚗 Gaddi',
  colors_emotions: '🎨 Rang Ra Bhabaana',
  holidays: '🎄 Chutiya Din',
  fruits_vegetables: '🍎 Phal Ra Tarkari',
  dashain: '🪔 Dashain',
  tihar: '🪔 Tihar',
  holi: '🎨 Holi',
  losar: '🎊 Losar',
  chhath: '🌅 Chhath',
  random: '🎲 Ramro Misran'
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  updateKhiladiNames();
  validatePlayerCount(); // Initial validation on load
  const detectedTheme = detectHoliday();
  if (detectedTheme !== 'default') {
    setTheme(detectedTheme);
  }
  
  // Removed haptic feedback per user request
});

// Screen Management
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  document.getElementById(screenId).classList.add('active');
}

// Modal Management
function showModal(modalId) {
  document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

// Setup Functions
function validatePlayerCount() {
  const numKhiladis = parseInt(document.getElementById('num-players').value);
  const errorElement = document.getElementById('player-count-error');
  const startButton = document.querySelector('button[onclick="startGame()"]');
  const playerInput = document.getElementById('num-players');
  
  if (isNaN(numKhiladis) || numKhiladis < 3) {
    // Show error message
    errorElement.textContent = 'Kamti ma 3 khiladi hunu parcha';
    errorElement.style.display = 'block';
    
    // Disable start button
    if (startButton) {
      startButton.disabled = true;
      startButton.style.opacity = '0.5';
      startButton.style.cursor = 'not-allowed';
    }
    
    // Add red border to input
    playerInput.style.borderColor = 'var(--color-error)';
    playerInput.style.color = 'var(--color-error)';
    
    return false;
  } else if (numKhiladis > 20) {
    // Show error for too many players
    errorElement.textContent = 'Maximum 20 Khiladi Matra Allowed Cha';
    errorElement.style.display = 'block';
    
    // Disable start button
    if (startButton) {
      startButton.disabled = true;
      startButton.style.opacity = '0.5';
      startButton.style.cursor = 'not-allowed';
    }
    
    // Add red border to input
    playerInput.style.borderColor = 'var(--color-error)';
    playerInput.style.color = 'var(--color-error)';
    
    return false;
  } else {
    // Valid player count - hide error
    errorElement.style.display = 'none';
    
    // Enable start button
    if (startButton) {
      startButton.disabled = false;
      startButton.style.opacity = '1';
      startButton.style.cursor = 'pointer';
    }
    
    // Reset input styling
    playerInput.style.borderColor = '';
    playerInput.style.color = '';
    
    return true;
  }
}

function updateKhiladiNames() {
  const numKhiladis = parseInt(document.getElementById('num-players').value);
  const container = document.getElementById('player-names-container');
  
  // Validate player count first
  const isValid = validatePlayerCount();
  
  // Clear container
  container.innerHTML = '';
  
  // Only create inputs if valid count
  if (isValid && numKhiladis >= 3 && numKhiladis <= 20) {
    for (let i = 0; i < numKhiladis; i++) {
      const inputDiv = document.createElement('div');
      inputDiv.className = 'player-name-input';
      inputDiv.innerHTML = `
        <span class="player-number">P${i + 1}:</span>
        <input type="text" class="form-control" id="player-${i}" placeholder="Khiladi ${i + 1}" value="Khiladi ${i + 1}">
      `;
      container.appendChild(inputDiv);
    }
  }
}

function selectDifficulty(difficulty) {
  document.querySelectorAll('[data-difficulty]').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-difficulty="${difficulty}"]`).classList.add('active');
  gameState.difficulty = difficulty;
}

function selectMode(mode) {
  document.querySelectorAll('[data-mode]').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
  gameState.mode = mode;
  
  const description = document.getElementById('mode-description');
  if (mode === 'classic') {
    description.textContent = 'Chor lai thaa huncha uu Chor ho bhanera';
  } else if (mode === 'dark') {
    description.textContent = 'Chor lai thaa hudaina uu Chor ho';
  }
  
  triggerHaptic('light');
}

// Start Game
function startGame() {
  triggerHaptic('doubleTap');
  
  // Collect game settings
  gameState.numKhiladis = parseInt(document.getElementById('num-players').value);
  
  // STRICT VALIDATION: Enforce minimum 3 players - DO NOT PROCEED if invalid
  if (isNaN(gameState.numKhiladis) || gameState.numKhiladis < 3) {
    showToast('⚠️ Kamti ma 3 khiladi hunu parcha!');
    triggerHaptic('warning');
    
    // Highlight the error
    const playerInput = document.getElementById('num-players');
    playerInput.style.borderColor = 'var(--color-error)';
    playerInput.style.color = 'var(--color-error)';
    playerInput.focus();
    
    // Ensure error message is visible
    const errorElement = document.getElementById('player-count-error');
    errorElement.textContent = 'Kamti ma 3 khiladi hunu parcha';
    errorElement.style.display = 'block';
    
    // Shake animation for emphasis
    playerInput.classList.add('shake');
    setTimeout(() => playerInput.classList.remove('shake'), 500);
    
    return; // STOP - do not proceed
  }
  
  if (gameState.numKhiladis > 20) {
    showToast('Maximum 20 Khiladi Matra Allowed Cha');
    triggerHaptic('warning');
    return;
  }
  
  gameState.category = document.getElementById('category').value;
  gameState.numImposters = parseInt(document.getElementById('num-imposters').value);
  gameState.hintsEnabled = document.getElementById('hints-enabled').checked;
  gameState.theme = document.getElementById('theme-select').value;
  gameState.hapticEnabled = false;
  
  // Set theme
  setTheme(gameState.theme);
  
  // Collect player names
  gameState.players = [];
  for (let i = 0; i < gameState.numKhiladis; i++) {
    const nameInput = document.getElementById(`player-${i}`);
    if (!nameInput) {
      // Safety check: if inputs weren't created properly
      showToast('Player names missing. Please check player count.');
      return;
    }
    const name = nameInput.value.trim() || `Khiladi ${i + 1}`;
    gameState.players.push(name);
  }
  
  // Final validation: ensure we have enough players collected
  if (gameState.players.length < 3) {
    showToast('⚠️ Kamti ma 3 khiladi hunu parcha!');
    triggerHaptic('warning');
    
    // This should never happen due to earlier validation, but safety check
    showScreen('setup-screen');
    document.getElementById('num-players').focus();
    return;
  }
  
  // Select random word (handle Random Mix category)
  let selectedCategory = gameState.category;
  if (gameState.category === 'random') {
    const categories = Object.keys(wordCategories).filter(c => c !== 'random');
    selectedCategory = categories[Math.floor(Math.random() * categories.length)];
  }
  
  const words = wordCategories[selectedCategory][gameState.difficulty];
  gameState.secretWord = words[Math.floor(Math.random() * words.length)];
  gameState.selectedCategory = selectedCategory;
  
  // Get hints for the word
  const wordLower = gameState.secretWord.toLowerCase();
  gameState.currentHints = wordHints[wordLower] || ['Think carefully', 'Use your imagination', 'Be creative'];
  
  // Select random imposters
  gameState.imposters = [];
  const playerIndices = Array.from({ length: gameState.numKhiladis }, (_, i) => i);
  for (let i = 0; i < gameState.numImposters; i++) {
    const randomIndex = Math.floor(Math.random() * playerIndices.length);
    gameState.imposters.push(playerIndices[randomIndex]);
    playerIndices.splice(randomIndex, 1);
  }
  
  // In the Dark Mode: Assign different words to imposters
  gameState.playerWords = {};
  if (gameState.mode === 'dark') {
    // Assign main word to regular players
    for (let i = 0; i < gameState.numKhiladis; i++) {
      if (!gameState.imposters.includes(i)) {
        gameState.playerWords[i] = gameState.secretWord;
      }
    }
    
    // Assign DIFFERENT words to each imposter
    // Get words from different categories to avoid confusion
    const allCategories = Object.keys(wordCategories).filter(c => c !== 'random' && c !== selectedCategory);
    
    gameState.imposters.forEach((imposterIndex, idx) => {
      // Pick a random different category
      const diffCategory = allCategories[Math.floor(Math.random() * allCategories.length)];
      const diffWords = wordCategories[diffCategory][gameState.difficulty];
      // Pick a random word that's not the main word
      let imposterWord = diffWords[Math.floor(Math.random() * diffWords.length)];
      
      // Make sure it's not the same as the main word or other imposter words
      let attempts = 0;
      while ((imposterWord.toLowerCase() === gameState.secretWord.toLowerCase() || 
              Object.values(gameState.playerWords).some(w => w && w.toLowerCase() === imposterWord.toLowerCase())) && 
             attempts < 20) {
        imposterWord = diffWords[Math.floor(Math.random() * diffWords.length)];
        attempts++;
      }
      
      gameState.playerWords[imposterIndex] = imposterWord;
    });
  } else {
    // Classic mode: all regular players get the main word
    for (let i = 0; i < gameState.numKhiladis; i++) {
      if (!gameState.imposters.includes(i)) {
        gameState.playerWords[i] = gameState.secretWord;
      }
    }
  }
  
  // Reset game state
  gameState.currentRevealIndex = 0;
  gameState.clues = {};
  gameState.votes = {};
  gameState.eliminated = [];
  gameState.eliminationOrder = [];
  
  // Start reveal phase
  showRevealScreen();
}

// Reveal Phase - v9 FEATURE: Reveal button shown for EVERY player
function showRevealScreen() {
  showScreen('reveal-screen');
  displayCurrentKhiladiWord();
}

function displayCurrentKhiladiWord() {
  const playerIndex = gameState.currentRevealIndex;
  const playerName = gameState.players[playerIndex];
  
  document.getElementById('current-player-name').textContent = playerName;
  
  // Show the "before reveal" state
  document.getElementById('before-reveal').style.display = 'flex';
  document.getElementById('after-reveal').style.display = 'none';
  document.getElementById('next-player-btn').style.display = 'none';
  
  triggerHaptic('medium');
}

function revealWord() {
  const playerIndex = gameState.currentRevealIndex;
  const isImposter = gameState.imposters.includes(playerIndex);
  
  const wordDisplay = document.getElementById('word-display');
  const hintDisplay = document.getElementById('hint-display');
  const afterRevealCard = document.getElementById('after-reveal');
  
  // Reset classes
  afterRevealCard.classList.remove('imposter-reveal');
  
  triggerHaptic('medium');
  
  if (gameState.mode === 'dark') {
    // IN THE DARK MODE: Show ONLY the word to all players
    // NO indication of role or whether word matches others
    const playerWord = gameState.playerWords[playerIndex];
    wordDisplay.textContent = playerWord.toUpperCase();
    hintDisplay.textContent = 'Remember this word!';
    
    // All cards look the same - no special styling
    afterRevealCard.classList.remove('imposter-reveal');
  } else {
    // CLASSIC MODE: Original behavior
    if (isImposter) {
      afterRevealCard.classList.add('imposter-reveal');
      triggerHaptic('warning');
      
      wordDisplay.textContent = '🎭 Tai Chor Hos';
      if (gameState.hintsEnabled) {
        const displayCategory = gameState.category === 'random' ? gameState.selectedCategory : gameState.category;
        hintDisplay.textContent = `Category: ${categoryNames[displayCategory]}`;
      } else {
        hintDisplay.textContent = 'Milne Koshish Garlas!';
      }
    } else {
      // Regular players always see the secret word
      wordDisplay.textContent = gameState.secretWord.toUpperCase();
      hintDisplay.textContent = 'Yo Sabdha Yaad Rakha!';
    }
  }
  
  // Hide before reveal, show after reveal
  document.getElementById('before-reveal').style.display = 'none';
  document.getElementById('after-reveal').style.display = 'flex';
  document.getElementById('next-player-btn').style.display = 'block';
  
  // Add animation
  afterRevealCard.classList.add('fade-in');
}

function nextReveal() {
  triggerHaptic('light');
  gameState.currentRevealIndex++;
  
  if (gameState.currentRevealIndex < gameState.numKhiladis) {
    displayCurrentKhiladiWord();
  } else {
    showVotingScreen();
  }
}

// Voting Phase
function showVotingScreen() {
  showScreen('voting-screen');
  triggerHaptic('medium');
  
  // Reset votes
  gameState.votes = {};
  
  // Update vote limit text
  const voteLimitText = document.getElementById('vote-limit-text');
  voteLimitText.textContent = `Timi haru ley ${gameState.numImposters === 1 ? 'Euta' : gameState.numImposters} Khiladi Chaan nu Parcha`;
  
  // Create voting buttons
  const votingButtons = document.getElementById('voting-buttons');
  votingButtons.innerHTML = '';
  
  // Hide eliminated section (no longer used)
  const eliminatedSection = document.getElementById('eliminated-section');
  eliminatedSection.style.display = 'none';
  
  gameState.players.forEach((player, index) => {
    const voteBtn = document.createElement('button');
    voteBtn.className = 'vote-btn';
    voteBtn.textContent = player;
    voteBtn.onclick = () => toggleVote(index, voteBtn);
    votingButtons.appendChild(voteBtn);
  });
}

function toggleVote(playerIndex, btnElement) {
  const selectedCount = Object.keys(gameState.votes).length;
  const maxVotes = gameState.numImposters;
  
  // If already selected, deselect
  if (gameState.votes[playerIndex]) {
    delete gameState.votes[playerIndex];
    btnElement.classList.remove('selected');
    triggerHaptic('light');
    return;
  }
  
  // Check if we've reached the vote limit
  if (selectedCount >= maxVotes) {
    showToast(`Timi haru ley ${maxVotes === 1 ? 'Euta' : maxVotes} Khiladi Chaan nu Parcha!`);
    triggerHaptic('warning');
    return;
  }
  
  // Add vote
  gameState.votes[playerIndex] = true;
  btnElement.classList.add('selected');
  triggerHaptic('medium');
}

// Results Phase
function calculateResults() {
  showScreen('results-screen');
  triggerHaptic('strong');
  
  // Get voted players (selected by checkboxes)
  const votedKhiladis = Object.keys(gameState.votes).map(i => parseInt(i));
  
  // Display results
  const resultsTitle = document.getElementById('results-title');
  const resultsDetails = document.getElementById('results-details');
  
  let regularKhiladisWin = false;
  let resultExplanation = '';
  
  if (gameState.mode === 'dark') {
    // IN THE DARK MODE WIN CONDITIONS
    const impostersCaught = gameState.imposters.filter(imp => votedKhiladis.includes(imp));
    const regularKhiladisCaught = votedKhiladis.filter(p => !gameState.imposters.includes(p));
    
    if (gameState.numImposters === 1) {
      // 1 imposter mode:
      // - If different word player voted out → Regular players WIN
      // - If regular player voted out → Imposter WINS
      if (impostersCaught.length > 0) {
        regularKhiladisWin = true;
        resultExplanation = 'Alag shabd bhayeko khiladi pakdiyecha!';
      } else {
        regularKhiladisWin = false;
        resultExplanation = 'Sidha khiladi vote bataa bahira gayo. Chor ley Jityo';      }
    } else if (gameState.numImposters === 2) {
      // 2 imposters mode:
      // - If BOTH imposters voted out → Regular players WIN
      // - If at least ONE regular player voted out → Imposters WIN
      if (regularKhiladisCaught.length > 0) {
        regularKhiladisWin = false;
        resultExplanation = 'Kam se kam ek sidha khiladi vote bataa bahira gayo. Chor ley Jityo';
      } else if (impostersCaught.length === 2) {
        regularKhiladisWin = true;
        resultExplanation = 'Duvai alag shabd bhayeko khiladi pakdiyecha!';
      } else {
        regularKhiladisWin = false;
        resultExplanation = 'Sabai chor pakdiyena!';
      }
    }
    
    // Display Dark Mode results
    if (regularKhiladisWin) {
      resultsTitle.textContent = '🎉 Sidha Khiladi Jiti Gaye!';
      triggerHaptic('celebration');
    } else {
      resultsTitle.textContent = '🎭 Chor Jiti Gaye!';
    }
    
    // Show who had which word
    let playerWordsList = '<div style="margin-top: 24px; text-align: left;">';
    playerWordsList += '<p style="font-weight: bold; margin-bottom: 12px;">Sabai lai pareko Shabda:</p>';
    for (let i = 0; i < gameState.numKhiladis; i++) {
      const isImposter = gameState.imposters.includes(i);
      const wasVoted = votedKhiladis.includes(i);
      playerWordsList += `<p style="margin: 8px 0;">`;
      playerWordsList += `<strong>${gameState.players[i]}:</strong> ${gameState.playerWords[i].toUpperCase()}`;
      if (isImposter) {
        playerWordsList += ' <span style="color: var(--color-error);">(Alag Shabd)</span>';
      } else {
        playerWordsList += ' <span style="color: var(--color-success);">(Mukhya Shabd)</span>';
      }
      if (wasVoted) {
        playerWordsList += ' <span style="color: var(--color-warning);">← Vote Bataa Baher</span>';
      }
      playerWordsList += '</p>';
    }
    playerWordsList += '</div>';
    
    const votedNames = votedKhiladis.length > 0 
      ? votedKhiladis.map(i => gameState.players[i]).join(', ')
      : 'Koi pani';
    
    resultsDetails.innerHTML = `
      <p>Vote bataa baher khiladi: <strong>${votedNames}</strong></p>
      ${playerWordsList}
      <p style="margin-top: 24px; font-size: var(--font-size-lg); color: ${regularKhiladisWin ? 'var(--color-success)' : 'var(--color-error)'};">${resultExplanation}</p>
    `;
  } else {
    // CLASSIC MODE (original logic)
    const impostersCaught = gameState.imposters.filter(imp => votedKhiladis.includes(imp));
    regularKhiladisWin = impostersCaught.length > 0;
    
    if (regularKhiladisWin) {
      resultsTitle.textContent = '🎉 Sidha Khiladi Jiti Gaye!';
      triggerHaptic('celebration');
    } else {
      resultsTitle.textContent = '🎭 Chor Jiti Gaye!';
    }
    
    const votedNames = votedKhiladis.length > 0 
      ? votedKhiladis.map(i => gameState.players[i]).join(', ')
      : 'Koi pani';
    
    const imposterNames = gameState.imposters.map(i => gameState.players[i]).join(', ');
    
    resultsDetails.innerHTML = `
      <p>Gupta shabd thyo:</p>
      <div class="results-word">${gameState.secretWord.toUpperCase()}</div>
      <p>Chor thye:</p>
      <div class="results-imposters">${imposterNames}</div>
      <p style="margin-top: 24px;">Khiladi haru le vote garyo: <strong>${votedNames}</strong></p>
      ${regularKhiladisWin 
        ? '<p style="margin-top: 16px; color: var(--color-success);">✓ Chor pakdiyecha!</p>' 
        : '<p style="margin-top: 16px; color: var(--color-error);">✗ Chor pakdiyena!</p>'}
    `;
  }
  
  // Add confetti animation if players win
  if (regularKhiladisWin) {
    createConfetti();
  }
}



// Feedback - Web3Forms Integration
async function submitFeedback(event) {
  if (event) {
    event.preventDefault();
  }
  
  const form = document.getElementById('feedback-form');
  const submitBtn = document.getElementById('feedback-submit-btn');
  const statusDiv = document.getElementById('feedback-status');
  const message = document.getElementById('feedback-message').value;
  
  // Validate required message field
  if (!message.trim() || message.trim().length < 10) {
    showFeedbackStatus('Kripaya kam se kam 10 akshar ko sujhav sandesh lekhnu hos.', 'error');
    return;
  }
  
  // Disable submit button and show loading state
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 4px; animation: spin 1s linear infinite;"><circle cx="12" cy="12" r="10"></circle></svg> Pathaudai chha...';
  
  try {
    // Prepare form data
    const formData = new FormData(form);
    
    // Send to Web3Forms API
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      // Success - Show Nepali success message
      showFeedbackStatus('Dhanyavad! Timro Bichar Paristhit Bhayo', 'success');
      triggerHaptic('celebration');
      
      // Clear form fields
      form.reset();
      
      // Close modal after 2 seconds
      setTimeout(() => {
        closeModal('feedback-modal');
        statusDiv.style.display = 'none';
      }, 2000);
    } else {
      // Error from API
      showFeedbackStatus('Ke Gadi! Koi Samasyaa Bhyo. Pheri Koshish Garnus', 'error');
      triggerHaptic('warning');
    }
  } catch (error) {
    // Network or other error
    console.error('Feedback submission error:', error);
    showFeedbackStatus('Ke Gadi! Koi Samasyaa Bhyo. Pheri Koshish Garnus', 'error');
    triggerHaptic('warning');
  } finally {
    // Re-enable submit button
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 4px;"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg> Sujhav Pathaunu Hos';
  }
}

function showFeedbackStatus(message, type) {
  const statusDiv = document.getElementById('feedback-status');
  statusDiv.style.display = 'block';
  statusDiv.textContent = message;
  
  if (type === 'success') {
    statusDiv.style.backgroundColor = 'rgba(var(--color-success-rgb), 0.15)';
    statusDiv.style.color = 'var(--color-success)';
    statusDiv.style.border = '1px solid rgba(var(--color-success-rgb), 0.3)';
  } else if (type === 'error') {
    statusDiv.style.backgroundColor = 'rgba(var(--color-error-rgb), 0.15)';
    statusDiv.style.color = 'var(--color-error)';
    statusDiv.style.border = '1px solid rgba(var(--color-error-rgb), 0.3)';
  }
}

// Initialize feedback form submission listener
document.addEventListener('DOMContentLoaded', () => {
  const feedbackForm = document.getElementById('feedback-form');
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', submitFeedback);
  }
});

// Share Link (removed - no longer needed)

// Share Game Function
function shareGame() {
  const gameUrl = window.location.href;
  
  // Try to use Web Share API if available
  if (navigator.share) {
    navigator.share({
      title: 'Chor Khel - Official Viral TikTok Game',
      text: 'Malai sanga Chor Khel khelo! Timile chor khojna sakchau?',
      url: gameUrl
    }).then(() => {
      showToast('Share gareko lagi dhanyabaad!');
    }).catch(() => {
      // If share fails, copy to clipboard
      copyToClipboard(gameUrl);
    });
  } else {
    // Fallback to clipboard
    copyToClipboard(gameUrl);
  }
}

function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Clipboard maa copy bhayo!');
    }).catch((err) => {
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.width = '2em';
  textArea.style.height = '2em';
  textArea.style.padding = '0';
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';
  textArea.style.background = 'transparent';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    const successful = document.execCommand('copy');
    if (successful) {
      showToast('Clipboard maa copy bhayo!');
    } else {
      showToast('Copy bhayena - kripaya manually copy garnu');
    }
  } catch (err) {
    showToast('Copy bhayena - kripaya manually copy garnu');
  }
  
  document.body.removeChild(textArea);
}

// Toast Notification
function showToast(message) {
  // Remove existing toast if any
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }
  
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Confetti Animation
function createConfetti() {
  const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B'];
  const confettiCount = 50;
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDelay = Math.random() * 3 + 's';
    confetti.style.animationDuration = Math.random() * 3 + 2 + 's';
    confetti.style.animation = 'confetti-fall ' + (Math.random() * 3 + 2) + 's linear forwards';
    document.body.appendChild(confetti);
    
    setTimeout(() => confetti.remove(), 5000);
  }
}

// Close modals when clicking outside
window.onclick = function(event) {
  if (event.target.classList.contains('modal')) {
    event.target.classList.remove('active');
  }
}