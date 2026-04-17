import { useState, useRef, useCallback, useEffect } from 'react';
import useGlobalReducer from './useGlobalReducer';
import { fetchMapData } from '../services/mapgpt.api';

const useAIAssistant = () => {
    const { store, dispatch } = useGlobalReducer();
    const { viewState } = store;
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const recognitionRef = useRef(null);

    const updateMapState = useCallback(
        (feature, options = {}) => {
            const {
                zoom = null,
                filters = ['yes', 'limited'],
                categories = null,
            } = options;

            const coordinates = feature.center || feature.geometry?.coordinates;
            if (!coordinates) return;

            dispatch({
                type: 'SET_SELECTED_LOCATION',
                payload: {
                    id: feature.id,
                    longitude: coordinates[0],
                    latitude: coordinates[1],
                    zoom:
                        zoom ||
                        (
                            feature.place_type?.includes('address') ? 18 :
                                feature.place_type?.includes('poi') ? 17 :
                                    feature.place_type?.includes('neighborhood') ? 14 : 12
                        ),
                },
            });

            dispatch({ type: 'SET_ACTIVE_FILTERS', payload: filters });

            if (categories) {
                dispatch({
                    type: 'SET_ACTIVE_CATEGORIES',
                    payload: categories,
                });
            }
        },
        [dispatch],
    );

    const processQuery = useCallback(
        async (text) => {
            if (!text || text.trim().length < 3) return;

            setIsProcessing(true);
            try {
                const currentViewCoords = viewState
                    ? `${viewState.longitude},${viewState.latitude}`
                    : null;

                const result = await fetchMapData(text, currentViewCoords);

                if (result && result.feature) {
                    updateMapState(result.feature, {
                        filters: result.filters,
                        categories: result.categories,
                    });
                }
                return result;
            } catch (error) {
                console.error('Error en processQuery:', error);
                throw error;
            } finally {
                setIsProcessing(false);
            }
        },
        [updateMapState],
    );

    const toggleListening = useCallback(() => {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert('Tu navegador no soporta el reconocimiento de voz.');
            return;
        }

        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            const recognition = new SpeechRecognition();
            recognition.lang = 'es-ES';
            recognition.continuous = false;

            recognition.onstart = () => setIsListening(true);
            recognition.onend = () => setIsListening(false);
            recognition.onerror = () => setIsListening(false); // Manejo de error básico

            recognition.onresult = async (e) => {
                const transcript = e.results[0][0].transcript;
                await processQuery(transcript);
            };

            recognitionRef.current = recognition;
            recognition.start();
        }
    }, [isListening, processQuery]);

    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    return {
        isListening,
        isProcessing,
        toggleListening,
        processQuery,
    };
};

export default useAIAssistant;
