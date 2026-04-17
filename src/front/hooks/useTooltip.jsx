import { useEffect, useRef } from 'react';

const useTooltip = ({ title, placement = 'bottom', trigger = 'hover' }) => {
    const ref = useRef(null);

    useEffect(() => {
        if (!ref.current) return;

        const tooltip = new window.bootstrap.Tooltip(ref.current, {
            title,
            placement,
            trigger,
        });

        return () => tooltip.dispose();
    }, [title, placement, trigger]);

    return ref;
};

export default useTooltip;
