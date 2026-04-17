import "./css/ItineraryComponent.css";
import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faUtensils, faHotel, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

moment.locale("es");
const localizer = momentLocalizer(moment);

const FIXED_DATE = new Date(2026, 3, 17);

export const ItineraryComponent = () => {

    const { store } = useGlobalReducer();

    const [events, setEvents] = useState([]);
    const [text, setText] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [category, setCategory] = useState("general");


    useEffect(() => {
        const saved = localStorage.getItem("itinerary");
        if (saved) setEvents(JSON.parse(saved));
    }, []);


    useEffect(() => {
        localStorage.setItem("itinerary", JSON.stringify(events));
    }, [events]);

    const filteredPlaces = store.places.filter(place =>
        place.name.toLowerCase().includes(text.toLowerCase())
    );

    const categoryConfig = {
        food: { icon: faUtensils, color: "var(--wayfy-green)" },
        hotel: { icon: faHotel, color: "var(--wayfy-blue)" },
        place: { icon: faMapMarkerAlt, color: "var(--wayfy-cyan)" },
        general: { icon: faMapMarkerAlt, color: "var(--wayfy-gray)" }
    };

    const handleAdd = (e) => {
        e.preventDefault();

        if (!text || !startTime || !endTime) return;

        const [startH, startM] = startTime.split(":");
        const [endH, endM] = endTime.split(":");

        const start = new Date(2026, 3, 17, parseInt(startH), parseInt(startM));
        const end = new Date(2026, 3, 17, parseInt(endH), parseInt(endM));

        if (start >= end) {
            alert("❌ Hora inválida");
            return;
        }

        const overlap = events.some(event => (start < event.end) && (end > event.start));

        if (overlap) {
            alert("❌ Horario ocupado");
            return;
        }

        const config = categoryConfig[category];

        const newEvent = {
            id: Date.now(),
            title: text,
            start,
            end,
            color: config.color,
            icon: config.icon
        };

        setEvents(prev => [...prev, newEvent]);
        setText("");
        setStartTime("");
        setEndTime("");
    };

    const handleDelete = (id) => {
        setEvents(prev => prev.filter(event => event.id !== id));
    };

    const eventStyleGetter = (event) => ({
        style: {
            backgroundColor: event.color,
            borderRadius: "10px",
            border: "none",
            color: "white",
            padding: "5px",
            transition: "all 0.2s ease"
        }
    });

    const EventComponent = ({ event }) => (
        <div style={{ position: "relative", height: "100%" }}>
            <span>
                <FontAwesomeIcon icon={event.icon} style={{ marginRight: "5px" }} />
                {event.title}
            </span>

            <span
                style={{
                    position: "absolute",
                    top: 2,
                    right: 6,
                    cursor: "pointer",
                    fontSize: "12px"
                }}
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
        <>
            <div className="d-flex gap-4">


                <div style={{ minWidth: "150px" }}>
                    <h6>Categorías</h6>
                    <div className="d-flex flex-column gap-2">
                        <button className="btn btn-outline-success" onClick={() => setCategory("food")}>🍔 Comida</button>
                        <button className="btn btn-outline-primary" onClick={() => setCategory("hotel")}>🏨 Hotel</button>
                        <button className="btn btn-outline-info" onClick={() => setCategory("place")}>📍 Lugar</button>
                    </div>
                </div>


                <div style={{ width: "100%" }}>

                    <form onSubmit={handleAdd} className="d-flex gap-2 mb-4">

                        <div style={{ position: "relative", width: "100%" }}>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Actividad"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />

                            {text && (
                                <ul className="list-group" style={{
                                    position: "absolute",
                                    width: "100%",
                                    zIndex: 1000
                                }}>
                                    {filteredPlaces.map(place => (
                                        <li
                                            key={place.id}
                                            className="list-group-item"
                                            onClick={() => setText(place.name)}
                                        >
                                            📍 {place.name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <input type="time" className="form-control" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                        <input type="time" className="form-control" value={endTime} onChange={(e) => setEndTime(e.target.value)} />

                        <button className="btn btn-success d-flex align-items-center justify-content-center rounded-circle" style={{ width: "45px", height: "45px" }}>
                            <FontAwesomeIcon icon={faPlus} />
                        </button>
                    </form>

                    <div style={{ height: "500px" }}>
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
                            eventPropGetter={eventStyleGetter}
                            components={{ event: EventComponent }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};