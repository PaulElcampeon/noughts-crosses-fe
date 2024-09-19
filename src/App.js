import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './components/HomePageComponent1';
import GamePage from './components/GamePageComponent';

const Error = () => {
  return (
    <div>
      <h1 className="text-white mt-5 titleTextSize specialFont">Error</h1>
      <br></br>
      <Link className="text-white mt-5 waitingTextSize" to="/">Back To Home Page</Link>
    </div>
  )
}

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/game" element={<GamePage />} />
          <Route component={Error} />
        </Routes>
      </BrowserRouter>
    );
  }
}

export default App;