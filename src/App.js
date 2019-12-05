import React, { Component } from 'react';
import Sampling from './Sampling';
import Instrumented from './Instrumented';
import sample_data from '../ProfileProject/ProfileOutput/Sampling_Output.json';
import instru_data from '../ProfileProject/ProfileOutput/Instrumented_Output.json';



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sampling_data: null,
      instrumented_data: null,
      which: true
    };
    this.instruNames = new Set();
    this.instruCycleMap = new Map();
    this.instruTimeMap = new Map();
    this.instruCountMap = new Map();

    this.countdata = {};
    this.cycledata = {};
    this.timedata = {};
    this.dateArr = [];
  }
  loadData(_jsonData) {
    return JSON.parse(JSON.stringify(_jsonData));
  }
  organizingInstrumentedData(_instruData) {
    for (let i = 0; i < _instruData.Functions.length; ++i) {
      this.instruNames.add(_instruData.Functions[i].name);
      this.instruCycleMap.set(_instruData.Functions[i].name, []);
      this.instruCountMap.set(_instruData.Functions[i].name, []);
      this.instruTimeMap.set(_instruData.Functions[i].name, []);
    }
    for (let i = 0; i < _instruData.Functions.length; ++i) {
      const func = _instruData.Functions[i];
      this.instruCycleMap.get(func.name).push(func.cycle);
      this.instruTimeMap.get(func.name).push(func.time);
      this.instruCountMap.get(func.name).push(1);
    }

    this.instruNames.forEach((value) => {
      const cycleArr = this.instruCycleMap.get(value);
      let cycleAvg = 0;
      cycleArr.map((val, index) => {
        cycleAvg += val;
        return val;
      });
      cycleAvg = (cycleAvg / cycleArr.length);
      this.cycledata[value] = cycleAvg;

      const timeArr = this.instruTimeMap.get(value);
      let timeAvg = 0;
      timeArr.map((val, index) => {
        timeAvg += val;
        return val;
      });
      timeAvg = timeAvg / timeArr.length;
      this.timedata[value] = timeAvg;

      const countArr = this.instruCountMap.get(value);
      let countAvg = 0;
      countArr.map((val, index) => {
        countAvg += val;
        return val;
      });
      this.countdata[value] = countAvg;

    });

    this.dateArr.push(this.cycledata);
    this.dateArr.push(this.timedata);
    this.dateArr.push(this.countdata);
    this.instruNames = Array.from(this.instruNames);
  }
  renderSample() {
    return (
      <Sampling width={800} height={800} data={this.state.sampling_data.Functions}
        offsetX={50} offsetY={0} />
    );
  }
  renderInstrumented() {
    return (
      <Instrumented width={800} height={800} data={this.dateArr} domain={this.instruNames} />
    );
  }
  renderGraph() {
    if (this.state.which) {
      return this.renderSample();
    }
    return this.renderInstrumented();
  }
  click() {
    const New = (this.state.which);
    this.state.which = (!New);
    const d = JSON.parse(JSON.stringify(this.state));
    this.setState(d);
  }

  render() {
    let s_d = this.state.sampling_data;
    let i_d = this.state.instrumented_data;
    if (s_d == null) {
      s_d = (this.loadData(sample_data));
    }
    if (i_d == null) {
      i_d = (this.loadData(instru_data));
      this.organizingInstrumentedData(i_d);
    }
    else {
    }
    this.state = {
      sampling_data: s_d,
      instrumented_data: i_d,
      which: this.state.which
    };
    return (
      <div className="bg-green-200">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold my-2 mx-2 py-2 px-4 rounded" onClick={this.click.bind(this)}>
          Button
        </button>
        <div>
          <div className="flex content-center pl-8 pt-8 w-full h-full">
            {this.renderGraph()}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
