'use client';

import React from 'react';
import './clicker.scss';
import { useState } from 'react';

export default function Clicker() {
  const [counter, setCounter] = useState(0);

    return (
        <div className="clicker-container">
            <h1>Click Master</h1>
            <p className="counter-display">{counter}</p>
            <button onClick={() => setCounter(counter + 1)} role="button" className="button-92">
                Tap
            </button>
        </div>
    );
}