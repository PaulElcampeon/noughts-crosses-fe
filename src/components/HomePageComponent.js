import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import ImageUploader from '../components/ImageUploaderComponent.js'
import '../App.css';


export default function HomePage() {
    const [redirect, setRedirect] = useState(false);
    // const [symbol, setSymbol] = useState(false);

    function renderRedirectToGamePage() {
        if (redirect) {
            return <Navigate to="/game" replace />;
        }
        return null
    }

    return (
        <div className="text-white mainDiv">
            {renderRedirectToGamePage()}
            <h1 className="text-white mt-5 titleTextSize specialFont">Tic Tac Toe</h1>
            <div className='flexy'>
                <div className='buttonContainer'>
                    <button className="textSize btnCs m-auto p-4 btnTextSize specialFont" onClick={() => setRedirect(true)}>PLAY</button>
                </div>
                <div className='uploadContainer'>
                    <ImageUploader></ImageUploader>
                </div>
            </div>
        </div>
    )
}