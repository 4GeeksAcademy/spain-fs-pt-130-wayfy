from api.commands import setup_commands
from api.admin import setup_admin
from api.routes import api
from api.models import db
from api.utils import APIException, generate_sitemap
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_cors import CORS
from flask import Flask, request, jsonify, send_from_directory
import os
# --- NOTA: Esto lee tu archivo .env y pone las variables en el sistema ---
from dotenv import load_dotenv
load_dotenv()


app = Flask(__name__)
CORS(app)  # <--- ACTIVACIÓN DE CORS PARA TODA LA APP
app.url_map.strict_slashes = False

#  CONFIGURACIÓN DE SEGURIDAD PARA JWT ---
# app.config["JWT_SECRET_KEY"] = os.getenv(
#   "FLASK_APP_KEY", "super-secret-key-cambiar-en-prod")
# jwt = JWTManager(app)

# Configuración de base de datos
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

setup_admin(app)
setup_commands(app)
app.register_blueprint(api, url_prefix='/api')


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code


@app.route('/')
def sitemap():
    return send_from_directory(os.path.join(os.path.dirname(os.path.realpath(__file__)), '../dist/'), 'index.html')


if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
