import React from 'react';
import Pages from './Pages';
import { $Action, useDispatch } from './Redux';

function App() {
  const dispatch = useDispatch();

  const onClick = (path: string) => () => {
    dispatch($Action.routerActions.push(path));
  };

  return (
    <div className="App">
      <div>
        <button onClick={onClick('/')}>home</button>
        <button onClick={onClick('/about')}>about</button>
        <button onClick={onClick('/test')}>not found</button>
      </div>
      <Pages />
    </div>
  );
}

export default App;