import { useEffect, useRef, useState } from 'react';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
    const modalRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    // Handle modal visibility with animation timing
    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('overflow-hidden'); // Prevent scrolling when modal is open
            setTimeout(() => setIsVisible(true), 10);
        } else {
            setIsVisible(false);
            const timer = setTimeout(() => {
                document.body.classList.remove('overflow-hidden');
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Handle escape key press
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
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
            className={`fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-75 backdrop-filter backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            onClick={handleOutsideClick}
        >
            <div
                ref={modalRef}
                className={`bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg shadow-2xl border border-indigo-500/30 w-full ${sizeClasses[size]} transform transition-all duration-300 ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between bg-gradient-to-r from-indigo-900/50 to-gray-900">
                    <h3 className="text-lg font-medium text-white">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
                            {title}
                        </span>
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-indigo-300 focus:outline-none transition-all duration-300 transform hover:rotate-90"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="px-6 py-4 text-gray-100">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
