import { Component, OnInit } from '@angular/core';

import * as lineData from './shared/data/line';
import * as areaData from './shared/data/area-small';
import * as bandData from './shared/data/band';
import * as multilineData from './shared/data/multiline';
import * as barData from './shared/data/bar';

import { GraphOptions } from 'ng-d3/shared/models/graph-options.interface';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ng-d3';

  line: any;
  pie: any;
  bar: any;
  area: any;
  band: any;
  multiline: any;

  ngOnInit() {
    this.line = this.getLineData();
    this.pie = this.getPieData();
    this.bar = this.getBarData();
    // TODO: comment in when issue #96 is done.
    // this.area = this.getAreaData();
    this.band = this.getBandData();
    this.multiline = this.getMultilineData();
  }

  getLineData(): any {
    return {
      labels: lineData.data.map(d => d.date),
      data: lineData.data.map(d => d.value),
      options: {
        ticks: 5
      },
    };
  }

  getPieData(): any {
    return {
      labels: ['A', 'B', 'C', 'D'],
      data: [100, 200, 300, 100],
      options: { width: 400, height: 400 },
      backgroundColors: ['black', 'red', 'yellow', 'green'],
    };
  }

  getBarData(): any {
    const labels = barData.data.map(d => d.Run);
    const data = barData.data.map(d => d.Speed);
    const options: GraphOptions = { width: 600, height: 300, margin: { top: 50, right: 50, bottom: 50, left: 50 }, yAxisLabel: 'Speed' };

    return {
      labels,
      data,
      options
    };
  }

  // TODO: comment in when issue #96 is done.
  // getAreaData(): any {
  //   const labels = areaData.data.map(d => d.date);
  //   const data = areaData.data.map(d => d.value);
  //   return {
  //     labels,
  //     data
  //   };
  // }

  getBandData(): any {
    const labels = bandData.data.map(d => d.date);
    const data = bandData.data.map(d => { return {high: d.high, low: d.low} });
    // const options: GraphOptions = {width: 300, height: 300, yAxisLabel: '°F', margin: { }};
    return {
      labels,
      data,
      // options
    };
  }

  getMultilineData(): any {
    const labels = multilineData.data.dates;
    const data = multilineData.data.series;
    const options: GraphOptions = {width: 300, height: 300, yAxisLabel: multilineData.data.y};
    return {
      labels,
      data,
      options,
    };
  }


}
