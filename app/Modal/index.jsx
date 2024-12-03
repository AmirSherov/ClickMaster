import React from 'react';
import './modal.scss';

export default function Modal({ isOpen, onClose, onConfirm, text }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <p className="modal-text">{text}</p>
        <div className="modal-buttons">
          <button className="modal-button confirm" onClick={onConfirm}>
            Confirm
          </button>
          <button className="modal-button cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
