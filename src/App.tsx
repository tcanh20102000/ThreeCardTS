
import React from 'react';
import IMAGE from './logo512.png';
import './styles.scss';
import { ClickCounter } from './components/ClickCounter';
import WholeApp from './pages/WholeApp';

function App() {
  return(
    <>
      <WholeApp />
    </>
  );
  // return (
  //   <>
  //       <div>TypeScript Webpack - {process.env.NODE_ENV} {process.env.name}</div>
  //       <img src={IMAGE} alt='react-logo' width="300" height="200"></img>
  //       <ClickCounter/>
  //   </>
  // )
}

export default App