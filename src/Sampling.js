
import React, { Component } from 'react';
import * as d3 from "d3";

class Sampling extends Component {
  constructor(props) {
    super(props);
    this.state = {
      svg: null
    };

    this.onRef = (ref) => {
      this.setState({ svg: ref })
    }
  }
  renderD3(_svg) {
    if (this.props.data == null) {
      return;
    }
    const offsetX = this.props.offsetX;
    const offsetY = this.props.offsetY;

    const svg = d3.select(_svg);

    const data = Array.from(this.props.data);// [{ "salesperson": "Bob", "sales": 33 }, { "salesperson": "Robin", "sales": 12 }, { "salesperson": "Anne", "sales": 41 }, { "salesperson": "Mark", "sales": 16 }, { "salesperson": "Joe", "sales": 59 }, { "salesperson": "Eve", "sales": 38 }, { "salesperson": "Karen", "sales": 21 }, { "salesperson": "Kirsty", "sales": 25 }, { "salesperson": "Chris", "sales": 30 }, { "salesperson": "Lisa", "sales": 47 }, { "salesperson": "Tom", "sales": 5 }, { "salesperson": "Stacy", "sales": 20 }, { "salesperson": "Charles", "sales": 13 }, { "salesperson": "Mary", "sales": 29 }];
    data.sort((a, b) => {
      return a.percentage - b.percentage;
    });


    // set the dimensions and margins of the graph
    var margin = { top: 20, right: 20, bottom: 30, left: 40 },
      width = this.props.width - margin.left - margin.right,
      height = this.props.height - margin.top - margin.bottom;

    // set the ranges
    var y = d3.scaleBand()
      .range([height, 0])
      .padding(0.1);

    var x = d3.scaleLinear()
      .range([0, width]);

    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    //var svg = d3.select("body").append("svg")
    svg.attr("width", width + margin.left + margin.right + offsetX)
      .attr("height", height + margin.top + margin.bottom + offsetY)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    // format the data
    data.forEach(function (d) {
      d.percentage = +d.percentage;
    });

    // Scale the range of the data in the domains
    x.domain([0, d3.max(data, function (d) { return d.percentage; })])
    y.domain(data.map(function (d) { return d.name; }));
    //y.domain([0, d3.max(data, function(d) { return d.sales; })]);

    // append the rectangles for the bar chart
    const tr = svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function (d) { return offsetX + 1; })
      .attr("width", function (d) { return x(d.percentage); })
      .transition()
      .duration(1000)
      .attr("y", function (d) { return y(d.name) + offsetY; })
      .attr("height", y.bandwidth())
      .style("fill", "orange")
      .style("border-radius", "25px");


    // add the x Axis
    svg.append("g")
      .attr("transform", "translate(" + offsetX + ", " + (height + offsetY) + ")")
      .call(d3.axisBottom(x))
      .append("text")
      .attr("transform", "translate(" + (width) + ", " + (offsetY) + ")")
      .attr("y", 8)
      .attr("dy", ".71em")
      .style("text-anchor", "start")
      .style("fill", "black")
      .text("(%)");;

    // add the y Axis
    svg.append("g")
      .attr("transform", "translate(" + offsetX + ", " + offsetY + ")")
      .call(d3.axisLeft(y));
  }
  viewBoxSetting() {
    const res = (0).toString() + " " + (0).toString() + " " + (this.props.width * 1).toString()
      + " " + (this.props.height * 1).toString();
    return res;
  }
  render() {
    return (
      <div className="flex content-center bg-green-200">
        <svg viewBox={this.viewBoxSetting()} ref={this.onRef}>
          {this.renderD3(this.state.svg)}
        </svg>
      </div>
    );
  }
}

export default Sampling;
