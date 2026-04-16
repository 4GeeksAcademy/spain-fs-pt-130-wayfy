import useAIAssistant from '../../hooks/useAIAssistant';

export const AIVozAssistant = () => {
    const { isListening, isProcessing, toggleListening } = useAIAssistant();

    return (
        <button
            className={`btn btn-voz d-flex align-items-center justify-content-center border-3 border-white rounded-circle ${isListening ? 'btn-danger' : 'btn-primary'}`}
            onClick={toggleListening}
            disabled={isProcessing}
            title="Preguntar a la IA"
        >
            <i
                className={`fa-solid fa-xl ${
                    isProcessing
                        ? 'fa-spinner fa-spin'
                        : isListening
                          ? 'fa-microphone-lines fa-pulse'
                          : 'fa-microphone-lines'
                }`}
            ></i>
        </button>
    );
};
