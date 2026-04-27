import { useEffect, useState, useCallback, useMemo } from "react";
import { Calendar, Views } from "react-big-calendar";
// Importaciones para Drag & Drop
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { localizer } from "./CalendarLocalizer";
import { ItineraryModal } from "./ItineraryModal";
import { CategorySelector } from "./CategorySelector";


const DnDCalendar = withDragAndDrop(Calendar);

const CATEGORY_COLORS = {
    gastronomia: "#ff6b6b", alojamiento: "#4dabf7", transporte: "#845ef7",
    salud: "#ff922b", cultura_turismo: "#20c997", recreacion: "#51cf66",
    deporte: "#339af0", gobierno: "#adb5bd", baños: "#15aabf",
    dinero: "#fcc419", tiendas: "#e64980", otros: "#868e96"
};

const CATEGORY_ICONS = {
    alojamiento: "fa-bed", gastronomia: "fa-utensils", transporte: "fa-bus",
    salud: "fa-house-medical", cultura_turismo: "fa-landmark-flag",
    recreacion: "fa-champagne-glasses", deporte: "fa-volleyball",
    gobierno: "fa-building-columns", baños: "fa-restroom",
    dinero: "fa-money-bill-transfer", tiendas: "fa-bag-shopping", otros: "fa-ellipsis"
};


const parseLocalDate = (str) => {
    if (!str) return new Date();
    const cleanStr = str.replace('T', ' ').split('.')[0];
    const [datePart, timePart] = cleanStr.split(" ");
    const [y, m, d] = datePart.split("-");
    const [hh, mm, ss] = timePart.split(":");
    return new Date(Number(y), Number(m) - 1, Number(d), Number(hh) || 0, Number(mm) || 0, Number(ss) || 0);
};

const formatLocal = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    return `${y}-${m}-${d} ${hh}:${mm}:00`;
};

const roundToNext15 = (date) => {
    const ms = 1000 * 60 * 15;
    return new Date(Math.ceil(date.getTime() / ms) * ms);
};

const CustomEvent = ({ event }) => {
    const start = event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const end = event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="" style={{ overflow: 'hidden', height: '100%' }}>
            <span className="text-capitalize" style={{ fontSize: '0.8rem' }}>{event.title}</span>
            <span className="ms-1 opacity-75" style={{ fontSize: '0.8em' }}>
                ({start} - {end})
            </span>
        </div>
    );
};

