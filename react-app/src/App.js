import './App.css';
import React from "react";
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import Routs from "./Routs";

import {Provider} from "react-redux";
class App extends React.Component {

  render() {
    return (

        <Router>
            <div>
                <Routs/>
            </div>
        </Router>

    );
  }
}

export default App;
