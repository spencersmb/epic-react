// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import React, {useEffect, useRef} from 'react'

// Custom Hook to store any data
// serialize and deserialize are part of an options object that is destructured here

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

    if(prevKey !== key ){
      window.localStorage.removeItem(prevKey)
    }
    prevKeyRef.current = key
    window.localStorage.setItem(key, serialize(data))
  }, [data, key, serialize])

  return [data, setData]
}

function Greeting ({initialName = ''}) {
  // 🐨 initialize the state to the value from localStorage
  // 💰 window.localStorage.getItem('name') || initialName
  const [data, setData] = useLocalStorageState('kcd_name', {name: initialName})

  // 🐨 Here's where you'll use `React.useEffect`.
  // The callback should set the `name` in localStorage.
  // 💰 window.localStorage.setItem('name', name)
  function handleChange (event) {
    setData({name: event.target.value})
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={data.name} onChange={handleChange} id="name"/>
      </form>
      {'name' ? <strong>Hello {data.name}</strong> : 'Please type your name'}
    </div>
  )
}

function App () {
  return <Greeting/>
}

export default App
