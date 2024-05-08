import React from 'react';
import { BrowserRouter} from 'react-router-dom';
import Rout from './Components/route'; 
function App() {
  return (
    <div className="App">
       <BrowserRouter>
       <Rout/>
      </BrowserRouter>
    </div>
  );
}

export default App;
