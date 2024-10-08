import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import '../App.css';
import WaitingScreen from '../components/WaitingScreenComponent'
import BoardComponent from './BoardComponent'
import { v4 as uuidv7 } from 'uuid';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

export default function GamePage() {
    const [redirect, setRedirect] = useState(false);
    const [connected, setConnected] = useState(false);
    const [socket, setSocket] = useState(null);
    const [stompClient, setStompClient] = useState(null);
    const [name, setName] = useState(null);
    const [gameSession, setGameSession] = useState(null);
    const [privateSubscription, setPrivateSubscription] = useState(null);
    const [gameSessionSubscription, setGameSessionSubscription] = useState(null);

    useEffect(() => {
        // setSocket(new SockJS('http://localhost:8080/game'))
        setSocket(new SockJS('/game'))
        // return () => stompClient.disconnect(() => console.log("Disconnected from server"))
    }, [])

    if (shouldCreateStompClient()) createStompClient();

    if (shouldConnectToServer()) connectToServer();

    if (shouldConnectToPrivatePlayerTopic()) subscribeToPrivatePlayerTopic();

    if (shouldJoinGame()) joinGame();

    if (shouldSubscribeToNewGameSession()) subscribeToNewGameSession();


    function shouldConnectToPrivatePlayerTopic() {
        // return name && !privateSubscription;
        if (!name) return false;
        if (privateSubscription) return false;

        return true;
    }

    function shouldCreateStompClient() {
        // return !connected && !socket && !stompClient;
        if (connected) return false;
        if (!socket) return false;
        if (stompClient) return false;

        return true;
    }

    function shouldConnectToServer() {
        // return stompClient && !stompClient.connected;
        if (!stompClient) return false;
        if (stompClient.connected) return false;

        return true;
    }

    function shouldJoinGame() {
        // return name && privateSubscription && !gameSession;
        if (!name) return false;
        if (!privateSubscription) return false;
        if (gameSession) return false;

        return true;
    }

    function shouldSubscribeToNewGameSession() {
        // return gameSession && privateSubscription && !gameSessionSubscription;
        if (!gameSession) return false;
        if (!privateSubscription) return false;
        if (gameSessionSubscription) return false;

        return true;
    }

    function createStompClient() {
        console.log("StompClient created")
        setStompClient(Stomp.over(socket));
    }

    function connectToServer() {
        stompClient.connect({}, frame => {
            console.log('Connected to server');
            setName(frame.headers.name)
            setConnected(true)
        }, frame => {
            // Will be invoked in case of error encountered at Broker
            // Bad login/passcode typically will cause an error
            // Complaint brokers will set `message` header with a brief message. Body may contain details.
            // Compliant brokers will terminate the connection after any error
            console.log('Broker reported error: ' + frame.headers['message']);
            console.log('Additional details: ' + frame.body);
        });
    }

    function subscribeToPrivatePlayerTopic() {
        console.log("Subscribed to private player topic")

        setPrivateSubscription(stompClient.subscribe("/topic/player/" + name, (data) => {
            setGameSession(JSON.parse(data.body))
            data.ack();
        }))
    }

    function subscribeToNewGameSession() {
        console.log("Subscribed to new private game topic")

        setGameSessionSubscription(stompClient.subscribe("/topic/game/" + gameSession.id, (data) => {

            let response = JSON.parse(data.body);

            if (response.game) {
                console.log("Received ActionResponse ", response.game)
                setGameSession(response.game)
            } else {
                console.log("Received GameSession ", response)
                setGameSession(response)
            }

            data.ack();
        }))
    }

    function joinGame() {
        console.log("Attempting to join game")
        stompClient.send("/app/join", null, JSON.stringify({ name: name }))
    }

    function showLoading() {
        if (gameSession == null) {
            return (
                <WaitingScreen />
            )
        }
    }

    function renderBoard() {
        if (gameSession) {
            return (
                <BoardComponent name={name} activePlayerId={gameSession.activePlayerId} id={gameSession.id} board={gameSession.board} sendBoardAction={sendBoardAction} />
            )
        }
    }

    function sendBoardAction(action) {
        stompClient.send("/app/act/" + gameSession.id, null, JSON.stringify(action))
    }

    function winnerMessage() {
        if (gameSession && gameSession.victoriousPlayerId != null) {
            return (
                <div className="center">
                    <h1 className="text-white mt-5 winner-message special-font">
                        {returnWinnerName()}
                    </h1>
                    <br></br>
                    <div style={{ margin: "1rem" }}>
                        <button className="play-btn m-auto p-4 btn-text special-font" onClick={playAgain}>Play Again</button>
                        <br />
                    </div>
                    <div style={{ margin: "1rem" }}>
                        <button className="home-btn m-auto p-4 btn-text special-font" onClick={() => setRedirect(true)}>HOME</button>
                    </div>
                </div>
            )
        }
    }

    function noGameWinnerMessage() {
        if (gameSession && gameSession.gameState === "ENDED" && !gameSession.victoriousPlayerId) {
            return (
                <div className="center">
                    <h1 className="text-white mt-5 no-winner-message special-font">
                        No Winner
                    </h1>
                    <br></br>
                    <div style={{ margin: "1rem" }}>
                        <button className="play-btn m-auto p-4 btn-text special-font" onClick={playAgain}>Play Again</button>
                    </div>
                    <br />
                    <div style={{ margin: "1rem" }}>
                        <button className="home-btn m-auto p-4 btn-text special-font" onClick={() => setRedirect(true)}>HOME</button>
                    </div>
                </div>
            )
        }
    }

    function returnWinnerName() {
        if (gameSession && gameSession.victoriousPlayerId === name) {
            return "You Win"
        } else {
            return "You Lost"
        }
    }

    function showOtherPlayerDisconnectedMessage() {
        if (gameSession && gameSession.gameState === 'ENDED_DISCONNECT') {
            return (
                <div className="center">
                    <h1 className="text-white mt-5 disconnected-text special-font">
                        Opponent disconnected from game
                    </h1>
                    <br></br>
                    <div style={{ margin: "1rem" }}>
                        <button className="play-btn m-auto p-4 btn-text special-font" onClick={playAgain}>Play Again</button>
                    </div>
                    <br />
                    <div style={{ margin: "1rem" }}>
                        <button className="home-btn m-auto p-4 btn-text special-font" onClick={() => setRedirect(true)}>HOME</button>
                    </div>
                </div>
            )
        }
    }

    function playAgain() {
        gameSessionSubscription.unsubscribe();
        setGameSession(null)
        setGameSessionSubscription(null)
    }

    function renderRedirectToHomePage() {
        if (redirect) {
            stompClient.disconnect(()=> console.log("Disconnected from websocket"))
            return <Navigate to="/home" replace />;
        }
        return null
    }

    return (
        <div className="text-white game-page-container">
            {renderRedirectToHomePage()}
            {showLoading()}
            {renderBoard()}
            {winnerMessage()}
            {noGameWinnerMessage()}
            {showOtherPlayerDisconnectedMessage()}
        </div>
    )

}