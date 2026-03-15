// === DEFAULT SCENE ===

export const DEFAULT_SCENE = 'storm';

// === SCENE ORDER ===

export const SCENE_ORDER = ['storm', 'sakura', 'bamboo', 'ember', 'frost'];

// === HAGANE ===

export const HAGANE_TEXT = 'HAGANE';
export const HAGANE_KANJI = '鋼';

// === SCENES (simplified structure) ===

export const SCENES = {
    storm: {
    name: 'storm',
    element: '/img/elements/storm.svg',

    identity: {
      kanji: '雷',
      title: '雷鳴',
      romaji: 'Raimei',
      subtitle: 'Thunder Roar',
      description:
        'Born from a bolt that split the heavens, this blade crackles with dormant lightning. Each swing calls forth the rumble of distant thunder, a warning to all who stand opposed.',
    },

    colors: {
      primary: '#6b7db3',
      secondary: '#b8c4e0',
      tertiary: '#3a4a7a',
    },
  },
  
  sakura: {
    name: 'sakura',
    element: '/img/elements/sakura.svg',

    identity: {
      kanji: '桜',
      title: '桜刃',
      romaji: 'Sakura-Jin',
      subtitle: 'Cherry Blossom Blade',
      description:
        "Forged under the falling petals of ancient cherry trees, this blade carries the fleeting beauty of spring. Its edge whispers of renewal and the warrior's acceptance of impermanence.",
    },

    colors: {
      primary: '#c45c5c',
      secondary: '#e8c4b8',
      tertiary: '#8b3a3a',
    },
  },

  bamboo: {
    name: 'bamboo',
    element: '/img/elements/bamboo.svg',

    identity: {
      kanji: '竹',
      title: '竹風',
      romaji: 'Chikufū',
      subtitle: 'Bamboo Wind',
      description:
        'Cut from the heart of an enchanted bamboo grove, this blade bends but never breaks. It channels the patience of the forest and strikes with the force of a storm through the canopy.',
    },

    colors: {
      primary: '#7a9e7e',
      secondary: '#b8d4ba',
      tertiary: '#4a6b4e',
    },
  },

  ember: {
    name: 'ember',
    element: '/img/elements/fire.svg',

    identity: {
      kanji: '焔',
      title: '焔心',
      romaji: 'Enshin',
      subtitle: 'Ember Heart',
      description:
        'Tempered in volcanic fire, this blade holds the soul of a dying flame. Warm to the touch, it glows faintly in the dark, a companion for those who walk through ash and shadow.',
    },

    colors: {
      primary: '#c4875c',
      secondary: '#e0c4a8',
      tertiary: '#8b5a3a',
    },
  },

  frost: {
    name: 'frost',
    element: '/img/elements/snow.svg',

    identity: {
      kanji: '霜',
      title: '霜月',
      romaji: 'Shimotsuki',
      subtitle: 'Frost Moon',
      description:
        'Quenched in a frozen lake under the coldest moon, this blade radiates an unnatural chill. It cuts through heat and rage alike, leaving nothing but silence in its wake.',
    },

    colors: {
      primary: '#8ba8c4',
      secondary: '#c4d8e8',
      tertiary: '#4a6a8b',
    },
  },
};
// === DEFAULT SWORD COLORS ===

export const DEFAULT_SWORD_COLORS = {
  blade: '#c0c0c0', // Silver steel
  guard: '#8b7355', // Bronze iron
  handle: '#4a3728', // Dark leather wrap
  pommel: '#b08d57', // Aged bronze
  scabbard: '#2c1810', // Dark lacquer
};

// === SWORD PARTS ===

export const SWORD_PARTS = {
  blade: {
    label: 'Blade',
    labelFr: 'Lame',
    jp: 'Ha',
    kanji: '刃',
  },
  guard: {
    label: 'Guard',
    labelFr: 'Garde',
    jp: 'Tsuba',
    kanji: '鍔',
  },
  handle: {
    label: 'Handle',
    labelFr: 'Poignée',
    jp: 'Tsuka',
    kanji: '柄',
  },
  pommel: {
    label: 'Pommel',
    labelFr: 'Pommeau',
    jp: 'Kashira',
    kanji: '柄頭',
  },
  scabbard: {
    label: 'Scabbard',
    labelFr: 'Fourreau',
    jp: 'Saya',
    kanji: '鞘',
  },
};
