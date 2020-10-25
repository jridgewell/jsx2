import { createElement, useState, useEffect, useRef, templateResult } from '/jsx2/jsx2';
import logo from './logo.png';
import './App.css';

function Seconds() {
  // Create the count state.
  const [count, setCount] = useState(0);
  // Create the counter (+1 every second).
  useEffect(() => {
    const timer = setInterval(() => {
      console.log('updating');
      setCount((count) => count + 1);
    }, 1000);
    return () => {
      console.log('cleanup');
      clearInterval(timer);
    };
  }, []);

  return (
    <p>
      Page has been open for <code>{count}</code> seconds.
    </p>
  );
}

function Enabled({ enabled, as: Comp }) {
  console.log(enabled);
  if (enabled) {
    return <Comp />;
  }
}

function App() {
  const [enabled, toggle] = useState(true);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <input
          type="checkbox"
          checked={enabled}
          onChange={() => {
            toggle(!enabled);
          }}
        />
        <Enabled enabled={enabled} as={Seconds} />
      </header>
    </div>
  );
}

export default App;
