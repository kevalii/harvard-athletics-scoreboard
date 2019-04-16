import React, {Component} from 'react'
import Graph from "./Graph-app"
import Table from 'react-bootstrap/Table'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import {call_urls, nurls, get_urls, get_wins} from './scores-fetcher'
import logo from './halogo.png'
import pilgrim from './pilgrim.png'

let categories = Object.keys(nurls)

class Scoreboard extends Component {
  constructor(props) {
    super(props)
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
          <Tab eventKey="welcome" title="Scoreboard" key={"welcome"}>
            <h4>This is a Harvard Athletics scoreboard.</h4>
            <p>It's rather WIP but hopefully it serves a proof of concept.</p>
            <p>Go Crimson!</p>
            <img src={pilgrim} className="loader"></img>
            <small>Approved by John Harvard</small>
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
    else if (!this.props.selected && !this.state.fetched) {
      return (<div></div>)
    }
    else {
      const seasons = Object.keys(this.state.data)
      const scores_categories = this.state.data[seasons[0]].categories
      return (
        <div className="container">
          <div className="sportsdataTab">
            <h3>{`Overview for ${this.props.category_name}`}</h3>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Season</th>
                    {scores_categories.map(category => {
                    return (<th key={category}>{category}</th>)
                    })}
                  </tr>
              </thead>
              <tbody>
                {seasons.map(season => {
                  let scoresProps = {categories: scores_categories,
                                    data: this.state.data[season]}
                  return (
                    <tr>
                      <td>{season}</td>
                      {scoresComponent(scoresProps)}
                    </tr>
                  )
                })}
              </tbody>
            </Table>
            <Graph data={this.state.data}/>
          </div>
        </div>
      )
    }
  }
}

function scoresComponent (props) {
  return (
    props.categories.map(category => {
      return (<td key={category}>{props.data[category]}</td>)
    })
  )

}
function loaderComponent (props) {
  return (
    <img className="loader" src={logo}>
    </img>
  )
}

export default Scoreboard
