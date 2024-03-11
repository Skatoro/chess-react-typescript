import React, {FC, useEffect, useRef, useState} from 'react';
import {Player} from "../models/Player";
import {Colors} from "../models/Colors";
import MoveHistory from "./MoveHistory";

interface TimerProps {
    currentPlayer: Player | null;
    restart: () => void;
    setWinner: (player: Player) => void;
    blackPlayer: Player | null;
    whitePlayer: Player | null;
    firstMoveMade: boolean;
    winner: Player | null;
}

const Timer: FC<TimerProps> = ({
                                   currentPlayer,
                                   restart,
                                   setWinner,
                                   blackPlayer,
                                   whitePlayer,
                                   firstMoveMade,
                                   winner
                               }) => {
    const BLACK_TIME_AMOUNT = 180; // s
    const WHITE_TIME_AMOUNT = 180; // s
    const [blackTime, setBlackTime] = useState(BLACK_TIME_AMOUNT * 10);
    const [whiteTime, setWhiteTime] = useState(WHITE_TIME_AMOUNT * 10);
    const [blackIconRotation, setBlackIconRotation] = useState(90);
    const [whiteIconRotation, setWhiteIconRotation] = useState(90);
    const timer = useRef<null | ReturnType<typeof setInterval>>(null);

    useEffect(() => {
        startTimer()
    }, [currentPlayer, firstMoveMade, winner])

    useEffect(() => {
        if (!firstMoveMade) {
            setBlackIconRotation(90)
            setWhiteIconRotation(90)
        }
    }, [firstMoveMade])

    useEffect(() => {
        if (blackTime % 10 === 0 && firstMoveMade) {
            rotateBlackIcon()
        }
        if (blackTime === 0) {
            endGame(whitePlayer)
        }
    }, [blackTime])

    useEffect(() => {
        if (whiteTime % 10 === 0 && firstMoveMade) {
            rotateWhiteIcon()
        }
        if (whiteTime === 0) {
            endGame(blackPlayer)
        }
    }, [whiteTime])

    function startTimer() {
        if (timer.current) {
            clearInterval(timer.current)
        }

        if (firstMoveMade && !winner) {
            const callback = currentPlayer?.color === Colors.WHITE ? decrementWhiteTimer : decrementBlackTimer;
            timer.current = setInterval(callback, 100)
        }
    }

    function endGame(winnerPlayer: Player | null) {
        if (winnerPlayer) {
            setWinner(winnerPlayer)
        }

        if (timer.current) {
            clearInterval(timer.current)
        }
    }

    function decrementBlackTimer() {
        setBlackTime(prev => prev - 1)
    }

    function decrementWhiteTimer() {
        setWhiteTime(prev => prev - 1)
    }

    function rotateBlackIcon() {
        setBlackIconRotation(prev => prev + 90)
    }

    function rotateWhiteIcon() {
        setWhiteIconRotation(prev => prev + 90)
    }

    function handleRestart() {
        setWhiteTime(WHITE_TIME_AMOUNT * 10);
        setBlackTime(WHITE_TIME_AMOUNT * 10);
        restart();
    }

    let whiteMinutes = Math.floor(whiteTime / 600);
    let whiteSeconds: string = Math.floor((whiteTime - whiteMinutes * 600) / 10).toString();
    let whiteMilliseconds = Math.floor(whiteTime % 10);
    let blackMinutes = Math.floor(blackTime / 600);
    let blackSeconds: string = Math.floor((blackTime - blackMinutes * 600) / 10).toString();
    let blackMilliseconds = Math.floor(blackTime % 10)
    if (Number(whiteSeconds) < 10) {
        whiteSeconds = "0" + whiteSeconds
    }
    if (Number(blackSeconds) < 10) {
        blackSeconds = "0" + blackSeconds
    }
    return (
        <div className={"timerContainer"}>
            <div className={`timer timerBlack ${currentPlayer?.color !== Colors.BLACK && "opacity50"}`}>
                {currentPlayer?.color === Colors.BLACK &&
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"
                         className={`clockIcon`}
                         style={{transform: `rotate(${blackIconRotation}deg)`}}
                    >
                        <path
                            d="M5.48,9a.93.93,0,0,0-.3.71v.58a.94.94,0,0,0,.3.71,1,1,0,0,0,.71.3h4.58a1,1,0,0,0,.71-.3.94.94,0,0,0,.29-.71V9.7A.92.92,0,0,0,11.48,9a1,1,0,0,0-.71-.27H6.19A1,1,0,0,0,5.48,9Z"></path>
                        <path
                            d="M19.22,6.1a9.9,9.9,0,0,0-2.14-3.18A10.23,10.23,0,0,0,13.9.78,9.76,9.76,0,0,0,10,0,9.86,9.86,0,0,0,6.1.78,10,10,0,0,0,.78,6.1,9.81,9.81,0,0,0,0,10a9.81,9.81,0,0,0,.78,3.9A10,10,0,0,0,6.1,19.22,9.86,9.86,0,0,0,10,20a9.76,9.76,0,0,0,3.89-.78,10.23,10.23,0,0,0,3.18-2.14,9.9,9.9,0,0,0,2.14-3.18A9.81,9.81,0,0,0,20,10,9.81,9.81,0,0,0,19.22,6.1ZM17.07,13a7.65,7.65,0,0,1-1.65,2.42A7.81,7.81,0,0,1,13,17.06a7.46,7.46,0,0,1-3,.6,7.51,7.51,0,0,1-3-.6,7.74,7.74,0,0,1-2.43-1.65A8,8,0,0,1,2.94,13a7.46,7.46,0,0,1-.6-3,7.46,7.46,0,0,1,.6-3A8,8,0,0,1,4.58,4.59,7.74,7.74,0,0,1,7,2.94a7.51,7.51,0,0,1,3-.6,7.45,7.45,0,0,1,3,.6,7.74,7.74,0,0,1,2.43,1.65A7.65,7.65,0,0,1,17.07,7a7.46,7.46,0,0,1,.6,3A7.46,7.46,0,0,1,17.07,13Z"></path>
                    </svg>}
                <span className={`${currentPlayer?.color !== Colors.BLACK && "opacity80"}`}>
                    {blackMinutes}:{blackSeconds}.{blackMilliseconds}
                </span>
            </div>

            <div className={"moveHistoryPlaceholder"}></div>

            <button onClick={handleRestart} className={"restartTimer"}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 26">
                    <path
                        d="M13.5 2c-5.621 0-10.211 4.443-10.475 10h-3.025l5 6.625 5-6.625h-2.975c.257-3.351 3.06-6 6.475-6 3.584 0 6.5 2.916 6.5 6.5s-2.916 6.5-6.5 6.5c-1.863 0-3.542-.793-4.728-2.053l-2.427 3.216c1.877 1.754 4.389 2.837 7.155 2.837 5.79 0 10.5-4.71 10.5-10.5s-4.71-10.5-10.5-10.5z"/>
                </svg>
                <span>Restart</span>
            </button>

            <div className={`timer timerWhite ${currentPlayer?.color !== Colors.WHITE && "opacity50"}`}>
                {currentPlayer?.color === Colors.WHITE &&
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"
                         className={`clockIcon`}
                         style={{transform: `rotate(${whiteIconRotation}deg)`}}
                    >
                        <path
                            d="M5.48,9a.93.93,0,0,0-.3.71v.58a.94.94,0,0,0,.3.71,1,1,0,0,0,.71.3h4.58a1,1,0,0,0,.71-.3.94.94,0,0,0,.29-.71V9.7A.92.92,0,0,0,11.48,9a1,1,0,0,0-.71-.27H6.19A1,1,0,0,0,5.48,9Z"></path>
                        <path
                            d="M19.22,6.1a9.9,9.9,0,0,0-2.14-3.18A10.23,10.23,0,0,0,13.9.78,9.76,9.76,0,0,0,10,0,9.86,9.86,0,0,0,6.1.78,10,10,0,0,0,.78,6.1,9.81,9.81,0,0,0,0,10a9.81,9.81,0,0,0,.78,3.9A10,10,0,0,0,6.1,19.22,9.86,9.86,0,0,0,10,20a9.76,9.76,0,0,0,3.89-.78,10.23,10.23,0,0,0,3.18-2.14,9.9,9.9,0,0,0,2.14-3.18A9.81,9.81,0,0,0,20,10,9.81,9.81,0,0,0,19.22,6.1ZM17.07,13a7.65,7.65,0,0,1-1.65,2.42A7.81,7.81,0,0,1,13,17.06a7.46,7.46,0,0,1-3,.6,7.51,7.51,0,0,1-3-.6,7.74,7.74,0,0,1-2.43-1.65A8,8,0,0,1,2.94,13a7.46,7.46,0,0,1-.6-3,7.46,7.46,0,0,1,.6-3A8,8,0,0,1,4.58,4.59,7.74,7.74,0,0,1,7,2.94a7.51,7.51,0,0,1,3-.6,7.45,7.45,0,0,1,3,.6,7.74,7.74,0,0,1,2.43,1.65A7.65,7.65,0,0,1,17.07,7a7.46,7.46,0,0,1,.6,3A7.46,7.46,0,0,1,17.07,13Z"></path>
                    </svg>}
                <span className={`${currentPlayer?.color !== Colors.WHITE && "opacity50"}`}>
                    {whiteMinutes}:{whiteSeconds}.{whiteMilliseconds}
                </span>
            </div>
        </div>
    );
};

export default Timer;