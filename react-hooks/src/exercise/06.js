// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import React, {useState, useEffect} from 'react'
import {ErrorBoundary} from 'react-error-boundary'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {PokemonForm, fetchPokemon, PokemonInfoFallback, PokemonDataView} from '../pokemon'

function PokemonInfo ({pokemonName}) {
  // 🐨 Have state for the pokemon (null)
  const [state, setState] = useState({
    pokemon: null,
    status: 'idle',
    error: null,
  })
  // const [pokemon, setPokemon] = useState(null)
  // const [status, setStatus] = useState('idle')
  // const [error, setError] = useState(null)

  // 🐨 use React.useEffect where the callback should be called whenever the
  // pokemon name changes.
  useEffect(() => {
    // 💰 if the pokemonName is falsy (an empty string) then don't bother making the request (exit early).
    if (!pokemonName) {
      return
    }

    // 🐨 before calling `fetchPokemon`, make sure to update the loading state
    // setStatus('pending')
    setState({
      status: 'pending',
    })

    async function callFetchPokemon () {
      console.log('fetch Pokemon')

      try {
        const data = await fetchPokemon(pokemonName)
        console.log('res', data)

        // 💰 Use the `fetchPokemon` function to fetch a pokemon by its name:
        //   fetchPokemon('Pikachu').then(
        //     pokemonData => { /* update all the state here */},
        //   )
        // setPokemon(data)
        // setStatus('resolved')
        setState({
          pokemon: data,
          status: 'resolved',
        })
      } catch (e) {
        // setError(e)
        // setStatus('rejected')
        // setPokemon(null)
        setState({
          pokemon: null,
          status: 'rejected',
          error: e,
        })
      }

    }

    // noinspection JSIgnoredPromiseFromCall
    callFetchPokemon()

  }, [pokemonName])

  const {status, pokemon, error} = state
  switch (status) {
    case 'rejected':
      // return <div role="alert">
      //   There was an error: <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      // </div>
      throw Error(error)
    case 'resolved':
      return <PokemonDataView pokemon={pokemon}/>

    case 'pending':
      return <PokemonInfoFallback name={pokemonName}/>

    case 'idle':
      return <p>Submit a pokemon</p>

    default:
      return <p>Impossible</p>
  }

}

function ErrorFallback ({error}) {
  console.log('error', error)

  return (
    <div role="alert">
      There was an error: ErrorFallback{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
    </div>
  )
}

function App () {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit (newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit}/>
      <hr/>
      <div className="pokemon-info">
        <ErrorBoundary key={pokemonName} resetKeys={[pokemonName]} FallbackComponent={ErrorFallback}>
          <PokemonInfo pokemonName={pokemonName}/>
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
