import { GameImage } from "../GuessThePromptGame";

// 5 preset images for the game (using local images from public directory)
// Users will try to guess prompts for these specific images
export const gameImages: GameImage[] = [
  {
    id: 1,
    url: "/dance.jpg",
    correctPrompt: "People dancing energetically in a vibrant party or club setting",
    difficulty: "easy",
    category: "lifestyle"
  },
  {
    id: 2,
    url: "/detective.jpg", 
    correctPrompt: "A detective or investigator in a noir-style scene with dramatic lighting",
    difficulty: "medium",
    category: "portrait"
  },
  {
    id: 3,
    url: "/gorilla.jpg",
    correctPrompt: "A powerful gorilla in its natural habitat or zoo environment",
    difficulty: "medium", 
    category: "animals"
  },
  {
    id: 4,
    url: "/jeep.jpg",
    correctPrompt: "A rugged off-road vehicle or jeep in an outdoor adventure setting",
    difficulty: "hard",
    category: "vehicles"
  },
  {
    id: 5,
    url: "/jungleRave.jpg",
    correctPrompt: "An energetic rave or electronic music festival in a jungle or tropical setting",
    difficulty: "hard",
    category: "events"
  },
];

// Categories for the 5 preset images
export const categories = [
  "lifestyle",
  "portrait",
  "animals", 
  "vehicles",
  "events"
];

// API configuration with fallback
export const API_CONFIG = {
  // Try local first, fallback to deployed
  BASE_URL:"https://new-image-woxm.onrender.com",
  EVALUATE_ENDPOINT: "/evaluate",
  HEALTH_ENDPOINT: "/health"
};
