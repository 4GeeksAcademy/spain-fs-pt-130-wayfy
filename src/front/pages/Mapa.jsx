import { AccessibilityMap } from "../components/AccessibilityMap/AccessibilityMap";


export const Mapa = () => {
    return (
        <div
            className="container-fluid p-0"
            style={{ height: 'calc(100vh - 140px)' }}
        >
            <div className="row g-0 h-100">
                <div className="col-12 h-100">
                    <AccessibilityMap />
                </div>
            </div>
        </div>
    );
};
