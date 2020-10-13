// useReducer: simple Counter
// http://localhost:3000/isolated/exercise/01.js

import React from 'react'

const countReducer = (state, action) => {
  console.log('state', state)
  console.log('action', action)

  switch (action.type) {
    case 'INCREMENT':
      return {
        ...state,
        count: state.count + action.step,
      }

    default:
      return state
  }
  // return [state, setState ] - action is the parameter passed to setState
  // return {...state, ...(typeof action === 'function' ? action(state) : action)}
}

function Counter ({initialCount = 0, step = 1}) {
  // 🐨 replace React.useState with React.useReducer.
  // 💰 React.useReducer(countReducer, initialCount)
  // const [count, setCount] = React.useState(initialCount)
  const [state, dispatch] = React.useReducer(countReducer, {count: initialCount})
  const {count} = state
  // 💰 you can write the countReducer function so you don't have to make any
  // changes to the next two lines of code! Remember:
  // The 1st argument is called "state" - the current value of count
  // The 2nd argument is called "action" - the value passed to setCount
  const increment = () => dispatch({type: 'INCREMENT', step})
  return <button onClick={increment}>{count}</button>
}

function App () {
  return <Counter/>
}

export default App
