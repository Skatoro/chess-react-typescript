import React, {useEffect, useState} from 'react';
import './App.css';
import BoardComponent from "./components/BoardComponent";
import {Board} from "./models/Board";
import {Player} from "./models/Player";
import {Colors} from "./models/Colors";
import LostFigures from "./components/LostFigures";
import Timer from "./components/Timer";
import MoveHistory from "./components/MoveHistory";

const App = () => {
    const [board, setBoard] = useState(new Board());
    const [whitePlayer, setWhitePlayer] = useState(new Player(Colors.WHITE));
    const [blackPlayer, setBlackPlayer] = useState(new Player(Colors.BLACK));
    const [currentPlayer, setCurrentPlayer] = useState<Player | null>(whitePlayer)
    const [winner, setWinner] = useState<Player | null>(null);
    const [firstMoveMade, setFirstMoveMade] = useState(false);

    useEffect(() => {
        restart();
    }, [])

    useEffect(() => {
        if (!winner) return;

        for (let row of board.cells) {
            for (let cell of row) {
                if (cell.figure) {
                    cell.figure.moveable = false;
                }
            }
        }
    }, [winner])

    function restart() {
        setFirstMoveMade(false);
        setCurrentPlayer(whitePlayer);
        setWinner(null)

        const newBoard = new Board();
        newBoard.initCells();
        newBoard.addFigures();
        newBoard.setWinner = setWinner;
        newBoard.whitePlayer = whitePlayer;
        newBoard.blackPlayer = blackPlayer;
        newBoard.setFirstMoveMade = setFirstMoveMade;

        setBoard(newBoard);
    }

    function swapPlayer() {
        setCurrentPlayer(currentPlayer?.color === Colors.WHITE ? blackPlayer : whitePlayer)
    }

    return (
        <div className="app">
            <div className={"boardContainer"}>
                <LostFigures figures={board.lostWhiteFigures}/>
                <BoardComponent
                    board={board}
                    setWinner={setWinner}
                    setBoard={setBoard}
                    currentPlayer={currentPlayer}
                    swapPlayer={swapPlayer}
                />
                {!!winner && <div className={"winScreen"}>Winner: {winner.color}</div>}
                <LostFigures figures={board.lostBlackFigures}/>
            </div>

            <div className="sidebar">
                <Timer
                    restart={restart}
                    currentPlayer={currentPlayer}
                    winner={winner}
                    setWinner={setWinner}
                    whitePlayer={whitePlayer}
                    blackPlayer={blackPlayer}
                    firstMoveMade={firstMoveMade}
                />
                <MoveHistory moveHistory={board.moveHistory}/>
            </div>
        </div>
    );
}

export default App;
