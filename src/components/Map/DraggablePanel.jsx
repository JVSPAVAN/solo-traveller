import React, { useRef, useState, useEffect } from 'react';

const DraggablePanel = ({ children, className, onClose }) => {
    const panelRef = useRef(null);
    const [height, setHeight] = useState(null); // Null starts with CSS default
    const [isDragging, setIsDragging] = useState(false);
    const startY = useRef(0);
    const startHeight = useRef(0);

    const initialHeight = useRef(0);

    // Initialize height on mount to match CSS
    useEffect(() => {
        if (panelRef.current) {
            const rect = panelRef.current.getBoundingClientRect();
            initialHeight.current = rect.height; // Capture default CSS height
        }
    }, []);

    const handleDragStart = (e) => {
        // Prevent default only if necessary, but we need to track pointer
        // e.preventDefault(); // Might block scrolling inside? No, handle is separate.

        setIsDragging(true);
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        startY.current = clientY;

        if (panelRef.current) {
            startHeight.current = panelRef.current.getBoundingClientRect().height;
        }

        document.addEventListener('mousemove', handleDragMove);
        document.addEventListener('mouseup', handleDragEnd);
        document.addEventListener('touchmove', handleDragMove);
        document.addEventListener('touchend', handleDragEnd);
    };

    const handleDragMove = (e) => {
        if (!panelRef.current) return;

        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const deltaY = startY.current - clientY; // Up is positive delta

        let newHeight = startHeight.current + deltaY;

        // Constraints
        const viewportHeight = window.innerHeight;
        const minH = initialHeight.current || (viewportHeight * 0.45); // Fallback if 0

        // Use initial default height as minimum, not current start height
        const minHeightLimit = minH;
        const maxHeightLimit = viewportHeight * 0.95;

        // Actually, user said "drag up or down".
        // "Min height is the present height".
        // If present is 45%, and max is 95%.
        // Then we can only drag UP (expand).
        // If we drag DOWN, we stop at 45%.
        // This makes "drag down" only valid if we are already expanded.

        if (newHeight < minHeightLimit) newHeight = minHeightLimit;
        if (newHeight > maxHeightLimit) newHeight = maxHeightLimit;

        setHeight(newHeight);
    };

    const handleDragEnd = () => {
        setIsDragging(false);
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
        document.removeEventListener('touchmove', handleDragMove);
        document.removeEventListener('touchend', handleDragEnd);
    };

    const dragHandlers = {
        onMouseDown: handleDragStart,
        onTouchStart: handleDragStart
    };

    return (
        <div
            ref={panelRef}
            className={className}
            style={height ? { height: `${height}px`, transition: isDragging ? 'none' : 'height 0.3s ease-out' } : {}}
        >
            {/* If children is a function, pass drag handlers to it */}
            {typeof children === 'function' ? (
                children(dragHandlers)
            ) : (
                <>
                    <div
                        className="panel-drag-handle-area"
                        {...dragHandlers}
                    >
                        <div className="panel-drag-bar"></div>
                    </div>
                    {children}
                </>
            )}
        </div>
    );
};

export default DraggablePanel;
