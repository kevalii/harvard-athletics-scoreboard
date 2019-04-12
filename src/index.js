import 'bootstrap/dist/css/bootstrap.min.css'
import './Scoreboard-app.css'
import React from 'react'
import ReactDOM from 'react-dom'
import Scoreboard from './Scoreboard-app'
import Blah from './Bullshit-app'

const title = 'scoreboard';

ReactDOM.render(
  <Scoreboard />,
  document.getElementById('app')
);

module.hot.accept();
