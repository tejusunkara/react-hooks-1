// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function useLocalStorageState(
  storageKey,
  defaultValue = '',
  { serialize = JSON.stringify , deserialize = JSON.parse} = {}
  ) {
  const initialValue = () => {
    const localStorageValue = window.localStorage.getItem(storageKey);
    if (localStorageValue) {
      try {
        return deserialize(localStorageValue);
      } catch (error) {
        console.log(error);
        window.localStorage.removeItem(storageKey);
      }
    }

    return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
  };
  const [state, setState] = React.useState(initialValue);

  const previous = React.useRef(storageKey);

  React.useEffect(() => {
    const previousValue = previous.current;
    if (previousValue !== storageKey) {
      window.localStorage.removeItem(previousValue);
    }
    previous.current = storageKey;
    window.localStorage.setItem(storageKey, serialize(state));
  }, [storageKey, state, setState]);

  return [state, setState];
}

function Greeting({initialName = ''}) {
  // 🐨 initialize the state to the value from localStorage
  // 💰 window.localStorage.getItem('name') ?? initialName
  // const initialValue = () => {
  //   return window.localStorage.getItem('name') ?? initialName
  // }
  // const [name, setName] = React.useState(initialValue);

  // // 🐨 Here's where you'll use `React.useEffect`.
  // // The callback should set the `name` in localStorage.
  // // 💰 window.localStorage.setItem('name', name)
  // React.useEffect(() => {
  //   window.localStorage.setItem('name', name);
  // }, [name]);

  const [name, setName] = useLocalStorageState('name', initialName);

  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
