import { useRef, useEffect } from "react";
import { CategorySelector } from "./CategorySelector";

export const ItineraryModal = ({
    show,
    onClose,
    onSubmit,
    inputs,
    setInputs,
    isEditing
}) => {
    const modalRef = useRef(null);

    useEffect(() => {
        if (show) {
            const modal = new window.bootstrap.Modal(modalRef.current);
            modal.show();
        } else {
            const modal = window.bootstrap.Modal.getInstance(modalRef.current);
            if (modal) modal.hide();
        }
    }, [show]);

    return (
        <div
            className="modal fade"
            ref={modalRef}
            tabIndex="-1"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
        >
            <div className="modal-dialog">
                <form className="modal-content" onSubmit={onSubmit}>
                    <div className="modal-header">
                        <h5 className="modal-title">
                            {isEditing ? "Editar evento" : "Nuevo evento"}
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>

                    <div className="modal-body">

                        <div className="mb-3">
                            <label className="form-label">Título</label>
                            <input
                                type="text"
                                className="form-control"
                                value={inputs.title}
                                onChange={(e) =>
                                    setInputs({ ...inputs, title: e.target.value })
                                }
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Fecha</label>
                            <input
                                type="date"
                                className="form-control"
                                value={inputs.date}
                                onChange={(e) =>
                                    setInputs({ ...inputs, date: e.target.value })
                                }
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Hora inicio</label>
                            <input
                                type="time"
                                className="form-control"
                                step="900"
                                value={inputs.startTime}
                                onChange={(e) =>
                                    setInputs({ ...inputs, startTime: e.target.value })
                                }
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Hora fin</label>
                            <input
                                type="time"
                                className="form-control"
                                step="900"
                                value={inputs.endTime}
                                onChange={(e) =>
                                    setInputs({ ...inputs, endTime: e.target.value })
                                }
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <CategorySelector
                                value={inputs.category}
                                onChange={(cat) => setInputs({ ...inputs, category: cat })}
                            />
                        </div>

                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
