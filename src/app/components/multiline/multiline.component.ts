import { Component, Input, OnInit, OnChanges } from '@angular/core';
import * as d3 from 'd3';
import { GraphOptions } from '../shared/models/graph-options.interface';


interface LabelsAndData {
  x: any;
  y: any;
}

interface MultilineData {
  label: string;
  values: any[];
}


@Component({
  selector: 'ng-multiline',
  templateUrl: './multiline.component.html',
  styleUrls: ['./multiline.component.scss']
})
export class MultilineComponent implements OnInit {
  @Input() data: MultilineData[] = [];
  @Input() labels: any[] = [];
  @Input() options: GraphOptions = { width: 300, height: 300, yAxisLabel: '', xAxisLabel: '' };
  labelsAndData: LabelsAndData[] = [];
  utcParse = d3.utcParse('%Y-%m');
  x: any;
  y: any;

  constructor() { }

  ngOnInit() {
    [this.labels] = this.formatData();
    this.labelsAndData = this.combineLabelsDataToOne();
    this.render();
  }

  private formatData() {
    const labels = this.labels.map(d => new Date(d));
    return [labels];
  }

  private combineLabelsDataToOne(): LabelsAndData[] {
    const result = [];
    const N = this.data.length;
    for (let index = 0; index < N; index++) {
      result.push({ x: this.labels, y: this.data[index] });
    }
    return result;
  }

  render(): void {
    const margin = { top: 20, right: 30, bottom: 50, left: 20 }, height = 500,
      width = 800;

    const svg = d3.select('#multiline')
      .append('svg')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .classed('svg-content', true)
      .append('g');


    const xDomain = this.getXdomain();
    const x = d3.scaleUtc().domain(xDomain).range([
      margin.left, width - margin.right
    ]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(this.data, d => d3.max(d.values))])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const xAxis = g =>
      g.attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

    const yAxis = g => g.attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .call(g => g.select('.domain').remove())
      .call(
        g => g
          .select('.tick:last-of-type text')
          .clone()
          .attr('x', 3)
          .attr('text-anchor', 'start')
          .attr('font-weight', 'bold')
          .text(this.options.yAxisLabel));

    const line = d3.line<any>()
      .defined(d => !isNaN(d))
      .x((d, i) => x(this.labels[i]))
      .y(d => y(d));

    svg.append('g').call(xAxis);

    svg.append('g').call(yAxis);

    const path =
      svg.append('g')
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 1.5)
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .selectAll('path')
        .data(this.data)
        .join('path')
        .style('mix-blend-mode', 'multiply')
        .attr('d', d => line(d.values))
        .text('this is ');

    // TODO: comment in when issue #61 is fixed
    /* svg.call(hover, path, this);

    function hover(svg, path, _this) {

      if ('ontouchstart' in document) {
        svg.style('-webkit-tap-highlight-color', 'transparent')
          .on('touchmove', moved)
          .on('touchstart', entered)
          .on('touchend', left);
      } else {
        svg.on('mousemove', moved)
          .on('mouseenter', entered)
          .on('mouseleave', left);
      }

      const dot = svg.append('g').attr('display', 'none');

      dot.append('circle').attr('r', 2.5);

      dot.append('text')
        .attr('font-family', 'sans-serif')
        .attr('font-size', 10)
        .attr('text-anchor', 'middle')
        .attr('y', -8);

      function moved() {
        d3.event.preventDefault();
        const ym = y.invert(d3.event.layerY) as any;
        const xm = x.invert(d3.event.layerX) as any;
        const i1 = d3.bisectLeft(_this.labels, xm, 1);
        const i0 = i1 - 1;
        const i = xm - _this.labels[i0] > _this.labels[i1] - xm ? i1 : i0;
        // const s = d3.least(_this.data, d => Math.abs(d.values[i] - ym));
        const s = _this.least(_this.data, d => Math.abs(d.values[i] - ym), i, ym);
        path.attr('stroke', d => d === s ? null : '#ddd')
          .filter(d => d === s)
          .raise();
        dot.attr(
          'transform', `translate(${x(_this.labels[i])},${y(s.values[i])})`);
        dot.select('text').text(s.name);
      }

      function entered() {
        path.style('mix-blend-mode', null).attr('stroke', '#ddd');
        dot.attr('display', null);
      }

      function left() {
        path.style('mix-blend-mode', 'multiply').attr('stroke', null);
        dot.attr('display', 'none');
      }
    }
    */

    this.onWindowResize();

  }

  private getXdomain(): Date[] {
    const domainExtent = d3.extent(this.labels) as any[];
    return domainExtent.map(d => new Date(d));
  }

  utcParser(columns: any[]): any {
    return columns.map(this.utcParse);
  }

  least(arr: any[], filterFun: any, pos: any, ym: any) {
    const tempValues = arr.map(d => filterFun(d));
    const minNum = Math.min(...tempValues);
    let graphHovered = undefined;
    let minimax = tempValues[0];
    let minPos = 0;
    for (let i = 1; i < tempValues.length; i++) {
      const element = tempValues[i];
      if (element >= minimax) {
        minPos = i;
        minimax = element;
      }
    }

    graphHovered = arr[minPos];
    return graphHovered;
  }


  onWindowResize() {

  }

}