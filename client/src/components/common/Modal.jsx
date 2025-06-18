import { useEffect, useRef } from 'react';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
    const modalRef = useRef(null);

    // Handle escape key press
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.classList.add('overflow-hidden'); // Prevent scrolling when modal is open
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.classList.remove('overflow-hidden');
        };
    }, [isOpen, onClose]);

    // Handle click outside the modal
    const handleOutsideClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };

    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        xl: 'max-w-6xl',
        full: 'max-w-full'
    };

    return (
        <div
            className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center p-4"
            onClick={handleOutsideClick}
        >
            <div
                ref={modalRef}
                className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} transform transition-all`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="px-6 py-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
