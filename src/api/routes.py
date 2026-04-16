"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
import json
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from groq import Groq
from api.prompts.mapgtp_prompt import MAPGPT_SYSTEM_PROMPT


api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

client = Groq(api_key=os.getenv('GROQ_API_KEY'))

@api.route('/mapgpt', methods=['POST'])
def map_gpt():
    data = request.get_json()
    user_prompt = data.get('prompt')
    
    try:
        completion = client.chat.completions.create(
            messages = [
                {
                    'role': 'system',
                    "content": MAPGPT_SYSTEM_PROMPT
                },
                {
                    'role': 'user',
                    'content': user_prompt
                }
            ],
            model='llama-3.1-8b-instant',
            response_format={'type': 'json_object'}
        )
        
        ai_response = json.loads(completion.choices[0].message.content)
        
        return jsonify(ai_response), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200
