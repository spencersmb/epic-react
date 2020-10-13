// useCallback: custom hooks
// http://localhost:3000/isolated/exercise/02.js

import React from 'react'
import {fetchPokemon, PokemonDataView, PokemonErrorBoundary, PokemonForm, PokemonInfoFallback} from '../pokemon'

// 🐨 this is going to be our generic asyncReducer
function asyncReducer (state, action) {
  switch (action.type) {
    case 'pending': {
      // 🐨 replace "pokemon" with "data"
      return {status: 'pending', data: null, error: null}
    }
    case 'resolved': {
      // 🐨 replace "pokemon" with "data" (in the action too!)
      return {status: 'resolved', data: action.data, error: null}
    }
    case 'rejected': {
      // 🐨 replace "pokemon" with "data"
      return {status: 'rejected', data: null, error: action.error}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

const useSafeDispatch = (unsafeDispatch) => {
  // keep track of is mounted
  const isMountedRef = React.useRef(false)

  React.useEffect(() => {
    isMountedRef.current = true

    return () => {
      isMountedRef.current = false
    }
  }, [])

  // convert unsafeDispatch to a safe version
  return React.useCallback((...args) => {
    if (isMountedRef.current) {
      unsafeDispatch(...args)
    }
  }, [unsafeDispatch])
}

const useAsync = (initialState) => {
  // 🐨 so your job is to create a useAsync function that makes this work.
  const [state, unsafeDispatch] = React.useReducer(asyncReducer, {
    status: 'idle',
    data: null,
    error: null,
    ...initialState,
  })

  const dispatch = useSafeDispatch(unsafeDispatch)

  const run = React.useCallback((promise) => {
    dispatch({type: 'pending'})
    promise.then(
      data => {
        dispatch({type: 'resolved', data})
      },
      error => {
        dispatch({type: 'rejected', error})
      },
    )
  }, [dispatch])

  return {...state, run}
}

function PokemonInfo ({pokemonName}) {
  // 🐨 move both the useReducer and useEffect hooks to a custom hook called useAsync
  // here's how you use it:

  const {data: pokemon, status, error, run} = useAsync({
    status: pokemonName ? 'pending' : 'idle',
  })

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }
    return run(fetchPokemon(pokemonName, 3000))
  }, [pokemonName, run])

  React.useEffect(() => {
    return () => {
      console.log('unmounted')
    }
  }, [])

  if (status === 'idle' || !pokemonName) {
    return <p>Submit a pokemon</p>
  } else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName}/>
  } else if (status === 'rejected') {
    throw error
  } else if (status === 'resolved') {
    return <PokemonDataView pokemon={pokemon}/>
  }

  throw new Error('This should be impossible')
}

function App () {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit (newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset () {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit}/>
      <hr/>
      <div className="pokemon-info">
        <PokemonErrorBoundary onReset={handleReset} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName}/>
        </PokemonErrorBoundary>
      </div>
    </div>
  )
}

export default App
