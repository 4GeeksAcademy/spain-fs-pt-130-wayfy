import { AITextAsistant } from './AITextAsistant';
import { AIVozAssistant } from './AIVozAssistant';
import './css/AIAssistant.css';

export const AIAssistant = () => {
    return (
        <div className="position-absolute bg-transparent rounded-2 buttons d-flex gap-2 z-1">
            <AITextAsistant />
            <AIVozAssistant />
        </div>
    );
};
