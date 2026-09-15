import React, { useState } from 'react';

const winCombos = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

export default function MiniGameModal({ onClose }) {
  const [name, setName] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [board, setBoard] = useState(Array(9).fill(''));
  const [playerScore, setPlayerScore] = useState(0);
  const [compScore, setCompScore] = useState(0);
  const [status, setStatus] = useState('Your Turn (X)');
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameOver, setGameOver] = useState(false);

  const checkWinner = (currentBoard, mark) => {
    return winCombos.some(combo => combo.every(idx => currentBoard[idx] === mark));
  };

  const handleCellClick = (idx) => {
    if (board[idx] || !isPlayerTurn || gameOver) return;

    const newBoard = [...board];
    newBoard[idx] = 'X';
    setBoard(newBoard);

    if (checkWinner(newBoard, 'X')) {
      setPlayerScore(prev => prev + 1);
      setStatus('You Win! 🎉');
      setGameOver(true);
      return;
    }

    if (!newBoard.includes('')) {
      setStatus('Draw Match! 🤝');
      setGameOver(true);
      return;
    }

    setIsPlayerTurn(false);
    setStatus('AI Thinking...');

    setTimeout(() => {
      const emptyIndices = newBoard.map((v, i) => (v === '' ? i : null)).filter(v => v !== null);
      if (emptyIndices.length > 0) {
        const rand = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        newBoard[rand] = 'O';
        setBoard([...newBoard]);

        if (checkWinner(newBoard, 'O')) {
          setCompScore(prev => prev + 1);
          setStatus('AI Wins! 🤖');
          setGameOver(true);
          setIsPlayerTurn(true);
          return;
        }

        if (!newBoard.includes('')) {
          setStatus('Draw Match! 🤝');
          setGameOver(true);
          setIsPlayerTurn(true);
          return;
        }
      }
      setIsPlayerTurn(true);
      setStatus('Your Turn (X)');
    }, 450);
  };

  const resetBoard = () => {
    setBoard(Array(9).fill(''));
    setIsPlayerTurn(true);
    setGameOver(false);
    setStatus('Your Turn (X)');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} data-cursor="disable">
        <button className="modal-close" onClick={onClose}>✕</button>

        <h3 style={{ margin: '0 0 15px', color: '#5eead4', fontSize: '20px' }}>🎮 Mini-Game Tic-Tac-Toe</h3>

        {!gameStarted ? (
          <div>
            <p style={{ fontSize: '13px', color: '#aaa', marginBottom: '15px' }}>
              Enter your name to challenge the AI:
            </p>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your Name"
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                color: '#fff',
                marginBottom: '15px'
              }}
            />
            <button
              onClick={() => name.trim() && setGameStarted(true)}
              style={{
                width: '100%',
                padding: '12px',
                background: '#5eead4',
                color: '#000',
                fontWeight: 600,
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Start Game
            </button>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontWeight: 600 }}>
              <span style={{ color: '#5eead4' }}>{name}: {playerScore}</span>
              <span style={{ color: '#ff5555' }}>AI: {compScore}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '15px' }}>
              {board.map((cell, i) => (
                <button
                  key={i}
                  onClick={() => handleCellClick(i)}
                  style={{
                    aspectRatio: '1',
                    fontSize: '28px',
                    fontWeight: 700,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: cell === 'X' ? '#5eead4' : '#ff5555',
                    cursor: 'pointer'
                  }}
                >
                  {cell}
                </button>
              ))}
            </div>

            <p style={{ textAlign: 'center', fontWeight: 500, color: '#fff', marginBottom: '15px' }}>
              {status}
            </p>

            <button
              onClick={resetBoard}
              style={{
                width: '100%',
                padding: '10px',
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
