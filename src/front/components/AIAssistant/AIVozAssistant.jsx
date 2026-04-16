import useAIAssistant from '../../hooks/useAIAssistant';
import useTooltip from '../../hooks/useTooltip';

export const AIVozAssistant = () => {
    const { isListening, isProcessing, toggleListening } = useAIAssistant();

    const tooltipRef = useTooltip({
        title: 'Preguntar a la IA',
        placement: 'top',
        trigger: 'hover',
    });

    return (
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
    );
};
