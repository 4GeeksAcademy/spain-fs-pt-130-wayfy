import os
import json
from flask import Blueprint, request, jsonify
from api.models import db, User
from flask_cors import CORS
from flask_jwt_extended import create_access_token
from api.prompts.mapgpt_prompt import MAPGPT_SYSTEM_PROMPT
from groq import Groq  # --- IMPORTAMOS GROQ AQUÍ ---

api = Blueprint('api', __name__)
CORS(api)


@api.route('/mapgpt', methods=['POST'])
def map_gpt():
    data = request.get_json()
    user_prompt = data.get('prompt')

    if not user_prompt:
        return jsonify({'error': 'Prompt vacío'}), 400

    # --- INICIALIZACIÓN SEGURA (DENTRO DE LA FUNCIÓN) ---
    api_key = os.getenv('GROQ_API_KEY')
    if not api_key:
        return jsonify({'error': 'Error de configuración en servidor'}), 500

    client = Groq(api_key=api_key)

    try:
        completion = client.chat.completions.create(
            messages=[{'role': 'system', "content": MAPGPT_SYSTEM_PROMPT},
                      {'role': 'user', 'content': user_prompt}],
            model='llama-3.1-8b-instant',
            response_format={'type': 'json_object'}
        )
        ai_response = json.loads(completion.choices[0].message.content)
        return jsonify(ai_response), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@api.route('/signup', methods=['POST'])
def handle_signup():
    body = request.get_json()

    if not body or "email" not in body or "password" not in body:
        return jsonify({"msg": "Datos incompletos"}), 400

    user_check = User.query.filter_by(email=body["email"]).first()
    if user_check:
        return jsonify({"msg": "El usuario ya existe"}), 400

    new_user = User(
        email=body["email"],
        password=body["password"],
        full_name=body.get("full_name"),
        mobility_phase=body.get("mobility_phase"),
        is_active=True
    )

    try:
        db.session.add(new_user)
        db.session.commit()

        # --- AQUÍ AHORA FUNCIONARÁ PORQUE JWT ESTÁ CONFIGURADO EN APP.PY ---
        access_token = create_access_token(identity=str(new_user.id))

        return jsonify({
            "msg": "Usuario creado con éxito",
            "token": access_token,
            "user": new_user.serialize()
        }), 201

    except Exception as e:
        return jsonify({"msg": "Error al guardar en base de datos"}), 500
