// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import React, {useEffect, useRef} from 'react'

function useLocalStorageState (key, defaultData = '', {
  serialize = JSON.stringify,
  deserialize = JSON.parse,
} = {}) {
  const [data, setData] = React.useState(
    () => {
      const valueInLocalStorage = window.localStorage.getItem(key)

      if (valueInLocalStorage) {
        try {
          return deserialize(valueInLocalStorage)
        } catch (error) {
          window.localStorage.removeItem(key)
        }
      }

      // in-case the defaultData being passed in is the result of an expensive function,
      // this gives the option of passing in a function just like in React.useState we did earlier
      return typeof defaultData === 'function' ? defaultData() : defaultData
    },
  )

  // USE CASE - user changes key
  // Keep track of the key as prevKey in-case the user changes the key
  // then we get rid of the old key and use the new one
  const prevKeyRef = useRef(key)

  useEffect(() => {
    const prevKey = prevKeyRef.current

    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey)
    }
    prevKeyRef.current = key
    window.localStorage.setItem(key, serialize(data))
  }, [data, key, serialize])

  return [data, setData]
}

function Board ({squares, handleClick}) {

  function renderSquare (i) {

    return (
      <button className="square" onClick={() => handleClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      {/* 🐨 put the status here */}
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>

    </div>
  )
}

function Game () {
  // 🐨 squares is the state for this component. Add useState for squares
  // We keep track of our history by putting a snapshot of each step into an array all on its own
  // We also keep track of what step we are on starting with Zero, which works well as Arrays are zero based
  const [history, setHistory] = useLocalStorageState('tictactoe', [Array(9).fill(null)])
  const [step, setStep] = React.useState(0)

  // Current step finds the snapshot that is currently selected by using setStep
  const currentSquares = history[step]
  const nextValue = calculateNextValue(currentSquares)
  const winner = calculateWinner(currentSquares)
  const status = calculateStatus(winner, currentSquares, nextValue)

  // This is the function your square click handler will call. `square` should
  // be an index. So if they click the center square, this will be `4`.
  function selectSquare (square) {
    // 🐨 first, if there's already winner or there's already a value at the
    // given square index (like someone clicked a square that's already been
    // clicked), then return early so we don't make any state changes
    if (winner || currentSquares[square]) {
      return
    }

    // slice in to the array the future step and remove everything else behind it
    console.log('history before', history)
    // grab items from the array starting at Zero to the currentStep +1 (+1 so we grab the correct amount I think)
    // if you want arrays 0-2, or 0,1, and 2 slice is zero based so you need to say 2 + 1
    const newHistory = history.slice(0, step + 1)
    console.log('newHistory', newHistory)

    // Next move for the current step
    const currentSquaresCopy = [...currentSquares]
    currentSquaresCopy[square] = nextValue

    // take the new sliced history, and add the next snapshot after it
    setHistory([...newHistory, currentSquaresCopy])

    // total steps, or rather the next step added to state
    setStep(newHistory.length)
  }

  const handleButton = (i) => () => {
    setStep(i)
  }

  function restart () {
    setStep(0)
    setHistory([Array(9).fill(null)])
  }

  const moves = history.map((item, index) => {
    const desc = index ? `Go to move #${index}` : 'Go to game start'
    return (
      <li>
        <button key={`Step ${index}`}
                disabled={index === step}
                onClick={handleButton(index)}>{desc}</button>
      </li>
    )
  })
  return (
    <div className="game">
      <div className="game-board">
        <div className="status">STATUS: {status}</div>
        <Board squares={currentSquares} handleClick={selectSquare}/>
        <button className="restart" onClick={restart}>
          restart
        </button>
        <ol>
          {moves}
        </ol>
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus (winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
      ? `Scratch: Cat's game`
      : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue (squares) {
  const xSquaresCount = squares.filter(r => r === 'X').length
  const oSquaresCount = squares.filter(r => r === 'O').length
  return oSquaresCount === xSquaresCount ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner (squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App () {
  return <Game/>
}

export default App
