import React, {Component} from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import InitPage from './components/initPage/initPage';
import Welcome from './components/newPlan/newPlan';

class App extends Component {
render() {

  return (
    <div className="App">
     <Router>
      <Routes>
        <Route path="/recourse" Component={Welcome} />
        <Route path="/" exact Component={InitPage} />
      </Routes>
    </Router>
      <header className="App-header">
      {/* <p className="App-intro">{this.state.data}</p> */}
      </header>
    </div>
  );
}
  
}

export default App;
