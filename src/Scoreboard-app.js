import React, {Component} from 'react'
import Table from 'react-bootstrap/Table'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import sf from './scores-fetcher'
import logo from './halogo.png'

let categories = Object.keys(sf.nurls).slice(0, 3)

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
      let seasons_pages = sf.get_urls(sf.nurls[this.props.category_name], 5)
      sf.call_urls(seasons_pages).then(result => {
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
      var scores_categories = Object.keys(this.state.data[seasons[0]])
      scores_categories = scores_categories.slice(1, scores_categories.length - 1)
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
                  return (
                    <tr>
                      <td>{season}</td>
                      {scoresComponent({categories: scores_categories,
                                     data: this.state.data[season]})}
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          </div>
        </div>
      )
    }
  }
}

function scoresComponent (props) {
  return (
    props.categories.map(category => {
      return (<td>{props.data[category]}</td>)
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
