"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
import json
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from flask_cors import CORS
from groq import Groq
from api.prompts.mapgpt_prompt import MAPGPT_SYSTEM_PROMPT
from api.models import db, User, Event


api = Blueprint('api', __name__)
CORS(api)

client = Groq(api_key=os.getenv('GROQ_API_KEY'))


@api.route('/mapgpt', methods=['POST'])
def map_gpt():
    data = request.get_json()
    user_prompt = data.get('prompt')

    if not user_prompt or not user_prompt.strip():
        return jsonify({'error': 'Prompt vacío'}), 400

    try:
        completion = client.chat.completions.create(
            messages=[
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

# Este es el Endpoint de registro


@api.route('/signup', methods=['POST'])
def handle_signup():

    body = request.get_json()

    if body is None:
        return jsonify({"msg": "No se envió información en el cuerpo"}), 400
    if "email" not in body or "password" not in body:
        return jsonify({"msg": "Email y password son obligatorios"}), 400

    # Verificación por si el usuario ya existe para evitar errores de duplicado
    user_check = User.query.filter_by(email=body["email"]).first()
    if user_check:
        return jsonify({"msg": "El usuario ya existe"}), 400

    # Creamos la instancia del modelo User con los datos del body
    new_user = User(
        email=body["email"],
        password=body["password"],
        full_name=body["full_name"],
        mobility_phase=body["mobility_phase"],
        is_active=True
    )

    try:
        db.session.add(new_user)  # Preparamos la inserción
        db.session.commit()  # Guardamos en la base de datos definitivamente
        return jsonify({"msg": "Usuario creado con éxito"}), 201
    except Exception as e:
        return jsonify({"msg": "Error al guardar en base de datos"}), 500


# PARTE DE BACKEND DE INTINERARY (LUZ)

@api.route('/events', methods=['GET'])
def get_events():
    events = Event.query.all()
    return jsonify([event.serialize() for event in events]), 200


@api.route('/events', methods=['POST'])
def create_event():
    body = request.get_json()

    new_event = Event(
        title=body["title"],
        start=body["start"],
        end=body["end"]
    )

    db.session.add(new_event)
    db.session.commit()

    return jsonify(new_event.serialize()), 201


@api.route('/events/<int:id>', methods=['PUT'])
def update_event(id):
    body = request.get_json()
    event = Event.query.get(id)

    if not event:
        return jsonify({"msg": "No existe"}), 404

    event.title = body.get("title", event.title)
    event.start = body.get("start", event.start)
    event.end = body.get("end", event.end)

    db.session.commit()

    return jsonify(event.serialize()), 200


@api.route('/events/<int:id>', methods=['DELETE'])
def delete_event(id):
    event = Event.query.get(id)

    if not event:
        return jsonify({"msg": "No existe"}), 404

    db.session.delete(event)
    db.session.commit()

    return jsonify({"msg": "Eliminado"}), 200
