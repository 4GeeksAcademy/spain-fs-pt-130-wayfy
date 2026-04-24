import { useEffect, useState } from 'react';
import useAIAssistant from '../../hooks/useAIAssistant';
import { HOTKEYS } from '../../hotkeys/config'
import useGlobalReducer from '../../hooks/useGlobalReducer'

// import { AITextAsistant } from './AITextAsistant';
// import { AIVozAssistant } from './AIVozAssistant';
// import './css/AIAssistant.css';

const MIN_LENGTH_QUERY = 3;

export const AIAssistant = () => {
    const { store } = useGlobalReducer();
    const { showShortcut } = store
    const { GO_VOICE, GO_WRITER } = HOTKEYS
    const [query, setQuery] = useState('');
    const { processQuery, isProcessing, isListening, toggleListening, inputRef } = useAIAssistant();

    useEffect(() => {
        const handler = () => {
            if (inputRef.current) inputRef.current.focus()

        }

        window.addEventListener('focus-ai-input', handler)

        return () => window.removeEventListener('focus-ai-input', handler)
    }, [inputRef])

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (query.trim().length < MIN_LENGTH_QUERY) return;

        await processQuery(query);
        setQuery('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <>
            {isProcessing && (
                <div
                    className="
                        position-absolute
                        top-0 start-0 end-0 bottom-0
                        d-flex flex-column justify-content-center align-items-center
                        bg-dark bg-opacity-75 z-1
                    "
                >
                    <i className="fa-solid fa-spinner fa-spin fa-4x text-white"></i>
                    <span className={`text-white px-4 rounded-5 mt-2`}>WayFy está en marcha...</span>
                </div>
            )}

            <div
                className="position-absolute bottom-0 start-0 end-0 mb-4 mx-5 z-1"
                style={{ opacity: '0.9' }}
            >
                <div className="container mx-auto">
                    <form
                        onSubmit={handleSubmit}
                        className="d-flex align-items-center gap-3 bg-dark text-white p-3 rounded-3"
                    >
                        <div className="position-relative w-100">
                            <input
                                ref={inputRef}
                                className="form-control bg-dark text-white border border-secondary rounded-3"
                                placeholder="Pregunta a Wayfy..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                readOnly={isListening}
                                disabled={isProcessing}
                            />

                            {showShortcut && (
                                <span className="badge badge-shortcut bg-dark mt-1">
                                    {GO_WRITER.combo}
                                </span>
                            )}
                        </div>
                        <div className="position-relative">
                            <i
                                onClick={() => !isProcessing && toggleListening()}
                                className={`fa-solid fa-xl ${isListening
                                    ? 'fa-microphone-lines fa-pulse text-danger'
                                    : 'fa-microphone-lines text-white cursor-pointer'
                                    }`}
                                style={{ cursor: 'pointer' }}
                                disabled={isProcessing}
                                title="Hablar con la IA"
                            ></i>
                            {showShortcut && (
                                <span className="badge badge-shortcut bg-dark">
                                    {GO_VOICE.combo}
                                </span>
                            )}
                        </div>

                    </form>
                </div>
            </div>

            {/* <div className="position-absolute bg-transparent rounded-2 buttons d-flex gap-2 z-1">
                <AITextAsistant />
                <AIVozAssistant />
            </div> */}
        </>
    );
};
