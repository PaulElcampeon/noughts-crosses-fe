import React from 'react';
import '../App.css';

export default function BoardCellComponent({symbol, playerId, activePlayerId, gameId, row, column, sendBoardAction}) {

    function clickHandler(e) {
        if (playerId !== activePlayerId) return;
        sendBoardAction({ playerId: playerId, gameId: gameId, position: { row: row, column: column } })
    }

    return (
        <div className="board-cell" onClick={clickHandler}>
            <div className={symbol}></div>
        </div>
    )
}
