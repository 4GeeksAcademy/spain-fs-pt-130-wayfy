import "./css/ItineraryComponent.css";
import { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

export const ItineraryComponent = () => {

    const [events, setEvents] = useState([]);
    const [text, setText] = useState("");
    const [time, setTime] = useState("");

    const handleAdd = (e) => {
        e.preventDefault();

        if (!text || !time) return;

        const start = new Date();
        const [hours, minutes] = time.split(":");

        start.setHours(hours);
        start.setMinutes(minutes);

        const end = new Date(start);
        end.setHours(start.getHours() + 1);

        const colors = [
            "var(--wayfy-green)",
            "var(--wayfy-blue)",
            "var(--wayfy-cyan)",
            "var(--wayfy-gray)"
        ];

        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        const newEvent = {
            id: Date.now(),
            title: text,
            start,
            end,
            color: randomColor
        };

        setEvents([...events, newEvent]);
        setText("");
        setTime("");
    };

    const handleDelete = (id) => {
        setEvents(events.filter(event => event.id !== id));
    };


    const eventStyleGetter = (event) => {
        return {
            style: {
                backgroundColor: event.color,
                borderRadius: "8px",
                border: "none",
                color: "white",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "4px 6px"
            }
        };
    };


    const EventComponent = ({ event }) => (
        <div className="event-content">
            <span>{event.title}</span>
            <span
                className="delete-btn"
                onClick={() => handleDelete(event.id)}
            >
                ✖
            </span>
        </div>
    );

    return (
        <>
            <form onSubmit={handleAdd} className="d-flex gap-2 mb-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Actividad"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />

                <input
                    type="time"
                    className="form-control"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                />

                <button className="btn btn-success">
                    Agregar
                </button>
            </form>

            <div style={{ height: "500px" }}>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    defaultView="week"
                    views={["day", "week"]}
                    step={30}
                    timeslots={2}
                    //min={new Date(2026, 0, 1, 6, 0)}
                    //max={new Date(2026, 0, 1, 22, 0)}
                    eventPropGetter={eventStyleGetter}
                //components={{
                //event: EventComponent//
                //}}
                />
            </div>
        </>
    );
};