import React, { useEffect } from 'react';

const Toast = ({ message, type, show, onClose }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    let iconClass = 'fa-solid fa-circle-info';
    let typeClass = '';
    if (type === 'success') {
        iconClass = 'fa-solid fa-circle-check';
        typeClass = 'success';
    } else if (type === 'error') {
        iconClass = 'fa-solid fa-circle-exclamation';
        typeClass = 'error';
    }

    return (
        <div id="toast" className={`${show ? 'show' : ''} ${typeClass}`}>
            <i className={iconClass}></i>
            <span>{message}</span>
        </div>
    );
};

export default Toast;
