import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import InitPage from "./components/initPage/initPage";
import Welcome from "./components/newPlan/newPlan";
import SuccessPage from "./components/SuccessPage/SuccessPage";
import LoginPagePersonaOne from "./components/loginPage/loginPersona1";
import LoginPagePersonaTwo from "./components/loginPage/loginPersona2";
import ConfigurationPage from "./components/configurationFeatures/configurationFeatures";
import PlanAccepted from "./components/planAccepted/planAccepted";
import MessagePage from "./components/messagePage/messagePage";
import ExitPage from "./components/exitPage/exitPage";

class App extends Component {
	render() {
		return (
			<div className="App">
				<Router>
					<Routes>
						<Route path="/recourse" Component={Welcome} />
						<Route path="/persona1" exact Component={LoginPagePersonaOne} />
						<Route path="/persona2" exact Component={LoginPagePersonaTwo} />
						<Route path="/form"  Component={InitPage} />
						<Route path="success" Component={SuccessPage} />
						<Route
							path="/recourse/modify/"
							Component={ConfigurationPage}
						/>
						<Route
							path="/recourse/keepThePlan/"
							Component={PlanAccepted}
						/>
						<Route path="/message" Component={MessagePage} />
						<Route path="/quit" Component={ExitPage} />
					</Routes>
				</Router>
				<header className="App-header"></header>
			</div>
		);
	}
}

export default App;
