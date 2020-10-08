// Basic Forms
// http://localhost:3000/isolated/exercise/06.js

import React, {useRef, useState} from 'react'

function UsernameForm ({onSubmitUsername}) {
  const InputRef = useRef('')
  const [state, setState] = useState('')
  // 🐨 add a submit event handler here (`handleSubmit`).
  // 💰 Make sure to accept the `event` as an argument and call
  // `event.preventDefault()` to prevent the default behavior of form submit
  // events (which refreshes the page).
  function handleSubmit (e) {
    e.preventDefault()
    // const userName = e.target.elements.usernameInput.value
    const userName = InputRef.current.value
    console.log('userName', userName)
    onSubmitUsername(userName)
  }

  // 🐨 get the value from the username input (using whichever method
  // you prefer from the options mentioned in the instructions)
  // 💰 For example: event.target.elements[0]
  // 🐨 Call `onSubmitUsername` with the value of the input

  // 🐨 add the onSubmit handler to the <form> below

  // 🐨 make sure to associate the label to the input by specifying an `id` on
  // the input and a matching value as an `htmlFor` prop on the label.
  // function isLowerCase (value) {
  //   return value === value.toLowerCase()
  // }

  // EC -
  function handleInputChange (e) {
    const value = e.target.value
    setState(value.toLowerCase())
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor={'Username'}>Username:</label>
        <input ref={InputRef} id="Username" type="text" name={'usernameInput'} value={state}
               onChange={handleInputChange}/>
      </div>
      <button type="submit">Submit</button>
    </form>
  )
}

function App () {
  const onSubmitUsername = username => alert(`You entered: ${username}`)
  return <UsernameForm onSubmitUsername={onSubmitUsername}/>
}

export default App
