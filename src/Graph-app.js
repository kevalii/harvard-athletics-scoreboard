import React, { Component } from 'react'
import * as d3 from 'd3'
import {get_wins} from './scores-fetcher'

class Graph extends Component {
  constructor(props){
      super(props)
      this.createBarChart = this.createBarChart.bind(this)
   }

   componentDidMount() {
      this.createBarChart()
   }

   componentDidUpdate() {
      this.createBarChart()
   }

   createBarChart() {
      const svg = d3.select(this.node)
      var margin = {top: 20, right: 20, bottom: 30, left: 40},
              width = svg.attr("width") - margin.left - margin.right,
              height = svg.attr("height") - margin.top - margin.bottom;

      var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
          y = d3.scaleLinear().rangeRound([height, 0]);

      var g = svg.append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      const data = Object.entries(this.props.data).reverse()

      x.domain(data.map(function (d, i) {
        let [season, wins] = d
			  return season;
		  }));

    	y.domain([0, d3.max(data, function (d, i) {
        let [season, wins] = d
  			return Number(get_wins(wins));
  		})]);

      g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))

      g.append("g")
          // .attr("class", "axis axis--y")
          .call(d3.axisLeft(y))
        .append("text")
          .attr("fill", "#000")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", "0.71em")
          .attr("text-anchor", "end")
          .text("Wins");

      g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d, i) {
            let [season, wins] = d
    			  return x(season)
          })
          .attr("y", function(d, i) {
            let [season, wins] = d
      			return y(Number(get_wins(wins)));
          })
          .attr("width", x.bandwidth())
          .attr("height", function(d, i) {
            let [season, wins] = d
            return height - y(Number(get_wins(wins)));
          });
   }
   render() {
      return (
        <div>
          <h3>Wins over Seasons</h3>
          <svg ref={node => this.node = node} width={500} height={500}>
          </svg>
        </div>
      )
   }
}
// function update_graph (data, svg) {
//   data = Object.entries(data)
//   // "Adapted" from https://bl.ocks.org/gordlea/27370d1eea8464b04538e6d8ced39e89
//   var svg = d3.select("div")
//   console.log(svg)
//       margin = {top: 20, right: 20, bottom: 30, left: 40},
//       width = +svg.attr("width") - margin.left - margin.right,
//       height = +svg.attr("height") - margin.top - margin.bottom;
//
//     var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
//         y = d3.scaleLinear().rangeRound([height, 0]);
//
//   // 7. d3's line generator
//   var line = d3.line()
//       .x(function(d, i) { return Object.keys(d)[0]; }) // set season as x-value
//       .y(function(d) { return yScale(d.y); }) // set the y values for the line generator
//       .curve(d3.curveMonotoneX) // apply smoothing to the line
//
  // var g = svg.append("g")
  //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  //
  // // 1. Add the SVG to the page and employ #2
  // var svg = d3.select("body").append("svg")
  //     .attr("width", width + margin.left + margin.right)
  //     .attr("height", height + margin.top + margin.bottom)
  //   .append("g")
  //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  //
  // g.append("g")
  //   .attr("class", "axis axis--x")
  //   .attr("transform", "translate(0," + height + ")")
  //   .call(d3.axisBottom(x));
  //
  // g.append("g")
  //     .attr("class", "axis axis--y")
  //     .call(d3.axisLeft(y).ticks(10, "%"))
  //   .append("text")
  //     .attr("transform", "rotate(-90)")
  //     .attr("y", 6)
  //     .attr("dy", "0.71em")
  //     .attr("text-anchor", "end")
  //     .text("Frequency");
  //
  // g.selectAll(".bar")
  //   .data(data)
  //   .enter().append("rect")
  //     .attr("class", "bar")
  //     .attr("x", function(d, i) { return x(Object.keys(d)[i]); })
  //     .attr("y", function(d) { return y(get_wins(d)); })
  //     .attr("width", x.bandwidth())
  //     .attr("height", function(d) { return height - y(get_wins(d)); });
// }

export default Graph;
