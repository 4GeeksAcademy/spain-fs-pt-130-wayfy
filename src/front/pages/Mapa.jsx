import { AccessibilityMap } from "../components/AccessibilityMap/AccessibilityMap";

export const Mapa = () => {
    return (
        <div
            className="container-fluid p-0 w-100 overflow-hidden d-flex"
            style={{
                height: 'calc(100vh - 140px)',
            }}
        >
            <div className="flex-grow-1 w-100">
                <AccessibilityMap />
            </div>
        </div>
    );
};