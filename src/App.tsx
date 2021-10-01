import { useState } from "react";
import { TestComp } from "~/Components";
import { increment } from "~/Common";

function App() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(increment(count));
  };

  return (
    <div className="App">
      <TestComp count={count} />
      <button onClick={handleClick}>increment</button>
    </div>
  );
}

export default App;
