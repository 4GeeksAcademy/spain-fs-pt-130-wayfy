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

const FIXED_DATE = new Date(2026, 3, 17);

export const ItineraryComponent = () => {

    const { store } = useGlobalReducer();

    const [events, setEvents] = useState([]);
    const [text, setText] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");


    useEffect(() => {
        const saved = localStorage.getItem("itinerary");
        if (saved) setEvents(JSON.parse(saved));
    }, []);


    useEffect(() => {
        localStorage.setItem("itinerary", JSON.stringify(events));
    }, [events]);


    const filteredPlaces = (store.places || []).filter(place =>
        place.name.toLowerCase().includes(text.toLowerCase())
    );

    const handleAdd = (e) => {
        e.preventDefault();

        if (!text || !startTime || !endTime) return;

        const [startH, startM] = startTime.split(":");
        const [endH, endM] = endTime.split(":");

        const start = new Date(2026, 3, 17, parseInt(startH), parseInt(startM));
        const end = new Date(2026, 3, 17, parseInt(endH), parseInt(endM));

        if (start >= end) {
            alert("La hora de inicio debe ser menor");
            return;
        }

        const overlap = events.some(event =>
            (start < event.end) && (end > event.start)
        );

        if (overlap) {
            alert("Ese horario ya está ocupado");
            return;
        }

        const newEvent = {
            id: Date.now(),
            title: text,
            start,
            end
        };

        setEvents(prev => [...prev, newEvent]);

        setText("");
        setStartTime("");
        setEndTime("");


        const modal = document.getElementById("itineraryModal");
        const modalInstance = window.bootstrap.Modal.getInstance(modal);
        if (modalInstance) modalInstance.hide();
    };

    const handleDelete = (id) => {
        setEvents(prev => prev.filter(event => event.id !== id));
    };

    const EventComponent = ({ event }) => (
        <div className="position-relative h-100">
            <span>{event.title}</span>

            <span
                className="position-absolute top-0 end-0 me-1"
                style={{ cursor: "pointer", fontSize: "12px" }}
                onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(event.id);
                }}
            >
                ✖
            </span>
        </div>
    );

    return (
        <div className="container mt-4">
            <div className="d-flex gap-2">
                <div className="col-1">
                    <FilterCategories typeView="list" />
                </div>

                <div className="col-11">
                    <div className="text-center mb-3">
                        <button
                            className="btn btn-success rounded-circle"
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
                                                    <ul className="list-group position-absolute w-100 shadow z-3">
                                                        {filteredPlaces.map(place => (
                                                            <li
                                                                key={place.id}
                                                                className="list-group-item list-group-item-action"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    setText(place.name);
                                                                }}
                                                            >
                                                                📍 {place.name}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>


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
                            date={FIXED_DATE}
                            defaultView="week"
                            views={["day", "week"]}
                            min={new Date(2026, 3, 17, 6, 0)}
                            max={new Date(2026, 3, 17, 22, 0)}
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