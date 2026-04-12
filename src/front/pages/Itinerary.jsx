import { useState } from "react";

export const Itinerary = () => {
    const [activity, setActivity] = useState("");
    const [list, setList] = useState([]);

    const handleAdd = (e) => {
        e.preventDefault();

        if (activity.trim() === "") return;

        setList([...list, activity]);
        setActivity("");
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-3">¡Arma tu Intinerario de Viaje!</h1>

            <form onSubmit={handleAdd} className="d-flex gap-2 mb-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Añadir actividad (ej: visitar museo)"
                    value={activity}
                    onChange={(e) => setActivity(e.target.value)}
                />
                <button className="btn btn-primary">Agregar</button>
            </form>

            <div className="d-flex overflow-auto gap-3">
                {list.map((item, index) => (
                    <div key={index} className="card p-3" style={{ minWidth: "200px" }}>
                        <p>{item}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

