import { AITextAsistant } from './AITextAsistant';
import { AIVozAssistant } from './AIVozAssistant';
import './css/AIAssistant.css';

export const AIAssistantBoth = () => {
    return (
        <div className="position-absolute bg-transparent rounded-2 buttons d-flex flex-column gap-2z-1">
            <AITextAsistant />
            <AIVozAssistant />
        </div>
    );
};
