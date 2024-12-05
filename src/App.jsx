import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';
import { Button } from './components/ui/button';
import { Alert, AlertTitle } from './components/ui/alert';

const App = () => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [gameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState(null);
    const [isComputerTurn, setIsComputerTurn] = useState(true);
    const [recommendedMove, setRecommendedMove] = useState(null);

    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    const checkWinner = (squares) => {
        for (let combo of winningCombos) {
            const [a, b, c] = combo;
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return null;
    };

    const isBoardFull = (squares) => {
        return squares.every(square => square !== null);
    };

    const minimax = (squares, isMaximizing) => {
        const winner = checkWinner(squares);

        if (winner === 'X') return 10;
        if (winner === 'O') return -10;
        if (isBoardFull(squares)) return 0;

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < squares.length; i++) {
                if (squares[i] === null) {
                    squares[i] = 'X';
                    const score = minimax(squares, false);
                    squares[i] = null;
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < squares.length; i++) {
                if (squares[i] === null) {
                    squares[i] = 'O';
                    const score = minimax(squares, true);
                    squares[i] = null;
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    };

    const findBestMove = (squares, isComputer = true) => {
        let bestScore = isComputer ? -Infinity : Infinity;
        let bestMove = null;

        for (let i = 0; i < squares.length; i++) {
            if (squares[i] === null) {
                squares[i] = isComputer ? 'X' : 'O';
                const score = minimax(squares, !isComputer);
                squares[i] = null;

                if (isComputer && score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                } else if (!isComputer && score < bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }

        return bestMove;
    };

    const computerMove = () => {
        if (!isComputerTurn || gameOver) return;

        const bestMove = findBestMove(board, true);
        if (bestMove !== null) {
            const newBoard = [...board];
            newBoard[bestMove] = 'X';
            setBoard(newBoard);
            setIsComputerTurn(false);

            const winner = checkWinner(newBoard);
            if (winner) {
                setWinner(winner);
                setGameOver(true);
            } else if (isBoardFull(newBoard)) {
                setGameOver(true);
            } else {
                const recommendedMove = findBestMove(newBoard, false);
                setRecommendedMove(recommendedMove);
            }
        }
    };

    const handleClick = (index) => {
        if (board[index] || gameOver || isComputerTurn) return;

        const newBoard = [...board];
        newBoard[index] = 'O';
        setBoard(newBoard);
        setRecommendedMove(null);

        const winner = checkWinner(newBoard);
        if (winner) {
            setWinner(winner);
            setGameOver(true);
            return;
        }

        if (!isBoardFull(newBoard)) {
            setIsComputerTurn(true);
        } else {
            setGameOver(true);
        }
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setGameOver(false);
        setWinner(null);
        setIsComputerTurn(true);
        setRecommendedMove(null);
    };

    useEffect(() => {
        if (isComputerTurn) {
            setTimeout(computerMove, 500);
        }
    }, [isComputerTurn]);

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl">Tic Tac Toe</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-3 gap-2 mb-4">
                    {board.map((square, index) => (
                        <Button
                            key={index}
                            onClick={() => handleClick(index)}
                            className={`h-20 text-3xl font-bold ${recommendedMove === index ? 'ring-2 ring-green-500 ring-offset-2' : ''}`}
                            variant={square ? "secondary" : "outline"}
                            disabled={square !== null || gameOver || isComputerTurn}
                        >
                            {square}
                        </Button>
                    ))}
                </div>

                {gameOver && (
                    <Alert className="mb-4">
                        <AlertTitle>
                            {winner ? `Winner: ${winner === 'X' ? 'Computer' : 'Player'}` : 'Draw!'}
                        </AlertTitle>
                    </Alert>
                )}

                {!gameOver && recommendedMove !== null && !isComputerTurn && (
                    <Alert className="mb-4">
                        <AlertTitle>
                            Tip: Place your O in the green-highlighted square
                        </AlertTitle>
                    </Alert>
                )}

                <Button
                    onClick={resetGame}
                    className="w-full"
                >
                    New Game
                </Button>
            </CardContent>
        </Card>
    );
};

export default App;