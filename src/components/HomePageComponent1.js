import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import ImageUploader from './ImageUploaderComponent.js'
import '../App.css';


export default function HomePage() {
    const [redirect, setRedirect] = useState(false);

    function renderRedirectToGamePage() {
        if (redirect) {
            return <Navigate to="/game" replace />;
        }
        return null
    }

    return (
        <div className="home-page-container text-white">
            {renderRedirectToGamePage()}
            <h1 className="text-white mt-5 title special-font">Tic Tac Toe</h1>
            {/* <div className='flexy'> */}
                <div className='play-btn-container'>
                    <button className="m-auto p-4 play-btn special-font" onClick={() => setRedirect(true)}>PLAY</button>
                </div>
                {/* <div className='uploadContainer'>
                    <ImageUploader></ImageUploader>
                </div> */}
            {/* </div> */}
        </div>
    )
}