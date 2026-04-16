import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import useAIAssistant from '../../hooks/useAIAssistant';

const MIN_LENGTH_QUERY = 5;

export const AITextAsistant = () => {
    const [query, setQuery] = useState('');
    const { processQuery, isProcessing } = useAIAssistant();

    const textareaRef = useRef(null);

    useEffect(() => {
        const modalElement = document.getElementById('aiAssistantModal');

        const handleFocus = () => {
            if (textareaRef.current) textareaRef.current.focus();
        };

        modalElement.addEventListener('shown.bs.modal', handleFocus);

        return () =>
            modalElement.removeEventListener('show.bs.modal', handleFocus);
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (query.trim().length < MIN_LENGTH_QUERY) return;

        await processQuery(query);
        setQuery('');

        const modalElement = document.getElementById('aiAssistantModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) modal.hide();
    };

    return (
        <>
            {/* Botón para abrir el modal */}
            <button
                type="button"
                className="btn btn-text btn-primary border-3 border-white rounded-circle d-flex align-items-center justify-content-center border-bottom"
                data-bs-toggle="modal"
                data-bs-target="#aiAssistantModal"
                title="Escribir a la IA"
            >
                <i className="fa-solid fa-keyboard fa-xl"></i>
            </button>

            {/* Estructura del Modal */}
            {createPortal(
                <div
                    id="aiAssistantModal"
                    className="modal fade"
                    style={{ zIndex: 2000 }}
                    tabIndex="-1"
                    data-bs-backdrop="static"
                    aria-labelledby="aiAssistantModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow">
                            <div className="modal-header bg-light text-primary">
                                <h5
                                    className="modal-title"
                                    id="aiAssistantModalLabel"
                                >
                                    <i className="fa-solid fa-robot me-2"></i>{' '}
                                    Su asistente virtual de viaje
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-secondary"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    disabled={isProcessing}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label
                                            htmlFor="aiQuery"
                                            className="form-label"
                                        >
                                            Escribe lo que estas buscando
                                        </label>
                                        <textarea
                                            id="aiQuery"
                                            type="text"
                                            ref={textareaRef}
                                            className="form-control form-control-lg"
                                            placeholder="Ej: Hoteles accesibles en Madrid cerca de Gran Vía..."
                                            rows="3"
                                            value={query}
                                            onChange={(e) =>
                                                setQuery(e.target.value)
                                            }
                                            disabled={isProcessing}
                                            autoFocus
                                        />
                                    </div>
                                    <div className="d-grid">
                                        <button
                                            type="submit"
                                            className={`btn ${query.length < MIN_LENGTH_QUERY ? 'btn-secondary' : 'btn-success'}`}
                                            disabled={
                                                isProcessing ||
                                                query.length < MIN_LENGTH_QUERY
                                            }
                                        >
                                            {isProcessing ? (
                                                <>
                                                    <i className="fa-solid fa-spinner fa-spin me-2"></i>
                                                    Procesando...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fa-solid fa-wand-magic-sparkles me-2"></i>
                                                    'Consultar'
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body,
            )}
        </>
    );
};
