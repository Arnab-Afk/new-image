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

# Enable CORS for all domains and routes
CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# ==============================
# 2. Configure Gemini API
# ==============================
load_dotenv()
API_KEY = os.environ.get("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable not set")
genai.configure(api_key=API_KEY)

# System instruction
system_instruction = """
You are an AI evaluator. Your task is to analyze how well a given prompt is to generate the given image. 
Return only a numeric score between 0 and 100, where:
0 = not related at all, 100 = perfectly accurate description.
"""

# Initialize model
model = genai.GenerativeModel(
    model_name="gemini-2.5-flash",
    system_instruction=system_instruction
)

# ==============================
# 3. API Routes
# ==============================

@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "message": "Backend is running"})

@app.route("/evaluate", methods=["POST"])
def evaluate_prompt():
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

        # Generate response from Gemini
        response = model.generate_content(
            [prompt, image],
            generation_config={"temperature": 0.2}
        )

        score = response.text.strip()

        return jsonify({
            "prompt": prompt,
            "score": score
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ==============================
# 4. Run Flask Server
# ==============================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)