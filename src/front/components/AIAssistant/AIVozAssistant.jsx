import useAIAssistant from '../../hooks/useAIAssistant';
import useGlobalReducer from '../../hooks/useGlobalReducer';
import useTooltip from '../../hooks/useTooltip';
import { HOTKEYS } from '../../hotkeys/config'

export const AIVozAssistant = () => {
    const { store } = useGlobalReducer()
    const { showShortcut } = store
    const { isListening, isProcessing, toggleListening } = useAIAssistant();
    const { GO_VOICE } = HOTKEYS

    const tooltipRef = useTooltip({
        title: 'Preguntar a la IA',
        placement: 'top',
        trigger: 'hover',
    });

    return (
        <div className="position-relative">

            <button
                ref={tooltipRef}
                className={`btn btn-voz d-flex align-items-center justify-content-center border-3 border-white rounded-circle ${isListening ? 'btn-danger' : 'btn-primary'}`}
                onClick={toggleListening}
                disabled={isProcessing}
                title="Preguntar a la IA"
            >
                <i
                    className={`fa-solid fa-xl ${isProcessing
                        ? 'fa-spinner fa-spin'
                        : isListening
                            ? 'fa-microphone-lines fa-pulse'
                            : 'fa-microphone-lines'
                        }`}
                ></i>
            </button>
            {showShortcut && (
                <span className="badge position-absolute top-50 translate-middle-y bg-dark" style={{ left: '-80px' }}>
                    {GO_VOICE.combo}
                </span>
            )}
        </div>
    );
};
