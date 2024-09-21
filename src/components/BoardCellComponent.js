import React from 'react';
import '../App.css';

export default function BoardCellComponent({playerId, gameId, row, column, sendBoardAction}) {

    function clickHandler(e) {
        console.log(e)
        // sendBoardAction({ playerId: playerId, gameId: gameId, position: { row: row, column: column } })
    }

    return (
        <div className="board-cell" onClick={clickHandler}></div>
    )
}
