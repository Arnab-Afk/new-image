import { API_CONFIG } from '@/components/game/gameData';

export interface ScoreResponse {
  prompt: string;
  score: string;
  imageId: number;
  success: boolean;
  error?: string;
}

export interface PendingEvaluation {
  imageId: number;
  prompt: string;
  promise: Promise<ScoreResponse>;
}

// Test API connectivity
export async function testApiConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.HEALTH_ENDPOINT}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('API Health Check:', data);
      return true;
    }
    return false;
  } catch (error) {
    console.error('API connection test failed:', error);
    return false;
  }
}

// Convert image URL to blob for API submission
async function urlToBlob(url: string): Promise<Blob> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    return await response.blob();
  } catch (error) {
    console.error('Error converting URL to blob:', error);
    throw error;
  }
}

// Evaluate a single image with the provided prompt
export async function evaluateImagePrompt(
  prompt: string, 
  imageUrl: string, 
  imageId: number
): Promise<ScoreResponse> {
  console.log(`🔄 Starting evaluation for image ${imageId}...`);
  
  try {
    // Convert image URL to blob
    const imageBlob = await urlToBlob(imageUrl);
    
    // Create form data
    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('image', imageBlob, `image_${imageId}.jpg`);

    // Make API call with timeout and better error handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log(`⏰ Timeout reached for image ${imageId} evaluation`);
      controller.abort();
    }, 45000); // 45 second timeout

    try {
      console.log(`📡 Making API request for image ${imageId}...`);
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.EVALUATE_ENDPOINT}`, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Validate response structure
      if (!data || typeof data.score === 'undefined') {
        throw new Error('Invalid response format from API');
      }
      
      console.log(`✅ Image ${imageId} evaluation completed with score: ${data.score}`);
      return {
        prompt: data.prompt || prompt,
        score: String(data.score),
        imageId,
        success: true,
      };
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    console.error(`❌ Error evaluating image ${imageId}:`, error);
    
    // Provide more specific error messages but ALWAYS return a response
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorMessage = 'Request timeout';
      } else if (error.message.includes('fetch')) {
        errorMessage = 'Network connection failed';
      } else {
        errorMessage = error.message;
      }
    }
    
    // CRITICAL: Always return a valid ScoreResponse, never throw
    const errorResponse = {
      prompt,
      score: '0',
      imageId,
      success: false,
      error: errorMessage,
    };
    
    console.log(`🔧 Returning error response for image ${imageId}:`, errorResponse);
    return errorResponse;
  }
}

// Start evaluation for a single image-prompt pair (non-blocking)
export function startImageEvaluation(
  prompt: string,
  imageUrl: string,
  imageId: number
): PendingEvaluation {
  console.log(`Starting evaluation for image ${imageId} with prompt: "${prompt}"`);
  
  const promise = evaluateImagePrompt(prompt, imageUrl, imageId);
  
  return {
    imageId,
    prompt,
    promise
  };
}

// Wait for all pending evaluations to complete
export async function waitForAllEvaluations(
  pendingEvaluations: PendingEvaluation[]
): Promise<ScoreResponse[]> {
  console.log(`🚀 Starting to wait for ${pendingEvaluations.length} evaluations to complete...`);
  
  if (pendingEvaluations.length === 0) {
    console.log('⚠️ No pending evaluations found');
    return [];
  }

  try {
    // Use Promise.allSettled to wait for ALL promises, regardless of success/failure
    console.log('⏳ Waiting for all evaluations (including any that may fail)...');
    const results = await Promise.allSettled(
      pendingEvaluations.map(evaluation => evaluation.promise)
    );
    
    console.log(`✅ All ${results.length} evaluations have completed (success or failure)`);
    
    // Process results - ensure we have a response for every evaluation
    const scoreResponses: ScoreResponse[] = results.map((result, index) => {
      const evaluation = pendingEvaluations[index];
      
      if (result.status === 'fulfilled') {
        console.log(`✅ Image ${evaluation.imageId} evaluation succeeded: ${result.value.score}`);
        return result.value;
      } else {
        console.error(`❌ Image ${evaluation.imageId} evaluation failed:`, result.reason);
        return {
          prompt: evaluation.prompt,
          score: '0',
          imageId: evaluation.imageId,
          success: false,
          error: result.reason?.message || 'Evaluation failed',
        };
      }
    });

    // Verify we have responses for all evaluations
    if (scoreResponses.length !== pendingEvaluations.length) {
      console.error(`⚠️ Mismatch: Expected ${pendingEvaluations.length} responses, got ${scoreResponses.length}`);
    }

    console.log(`🎯 Final results: ${scoreResponses.filter(r => r.success).length} successful, ${scoreResponses.filter(r => !r.success).length} failed`);
    return scoreResponses;
  } catch (error) {
    console.error('💥 Critical error in waitForAllEvaluations:', error);
    
    // Return error responses for all images - ensures we always have 5 responses
    const errorResponses = pendingEvaluations.map(evaluation => ({
      prompt: evaluation.prompt,
      score: '0',
      imageId: evaluation.imageId,
      success: false,
      error: 'Batch evaluation failed',
    }));
    
    console.log(`🚨 Returning ${errorResponses.length} error responses due to critical failure`);
    return errorResponses;
  }
}

// Calculate total score from all evaluations
export function calculateTotalScore(scoreResponses: ScoreResponse[]): number {
  const totalScore = scoreResponses.reduce((sum, response) => {
    if (response.success) {
      // Parse score string to number (handle potential non-numeric responses)
      const score = parseInt(response.score) || 0;
      return sum + Math.max(0, Math.min(100, score)); // Clamp between 0-100
    }
    return sum;
  }, 0);

  return Math.round(totalScore / scoreResponses.length); // Average score
}

// Get detailed breakdown of scores
export function getScoreBreakdown(scoreResponses: ScoreResponse[]) {
  return {
    total: calculateTotalScore(scoreResponses),
    individual: scoreResponses.map(response => ({
      imageId: response.imageId,
      score: response.success ? (parseInt(response.score) || 0) : 0,
      success: response.success,
      error: response.error,
    })),
    successful: scoreResponses.filter(r => r.success).length,
    failed: scoreResponses.filter(r => !r.success).length,
  };
}
