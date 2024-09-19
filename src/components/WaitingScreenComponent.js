import React, { useState, useEffect } from 'react';
import '../App.css';


export default function WaitingScreen() {
    const [dotCounter, setDotCounter] = useState(".");

    useEffect(() => {
        const interval = setInterval(() => {
            if (dotCounter.length > 6) {
                setDotCounter(".");
            } else {
                setDotCounter(dotCounter + ".")
            }
        }, 1000)

        return () => clearInterval(interval);
    }, [dotCounter])

    return (
        <div className="waiting-room-container">
            <h1 className="m-auto waiting-room-message special-font">Finding another player {dotCounter}</h1>
        </div>
    )
}