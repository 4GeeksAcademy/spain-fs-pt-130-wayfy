from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column

db = SQLAlchemy()


class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    # Agregamos Nombre completo. String(120) es el límite de caracteres.
    full_name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(120), nullable=False)
    # Aquí guardaremos el ID del perfil (ej: 'silla', 'mayor')
    mobility_phase: Mapped[str] = mapped_column(String(80), nullable=False)
    # Lo ponemos por defecto en True para que la cuenta funcione al crearla
    is_active: Mapped[bool] = mapped_column(
        Boolean(), default=True, nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "full_name": self.full_name,
            "mobility_phase": self.mobility_phase,
            "is_active": self.is_active
            # IMPORTANTE: Nunca devolver el password aquí
        }


class Event(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(120), nullable=False)
    start: Mapped[str] = mapped_column(String(50), nullable=False)
    end: Mapped[str] = mapped_column(String(50), nullable=False)
    category: Mapped[str] = mapped_column(
        String(50), nullable=False, default="otros")

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "start": self.start,
            "end": self.end,
            "category": self.category
        }
