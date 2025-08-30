import { GameImage } from "../GuessThePromptGame";

// Sample AI-generated images with their prompts
// In a real application, you would fetch these from an API or database
export const gameImages: GameImage[] = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop",
    correctPrompt: "A majestic lion with a colorful mane sitting in a magical forest",
    difficulty: "easy",
    category: "animals"
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
    correctPrompt: "An astronaut floating in space with Earth in the background",
    difficulty: "easy",
    category: "space"
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop",
    correctPrompt: "A steampunk robot playing violin in a Victorian garden",
    difficulty: "medium",
    category: "fantasy"
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop",
    correctPrompt: "A mystical forest with glowing mushrooms and fireflies at twilight",
    difficulty: "medium",
    category: "nature"
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
    correctPrompt: "A cyberpunk cityscape with neon lights and flying cars",
    difficulty: "hard",
    category: "futuristic"
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1520637836862-4d197d17c86a?w=600&h=400&fit=crop",
    correctPrompt: "A dragon made of crystal breathing rainbow fire in a cave",
    difficulty: "hard",
    category: "fantasy"
  },
  {
    id: 7,
    url: "https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=600&h=400&fit=crop",
    correctPrompt: "A cute robot chef making pancakes in a futuristic kitchen",
    difficulty: "easy",
    category: "robots"
  },
  {
    id: 8,
    url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop",
    correctPrompt: "A time traveler's pocket watch floating in a cosmic nebula",
    difficulty: "hard",
    category: "abstract"
  },
  {
    id: 9,
    url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&h=400&fit=crop",
    correctPrompt: "A whale swimming through clouds above a mountain landscape",
    difficulty: "medium",
    category: "surreal"
  },
  {
    id: 10,
    url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop",
    correctPrompt: "A vintage car driving on a road made of piano keys",
    difficulty: "medium",
    category: "surreal"
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
