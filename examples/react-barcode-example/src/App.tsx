import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Barcode } from '@darthmaim/react-barcode/lib/index';

function App() {
  return (
    <div className="App">
      <Barcode value="4003994155486"/>
    </div>
  );
}

export default App;