export const ItineraryComponent = () => {
    const [events, setEvents] = useState([]);
    const [activeFilters, setActiveFilters] = useState(Object.keys(CATEGORY_COLORS));
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [inputs, setInputs] = useState({
        title: "", date: "", startTime: "", endTime: "", category: "otros"
    });

    const { defaultDate, scrollToTime } = useMemo(() => ({
        defaultDate: new Date(),
        scrollToTime: new Date()
    }), []);

    const loadEvents = useCallback(async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/events`);
            const data = await res.json();
            const formatted = data.map(e => ({
                ...e,
                start: parseLocalDate(e.start),
                end: parseLocalDate(e.end),
            }));
            setEvents(formatted);
        } catch (error) {
            console.error("Error al cargar eventos:", error);
        }
    }, []);

    useEffect(() => { loadEvents(); }, [loadEvents]);


    const moveEvent = useCallback(async ({ event, start, end }) => {

        const updatedEvents = events.map(existingEvent => {
            return existingEvent.id === event.id ? { ...existingEvent, start, end } : existingEvent;
        });
        setEvents(updatedEvents);


        try {
            const payload = {
                ...event,
                start: formatLocal(start),
                end: formatLocal(end)
            };

            await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/events/${event.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
        } catch (error) {
            console.error("Error actualizando evento:", error);
            loadEvents();
        }
    }, [events, loadEvents]);

    const availableCategories = useMemo(() => {
        const cats = events.map(e => e.category);
        return [...new Set(cats)];
    }, [events]);

    const filteredEvents = useMemo(() => {
        if (activeFilters.length === 0) return [];
        return events.filter(e => activeFilters.includes(e.category));
    }, [events, activeFilters]);

    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        setShowViewModal(true);
    };

    const handleStartEdit = () => {
        setIsEditing(true);
        setInputs({
            title: selectedEvent.title,
            date: selectedEvent.start.toLocaleDateString("en-CA"),
            startTime: selectedEvent.start.toTimeString().slice(0, 5),
            endTime: selectedEvent.end.toTimeString().slice(0, 5),
            category: selectedEvent.category || "otros"
        });
        setShowViewModal(false);
        setShowEditModal(true);
    };

    const handleDelete = async () => {
        if (!window.confirm(`¿Eliminar "${selectedEvent.title}"?`)) return;
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/events/${selectedEvent.id}`, { method: "DELETE" });
        setEvents(prev => prev.filter(e => e.id !== selectedEvent.id));
        setShowViewModal(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const [y, m, d] = inputs.date.split("-");
        const startObj = new Date(Number(y), Number(m) - 1, Number(d), ...inputs.startTime.split(":"));
        const endObj = new Date(Number(y), Number(m) - 1, Number(d), ...inputs.endTime.split(":"));

        const payload = { ...inputs, start: formatLocal(startObj), end: formatLocal(endObj) };
        const url = isEditing
            ? `${import.meta.env.VITE_BACKEND_URL}/api/events/${selectedEvent.id}`
            : `${import.meta.env.VITE_BACKEND_URL}/api/events`;

        await fetch(url, {
            method: isEditing ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        loadEvents();
        setShowEditModal(false);
    };

    return (
        <div className="container p-3 rounded-4" style={{ height: "calc(100vh - 160px)", overflow: "hidden" }}>
            <div className="row h-100 g-3">
                <aside className="col-12 col-md-3 col-lg-2 h-100">
                    <div className="bg-white p-3 rounded shadow-sm h-100 border overflow-auto">
                        <CategorySelector
                            value={activeFilters}
                            onChange={setActiveFilters}
                            availableCategories={availableCategories}
                            isMultiple={true}
                        />
                        <button
                            className="btn btn-light btn-sm text-decoration-none text-muted p-0 mt-2 w-100 text-start"
                            style={{ fontSize: '0.8rem' }}
                            onClick={() => setActiveFilters(activeFilters.length === Object.keys(CATEGORY_COLORS).length ? [] : Object.keys(CATEGORY_COLORS))}
                        >
                            {activeFilters.length === Object.keys(CATEGORY_COLORS).length ? "Deseleccionar todas" : "Seleccionar todas"}
                        </button>
                    </div>
                </aside>

                <main className="col-12 col-md-9 col-lg-10 h-100">
                    <div className="bg-white p-2 rounded shadow-sm h-100 border">
                        <DnDCalendar
                            localizer={localizer}
                            culture="es"
                            step={15}
                            events={filteredEvents}
                            defaultView={Views.DAY}
                            views={[Views.WEEK, Views.DAY, Views.AGENDA]}
                            defaultDate={defaultDate}
                            scrollToTime={scrollToTime}
                            min={new Date(0, 0, 0, 6, 0, 0)}
                            onSelectEvent={handleSelectEvent}
                            onEventDrop={moveEvent}
                            onEventResize={moveEvent}
                            resizable
                            draggableAccessor={() => true}
                            components={{
                                event: CustomEvent
                            }}
                            formats={{
                                eventTimeRangeFormat: () => '',
                            }}
                            eventPropGetter={(event) => ({
                                style: {
                                    backgroundColor: CATEGORY_COLORS[event.category] || "#868e96",
                                    border: "none",
                                    borderRadius: "6px"
                                }
                            })}
                            style={{ height: "100%" }}
                            messages={{
                                today: "Hoy",
                                previous: "Anterior",
                                next: "Siguiente",
                                month: 'Mes',
                                week: "Semana",
                                day: "Día"
                            }}
                        />
                    </div>
                </main>
            </div>

            <button
                className="btn btn-success btn-circle shadow-lg position-fixed d-flex align-items-center justify-content-center"
                style={{ bottom: "80px", right: "30px" }}
                onClick={() => {
                    setIsEditing(false);
                    const start = roundToNext15(new Date());
                    const end = new Date(start.getTime() + 60 * 60 * 1000);
                    setInputs({
                        title: "", date: start.toLocaleDateString("en-CA"),
                        startTime: start.toTimeString().slice(0, 5),
                        endTime: end.toTimeString().slice(0, 5), category: "otros"
                    });
                    setShowEditModal(true);
                }}
            >
                <i className="fa-solid fa-plus fs-4"></i>
            </button>

            {showViewModal && selectedEvent && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1060 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content shadow-lg border-0">
                            <div className="modal-header text-white" style={{ backgroundColor: CATEGORY_COLORS[selectedEvent.category] || "#868e96" }}>
                                <div className="d-flex align-items-center gap-2">
                                    <i className={`fa-solid ${CATEGORY_ICONS[selectedEvent.category] || "fa-calendar-day"} fs-4`}></i>
                                    <h5 className="modal-title m-0 text-capitalize">{selectedEvent.title}</h5>
                                </div>
                                <button className="btn-close btn-close-white" onClick={() => setShowViewModal(false)}></button>
                            </div>
                            <div className="modal-body p-4 text-dark">
                                <div className="d-flex flex-column gap-3">
                                    <div className="d-flex align-items-center gap-3">
                                        <i className={`fa-solid ${CATEGORY_ICONS[selectedEvent.category]} fs-3`} style={{ width: '25px' }}></i>
                                        <div>
                                            <h6 className="d-block text-primary">Categoría</h6>
                                            <span className="text-capitalize">{selectedEvent.category.replace('_', ' ')}</span>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center gap-3">
                                        <i className="fa-solid fa-calendar-day fs-3" style={{ width: '25px' }}></i>
                                        <div>
                                            <h6 className="d-block text-primary">Fecha</h6>
                                            <span className="text-capitalize">
                                                {selectedEvent.start.toLocaleDateString('es-ES', {
                                                    weekday: 'long',
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center gap-3">
                                        <i className="fa-solid fa-clock fs-3" style={{ width: '25px' }}></i>
                                        <div>
                                            <h6 className="d-block text-primary">Horario</h6>
                                            <span>
                                                {selectedEvent.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                                                {selectedEvent.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer bg-light border-0">
                                <button className="btn btn-danger border-0 me-auto" onClick={handleDelete}>
                                    <i className="fa-solid fa-trash me-2"></i>Eliminar
                                </button>
                                <button className="btn btn-outline-secondary" onClick={() => setShowViewModal(false)}>Cerrar</button>
                                <button className="btn btn-success px-4" onClick={handleStartEdit}>
                                    <i className="fa-solid fa-pen me-2"></i>Editar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ItineraryModal
                show={showEditModal}
                onClose={() => setShowEditModal(false)}
                onSubmit={handleSubmit}
                inputs={inputs}
                setInputs={setInputs}
                isEditing={isEditing}
            />
        </div>
    );
};