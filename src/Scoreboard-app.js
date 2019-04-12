import React, {Component} from 'react'
import Table from 'react-bootstrap/Table'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import {call_urls, nurls, get_urls} from './scores-fetcher'
import logo from './halogo.png'

let categories = Object.keys(nurls).slice(0, 3)

class Scoreboard extends Component {
  constructor(props) {
    super(props)
    this.categories = this.map
    this.state = {key: 'welcome'}
  }
  render = () => {
    let tabs_props = {
        defaultActiveKey: "welcome",
        id: "scoreboard-tabs",
        activeKey: this.state.key,
        onSelect: key => this.setState({key})
      }
    return (
      <div className="container">
        <Tabs {...tabs_props}>
          <Tab eventKey="welcome" title="Welcome" key={"welcome"}>
            <p>{"Sexy content"}</p>
            {loaderComponent()}
          </Tab>
          {categories.map(el => {
            let el_key = el.toLowerCase();
            let props = {
              selected: el_key == this.state.key,
              category_name: el
            }
            return (
              <Tab eventKey={el_key} title={el} key={el}>
                <Sportsdata {...props}/>
              </Tab>
            )
          })}
        </Tabs>
      </div>
    )
  }
}

class Sportsdata extends Component {
  constructor(props) {
    super(props)
    this.state = {data: {}, fetched: false}
  }
  render = () => {
    if (this.props.selected && !this.state.fetched) {
      let seasons_pages = get_urls(nurls[this.props.category_name], 5)
      call_urls(seasons_pages).then(result => {
        this.setState({data: result, fetched: true})
      })
      return (
        <div className="container">
          <div className="sportsdataTab">
            {loaderComponent()}<br></br>
            <small className="text-muted">Fetching data...</small>
          </div>
        </div>
      )
    }
    else {
      // var scores_categories = Object.keys(this.state.data)
      // scores_categories = scores_categories.slice(1, scores_categories.length - 1)
      return (
        <div className="container">
          <div className="sportsdataTab">
            <h3>{`Overview for ${this.props.category_name}`}</h3>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Season</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
      )
    }
  }
}

function loaderComponent (props) {
  return (
    <img className="loader" src={logo}>
    </img>
  )
}

// {scores_categories.map(el => {
//   return (<th id={el}>{el}</th>)
// })}
// 
// <td>2018-19</td>
// {scores_categories.map(el => {
//   return (<td>{this.state.data[el]}</td>)
// })}
export default Scoreboard
