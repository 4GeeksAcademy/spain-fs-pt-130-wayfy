import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import useAIAssistant from '../../hooks/useAIAssistant';
import useTooltip from '../../hooks/useTooltip';
import useGlobalReducer from '../../hooks/useGlobalReducer';
import { HOTKEYS } from '../../hotkeys/config'

const MIN_LENGTH_QUERY = 5;

export const AITextAsistant = () => {
    const { store, dispatch } = useGlobalReducer();
    const { showWriterModal, showShortcut } = store;
    const { GO_WRITER } = HOTKEYS

    const [query, setQuery] = useState('');
    const { processQuery, isProcessing } = useAIAssistant();

    const textareaRef = useRef(null);
    const tooltipRef = useTooltip({
        title: 'Escribir a la IA',
        placement: 'top',
        trigger: 'hover',
    });

    // Sincronizar modal con el store global
    useEffect(() => {
        const modalElement = document.getElementById('aiAssistantModal');
        if (!modalElement) return;

        const modal = bootstrap.Modal.getOrCreateInstance(modalElement);

        if (showWriterModal) {
            modal.show();
        } else {
            modal.hide();
        }
    }, [showWriterModal]);

    // Focus automático cuando el modal se abre
    useEffect(() => {
        const modalElement = document.getElementById('aiAssistantModal');

        const handleFocus = () => {
            if (textareaRef.current) textareaRef.current.focus();
        };

        modalElement.addEventListener('shown.bs.modal', handleFocus);

        return () =>
            modalElement.removeEventListener('shown.bs.modal', handleFocus);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (query.trim().length < MIN_LENGTH_QUERY) return;

        await processQuery(query);
        setQuery('');

        dispatch({ type: 'CLOSE_WRITER_MODAL' });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <>
            {/* Botón para abrir el modal */}
            <div className="position-relative">
                <button
                    type="button"
                    ref={tooltipRef}
                    className="btn btn-text btn-primary border-3 border-white rounded-circle d-flex align-items-center justify-content-center border-bottom"
                    onClick={() => dispatch({ type: 'OPEN_WRITER_MODAL' })}
                >
                    <i className="fa-solid fa-keyboard fa-xl"></i>
                </button>
                {showShortcut && (
                    <span className="badge position-absolute top-50 translate-middle-y bg-dark" style={{ left: '-80px' }}>
                        {GO_WRITER.combo}
                    </span>
                )}
            </div>

            {/* Modal */}
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
                            <div className="modal-header text-primary">
                                <h5 className="modal-title" id="aiAssistantModalLabel">
                                    <i className="fa-solid fa-robot me-2"></i>
                                    Su asistente virtual de viaje
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-secondary"
                                    onClick={() => dispatch({ type: 'CLOSE_WRITER_MODAL' })}
                                    disabled={isProcessing}
                                ></button>
                            </div>

                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="aiQuery" className="form-label">
                                            Escribe lo que estás buscando
                                        </label>

                                        <textarea
                                            id="aiQuery"
                                            ref={textareaRef}
                                            className="form-control form-control-lg"
                                            placeholder="Ej: Hoteles accesibles en Madrid cerca de Gran Vía..."
                                            rows="3"
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            disabled={isProcessing}
                                            autoFocus
                                        />
                                    </div>

                                    <div className="d-grid">
                                        <button
                                            type="submit"
                                            className={`btn ${query.length < MIN_LENGTH_QUERY
                                                ? 'btn-secondary'
                                                : 'btn-success'
                                                }`}
                                            disabled={isProcessing || query.length < MIN_LENGTH_QUERY}
                                        >
                                            {isProcessing ? (
                                                <>
                                                    <i className="fa-solid fa-spinner fa-spin me-2"></i>
                                                    Procesando...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fa-solid fa-wand-magic-sparkles me-2"></i>
                                                    Consultar
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};
