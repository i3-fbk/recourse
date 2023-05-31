import React, {Component} from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import InitPage from './components/initPage/initPage';
import Welcome from './components/newPlan/newPlan';
import SuccessPage from './components/SuccessPage/SuccessPage';
import LoginPage from './components/loginPage/login';

class App extends Component {
render() {

  return (
    <div className="App">
     <Router>
      <Routes>
        <Route path="/recourse" Component={Welcome} />
        <Route path="/" exact Component={LoginPage} />
        <Route path="/form" exact Component={InitPage} />
        <Route path="success" Component={SuccessPage} />
      </Routes>
     </Router>
      <header className="App-header">
      </header>
    </div>
  );
}
  
}

export default App;