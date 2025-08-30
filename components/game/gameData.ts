import { GameImage } from "../GuessThePromptGame";

// AI-generated images with their actual prompts
// These are realistic prompts that would be used to generate AI art
export const gameImages: GameImage[] = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop",
    correctPrompt: "portrait of a majestic lion, digital art, dramatic lighting, fantasy concept art, artstation trending",
    difficulty: "easy",
    category: "animals"
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
    correctPrompt: "astronaut floating in deep space, earth background, photorealistic, cinematic lighting, 4k resolution",
    difficulty: "medium",
    category: "space"
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop",
    correctPrompt: "steampunk robot musician playing violin, victorian garden setting, brass and copper materials, intricate details",
    difficulty: "hard",
    category: "fantasy"
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop",
    correctPrompt: "enchanted forest at twilight, bioluminescent mushrooms, fireflies, magical atmosphere, digital painting",
    difficulty: "medium",
    category: "nature"
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
    correctPrompt: "cyberpunk city skyline, neon lights, flying cars, rain effects, blade runner aesthetic, futuristic architecture",
    difficulty: "hard",
    category: "futuristic"
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1520637836862-4d197d17c86a?w=600&h=400&fit=crop",
    correctPrompt: "crystal dragon breathing rainbow fire, cave environment, prismatic light effects, fantasy art style",
    difficulty: "hard",
    category: "fantasy"
  },
  {
    id: 7,
    url: "https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=600&h=400&fit=crop",
    correctPrompt: "cute robot chef making pancakes, futuristic kitchen, warm lighting, pixar animation style, 3d render",
    difficulty: "easy",
    category: "robots"
  },
  {
    id: 8,
    url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop",
    correctPrompt: "vintage pocket watch floating in cosmic nebula, surreal art, time distortion effects, dreamlike composition",
    difficulty: "hard",
    category: "abstract"
  },
  {
    id: 9,
    url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&h=400&fit=crop",
    correctPrompt: "whale swimming through clouds above mountains, surreal landscape, soft pastel colors, dreamy atmosphere",
    difficulty: "medium",
    category: "surreal"
  },
  {
    id: 10,
    url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop",
    correctPrompt: "vintage car driving on piano key road, musical surrealism, black and white photography, artistic composition",
    difficulty: "medium",
    category: "surreal"
  },
  {
    id: 11,
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
    correctPrompt: "portrait of cyborg woman, half human half machine, led lights, chrome details, sci-fi concept art",
    difficulty: "hard",
    category: "futuristic"
  },
  {
    id: 12,
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop",
    correctPrompt: "medieval castle on floating island, cloudy sky, fantasy landscape, matte painting style, epic scale",
    difficulty: "medium",
    category: "fantasy"
  }
];

// Difficulty-based scoring multipliers
export const difficultyMultipliers = {
  easy: 1,
  medium: 1.5,
  hard: 2
};

// Categories for filtering
export const categories = [
  "animals",
  "space", 
  "fantasy",
  "nature",
  "futuristic",
  "robots",
  "abstract",
  "surreal"
];
