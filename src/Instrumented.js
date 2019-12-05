
import React, { Component } from 'react';
import * as d3 from "d3";


class Instrumented extends Component {
  constructor(props) {
    super(props);
    // create 2 data_set

    this.state = {
      svg: null,
      data: []
    };
    this.dataIndex = 0;

    this.regenerateData();
    this.onRef = (ref) => {
      this.setState({ svg: ref, data: this.state.data })
    }


  }
  regenerateData() {
    for (let i in this.props.data) {
      let avg = 0;
      let max = 0;
      const obj = this.props.data[i];
      const d = JSON.parse(JSON.stringify(obj));
      for (let j in d) {
        if (max < d[j]) {
          max = d[j];
        }
        avg += d[j];
      }
      avg = avg / this.props.domain.length;
      for (let j in d) {
        d[j] = (d[j]) / max;
      }
      this.state.data.push(d);
    }
  }

  // A function that create / update the plot for a given variable:
  update(_data, _svg) {
    const svg = d3.select(_svg);
    // set the color scale
    const color = d3.scaleOrdinal()
      .domain(this.props.domain)
      .range(d3.schemeDark2);

    const div = d3.select("body").append("div")
      .style("position", "absolute")
      .style("text-align", "center")
      .style("width", "200px")
      .style("height", "75px")
      .style("padding", "2px")
      .style("font", "8px", "sans-serif")
      .style("background", "lightsteelblue")
      .style("border", " 0px")
      .style("border-radius", "8px")
      .style("pointer-events", "none")
      .style("z-index", "10")
      .style("visibility", "hidden")

    const width = this.props.width;
    const height = this.props.height;
    const margin = 0;
    const radius = Math.min(width, height) / 2 - margin;
    // Compute the position of each group on the pie:
    const pie = d3.pie()
      .value(function (d) { return d.value; })
      .sort(function (a, b) { return d3.ascending(a.key, b.key); });// This make sure that group order remains the same in the pie chart
    const data_ready = pie(d3.entries(_data));

    // map to data
    const u = svg.selectAll("path")
      .data(data_ready);
    // The arc generator
    const arc = d3.arc()
      .innerRadius(radius * 0.5)         // This is the size of the donut hole
      .outerRadius(radius);

    // Another arc that won't be drawn. Just for labels positioning
    const outerArc = d3.arc()
      .innerRadius(radius * 1.0)
      .outerRadius(radius * 1.8);

    svg.selectAll("polyline").remove();
    svg.selectAll("text").remove();
    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    // Define the div for the tooltip
    const dot = u
      .enter()
      .append('path')
      .merge(u);

    const propData = this.props.data;
    const dataIndex = this.dataIndex;
    dot.transition()
      .duration(1000)
      .attr('d', d3.arc()
        .innerRadius(radius / 2)
        .outerRadius(radius)
      )
      .attr("transform", "translate(" + ((0)) + "," + (0) + ")")
      .attr('fill', function (d) { return (color(d.data.key)) })
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 1);
    dot.on('mouseover', function (d, i) {
      d3.select(this).transition()
        .duration('50')
        .attr('opacity', '.75')
      div.style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY) + "px")
        .style("visibility", "visible")
        .text(d.data.key.toString() + ": " + (propData[dataIndex][d.data.key.toString()]).toString());

    })
      .on('mouseout', function (d, i) {
        div.style("visibility", "hidden");
        d3.select(this).transition()
          .duration('50')
          .attr('opacity', '1')
      });



    // Add the polylines between chart and labels:

    const line = svg
      .selectAll('allPolylines')
      .data(data_ready);
    line.enter()
      .append('polyline')
      .merge(line)
      .attr("stroke", "black")
      .style("fill", "none")
      .attr("stroke-width", 1)
      .attr('points', function (d) {
        var posA = arc.centroid(d) // line insertion in the slice
        var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
        var posC = outerArc.centroid(d); // Label position = almost the same as posB

        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
        posC[0] = radius * 0.9 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
        return [posA, posB, posC]
      });

    // Add the polylines between chart and labels:
    svg
      .selectAll('allLabels')
      .data(data_ready)
      .enter()
      .append('text')
      .text(function (d) { return d.data.key })
      .attr('transform', function (d) {
        var pos = outerArc.centroid(d);
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        pos[0] = radius * 0.9 * (midangle < Math.PI ? 1 : -1);
        return 'translate(' + pos + ')';
      })
      .style('text-anchor', function (d) {
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        return (midangle < Math.PI ? 'start' : 'end')
      })

    // remove the group that is not present anymore
    u
      .exit()
      .remove()

  };
  renderD3(_svg) {
    const svg = d3.select(_svg);
    // set the dimensions and margins of the graph
    const width = this.props.width;
    const height = this.props.height;

    svg.attr("width", (width)).attr("height", (height));

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.

    // append the svg object to the div called 'my_dataviz'
    svg.append("g")
      .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");


    // Initialize the plot with the first dataset
    this.update(this.state.data[this.dataIndex], _svg);
  };
  changeData(e) {
    //this.setState({ svg: this.state.svg,data:data });
    this.dataIndex = event.target.value;
    this.update(this.state.data[this.dataIndex], this.state.svg);
  }
  viewBoxSetting() {
    const res = (-this.props.width).toString() + " " + (-this.props.height).toString() + " " + (this.props.width * 2).toString()
      + " " + (this.props.height * 2).toString();
    return res;
  }
  render() {
    return (
      <div className="flex flex-col w-full">
        <div className="inline-block relative w-32">
          <select className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-2 py-2 rounded shadow leading-tight focus:outline-none focus:shadow-outline" onChange={this.changeData.bind(this)}>
            <option value={0} key={0}>
              Cycle
            </option>
            <option value={1} key={1}>
              Time
            </option>
            <option value={2} key={2}>
              Count
            </option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z">
              </path>
            </svg>
          </div>
        </div>
        <div className="">
          <svg className="object-center" viewBox={this.viewBoxSetting()} ref={this.onRef}>
            {this.renderD3(this.state.svg)}
          </svg>
        </div>
      </div>
    );
  }
}

export default Instrumented;
