import { createElement, useState, useLayoutEffect, useCallback, templateResult } from '/jsx2/jsx2';
import logo from './logo.png';
import './App.css';

function Seconds({ init }) {
  // Create the count state.
  const [count, setCount] = useState(0);
  // Create the counter (+1 every second).
  useLayoutEffect(() => {
    const timer = setInterval(() => {
      console.log('updating');
      setCount((count) => count + 1);
    }, 1000);
    return () => {
      console.log('cleanup');
      clearInterval(timer);
    };
  }, [init]);

  return (
    <p>
      Page has been open for <code>{count}</code> seconds.
    </p>
  );
}

function App() {
  const [enabled, toggle] = useState(true);
  const [num, setNum] = useState(0);
  const onChangeNum = useCallback((event) => {
    setNum(event.target.value);
  });
  const onChangeUnmount = useCallback(() => {
    toggle(!enabled);
  });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div>
          <input type="number" value={num} onChange={onChangeNum} />
        </div>
        <div>
          <label for="unmount">Unmount? </label>
          <input id="unmount" type="checkbox" checked={enabled} onChange={onChangeUnmount} />
        </div>
        {
          enabled ? <Seconds init={num}/> : null
        }
      </header>
    </div>
  );
}

export default App;
