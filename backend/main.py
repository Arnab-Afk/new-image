from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from PIL import Image
import io
import os
from dotenv import load_dotenv

# ==============================
# 1. Setup Flask App
# ==============================
app = Flask(__name__)

# Enable CORS for all routes and origins
# For development: Allow all origins
CORS(app)

# For production: Restrict to specific domains
# CORS(app, origins=["http://localhost:3000", "https://your-frontend-domain.com"])

# ==============================
# 2. Configure Gemini API
# ==============================
load_dotenv()
API_KEY = os.environ.get("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable not set")
genai.configure(api_key=API_KEY)

# Enhanced system instruction for better prompt evaluation
system_instruction = """
You are an expert AI image prompt evaluator. Your task is to analyze how well a given text prompt would generate or describe the provided image.

EVALUATION CRITERIA:
1. **Visual Accuracy (40%)**: How accurately does the prompt describe what's actually visible in the image?
   - Objects, people, animals, architecture
   - Colors, lighting, composition
   - Setting and environment

2. **Style & Technique (25%)**: Does the prompt capture the artistic style and technical aspects?
   - Photography style (portrait, landscape, macro, etc.)
   - Art style (realistic, abstract, cartoon, etc.)
   - Technical details (lighting, perspective, depth of field)

3. **Mood & Atmosphere (20%)**: Does the prompt convey the emotional tone and atmosphere?
   - Emotional feeling (peaceful, dramatic, mysterious, etc.)
   - Time of day, weather conditions
   - Overall ambiance and mood

4. **Specificity & Detail (15%)**: How specific and detailed is the prompt?
   - Specific vs. generic descriptions
   - Creative and unique elements
   - Technical photography/art terms

SCORING GUIDELINES:
- 90-100: Exceptional match - prompt would likely generate a very similar image
- 80-89: Excellent match - captures most key visual elements and style
- 70-79: Good match - describes the main subjects and setting accurately
- 60-69: Fair match - gets the general idea but missing important details
- 50-59: Poor match - some elements correct but many inaccuracies
- 40-49: Bad match - significantly different from the image
- 0-39: No match - completely unrelated or opposite description

IMPORTANT RULES:
- Return ONLY a numeric score (integer between 0-100)
- No explanations, text, or additional content
- Be generous with creative interpretations that capture the essence
- Reward prompts that would realistically generate similar images
- Consider that different prompt styles can be equally valid

Example scoring:
- Image: Sunset over mountains
- Prompt: "Beautiful sunset over mountain peaks" → Score: 75
- Prompt: "Golden hour landscape photography of mountain silhouettes against orange sky" → Score: 92
- Prompt: "Dog playing in a park" → Score: 5
"""

# Initialize model
model = genai.GenerativeModel(
    model_name="gemini-2.5-flash",
    system_instruction=system_instruction
)

# ==============================
# 3. API Routes
# ==============================

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.route("/evaluate", methods=["POST", "OPTIONS"])
def evaluate_prompt():
    # Handle preflight OPTIONS request
    if request.method == "OPTIONS":
        return "", 200
        
    try:
        # Get prompt
        prompt = request.form.get("prompt")
        if not prompt:
            return jsonify({"error": "Missing 'prompt'"}), 400

        # Get image file
        if "image" not in request.files:
            return jsonify({"error": "Missing 'image' file"}), 400
        
        image_file = request.files["image"]
        image = Image.open(io.BytesIO(image_file.read()))

        # Generate response from Gemini with improved configuration
        response = model.generate_content(
            [prompt, image],
            generation_config={
                "temperature": 0.1,  # Lower temperature for more consistent scoring
                "top_p": 0.8,
                "top_k": 20,
                "max_output_tokens": 10,  # Only need a number
            }
        )

        # Extract and validate the score
        score_text = response.text.strip()
        
        # Try to extract a number from the response
        import re
        score_match = re.search(r'\b(\d{1,3})\b', score_text)
        
        if score_match:
            score = int(score_match.group(1))
            # Ensure score is within valid range
            score = max(0, min(100, score))
        else:
            # Fallback: try to convert entire response to int
            try:
                score = int(float(score_text))
                score = max(0, min(100, score))
            except (ValueError, TypeError):
                # If all else fails, return a default score
                score = 50
                print(f"Warning: Could not parse score from response: {score_text}")

        return jsonify({
            "prompt": prompt,
            "score": str(score)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ==============================
# 4. Run Flask Server
# ==============================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
