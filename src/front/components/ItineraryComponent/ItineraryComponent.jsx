import "./css/ItineraryComponent.css";
import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { createPortal } from "react-dom";
import { FilterCategories } from "../FilterPanel/FilterCategories";

moment.locale("es");
const localizer = momentLocalizer(moment);



export const ItineraryComponent = () => {

    const { store } = useGlobalReducer();

    const [events, setEvents] = useState([]);
    const [text, setText] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [selectedDate, setSelectedDate] = useState("");



    useEffect(() => {
        fetch(import.meta.env.VITE_BACKEND_URL + "/api/events")
            .then(res => res.json())
            .then(data => {
                const formatted = data.map(ev => ({
                    ...ev,
                    start: new Date(ev.start),
                    end: new Date(ev.end)
                }));
                setEvents(formatted);
            })
            .catch(err => console.log(err));
    }, []);


    const filteredPlaces = store.places.filter(place =>
        place.name.toLowerCase().includes(text.toLowerCase())
    );

    const handleAdd = (e) => {
        e.preventDefault();

        if (!text || !startTime || !endTime) return;

        const [startH, startM] = startTime.split(":");
        const [endH, endM] = endTime.split(":");

        const date = new Date(selectedDate);

        const start = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            startH,
            startM
        );

        const end = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            endH,
            endM
        );

        const overlap = events.some(event =>
            (start < event.end) && (end > event.start)
        );

        if (overlap) {
            alert("Ese horario ya está ocupado");
            return;
        }

        fetch(import.meta.env.VITE_BACKEND_URL + "/api/events", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: text,
                start: start.toISOString(),
                end: end.toISOString()
            })
        })
            .then(res => {
                console.log("STATUS:", res.status);
                return res.json();
            })
            .then(newEvent => {
                console.log("DATA:", newEvent);

                setEvents(prev => [
                    ...prev,
                    {
                        ...newEvent,
                        start: new Date(newEvent.start),
                        end: new Date(newEvent.end)
                    }
                ]);
            })
            .catch(err => console.log(err));

        setText("");
        setStartTime("");
        setEndTime("");
    };

    const handleDelete = (id) => {
        fetch(import.meta.env.VITE_BACKEND_URL + "/api/events/" + id, {
            method: "DELETE"
        })
            .then(() => {
                setEvents(prev => prev.filter(event => event.id !== id));
            });
    };

    const handleUpdate = (eventToEdit) => {
        const newTitle = prompt("Nuevo título:", eventToEdit.title);

        if (!newTitle) return;

        fetch(import.meta.env.VITE_BACKEND_URL + "/api/events/" + eventToEdit.id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: newTitle
            })
        })
            .then(res => res.json())
            .then(updatedEvent => {
                setEvents(prev =>
                    prev.map(ev =>
                        ev.id === updatedEvent.id
                            ? {
                                ...updatedEvent,
                                start: new Date(updatedEvent.start),
                                end: new Date(updatedEvent.end)
                            }
                            : ev
                    )
                );
            })
            .catch(err => console.log(err));
    };


    const EventComponent = ({ event }) => {
        return (
            <div className="position-relative w-100 h-100">
                <span className="small">{event.title}</span>

                <span
                    className="position-absolute top-0 end-0 text-danger small"
                    style={{ cursor: "pointer" }}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(event.id);
                    }}
                >
                    ✖
                </span>

                <span
                    className="position-absolute bottom-0 start-0 text-primary small"
                    style={{ cursor: "pointer" }}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleUpdate(event);
                    }}
                >
                    ✏️
                </span>
            </div>
        );
    };


    return (
        <div className="container mt-4">
            <div className="d-flex gap-2">
                <div className="col-1">
                    <FilterCategories typeView="list" />
                </div>

                <div className="col-11">
                    <div className="text-center mb-3">
                        <button
                            className="btn btn-success btn-circle rounded-circle position-fixed bottom-0 end-0 m-4"
                            data-bs-toggle="modal"
                            data-bs-target="#itineraryModal"
                        >
                            <i className="fa-solid fa-plus"></i>
                        </button>
                    </div>

                    {createPortal(
                        <div className="modal fade" id="itineraryModal" tabIndex="-1">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">

                                    <div className="modal-header">
                                        <h5 className="modal-title">Agregar actividad</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                                    </div>

                                    <div className="modal-body">

                                        <form onSubmit={handleAdd}>


                                            <div className="mb-3 position-relative">

                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Actividad"
                                                    value={text}
                                                    onChange={(e) => setText(e.target.value)}
                                                />

                                                {text && (
                                                    <ul className="list-group position-absolute w-100 shadow">
                                                        {filteredPlaces.map(place => (
                                                            <li
                                                                key={place.id}
                                                                className="list-group-item list-group-item-action"
                                                                onClick={() => setText(place.name)}
                                                            >
                                                                📍 {place.name}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>

                                            <input
                                                type="date"
                                                className="form-control mb-3"
                                                value={selectedDate}
                                                onChange={(e) => setSelectedDate(e.target.value)}
                                            />



                                            <div className="row mb-3">
                                                <div className="col">
                                                    <input
                                                        type="time"
                                                        className="form-control"
                                                        value={startTime}
                                                        onChange={(e) => setStartTime(e.target.value)}
                                                    />
                                                </div>

                                                <div className="col">
                                                    <input
                                                        type="time"
                                                        className="form-control"
                                                        value={endTime}
                                                        onChange={(e) => setEndTime(e.target.value)}
                                                    />
                                                </div>
                                            </div>


                                            <div className="d-grid">
                                                <button type="submit" className="btn btn-success">
                                                    Agregar actividad
                                                </button>
                                            </div>

                                        </form>

                                    </div>
                                </div>
                            </div>
                        </div>,
                        document.body
                    )}


                    <div>
                        <Calendar
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            defaultDate={new Date()}
                            defaultView="week"
                            views={["day", "week"]}
                            step={30}
                            timeslots={2}
                            messages={{
                                today: "Hoy",
                                previous: "Anterior",
                                next: "Siguiente",
                                week: "Semana",
                                day: "Día"
                            }}
                            components={{ event: EventComponent }}


                        />
                    </div>
                </div>
            </div>


        </div>
    );
};