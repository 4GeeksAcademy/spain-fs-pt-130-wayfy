from flask import Flask, request, jsonify, Blueprint
from api.models import db, User
from flask_cors import CORS

api = Blueprint('api', __name__)
CORS(api)

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
        db.session.add(new_user) # Preparamos la inserción
        db.session.commit() # Guardamos en la base de datos definitivamente
        return jsonify({"msg": "Usuario creado con éxito"}), 201
    except Exception as e:
        return jsonify({"msg": "Error al guardar en base de datos"}), 500
