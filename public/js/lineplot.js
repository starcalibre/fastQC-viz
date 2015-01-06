function LinePlot() {
  this.strokeWidth = 0.75;
}

LinePlot.prototype.bindTo = function(value) {
  if(!arguments.length) { return value }
  this.element = value;
  return this
};

LinePlot.prototype.width = function(value) {
  if(!arguments.length) { return value }
  this.width = value;
  return this
};

LinePlot.prototype.height = function(value) {
  if(!arguments.length) { return value }
  this.height = value;
  return this
};

LinePlot.prototype.render = function(data) {

  // define width/height with margins
  this.margin = {top: 30, right: 30, bottom: 40, left: 30};
  this.width = this.width - this.margin.left - this.margin.right;
  this.height = this.height - this.margin.top - this.margin.bottom;

  // find max
  var yMax = d3.max(data, function(d) {return d['90p']} );
  var xMax = data.length;

  // define axis and scales
  // create 20 odd ticks on x axis

  this.xTicks = [];
  for(var i = 0; i < Math.floor(xMax/2); i++) {
    this.xTicks.push(2*i+1)
  }

  var xScale = d3.scale.linear()
    .domain([0, xMax])
    .range([0, this.width]);
  this.xAxis = d3.svg.axis()
    .scale(xScale)
    .tickValues(this.xTicks)
    .orient('bottom');

  var yScale = d3.scale.linear()
    .domain([0, yMax])
    .range([this.height, 0]);
  this.yAxis = d3.svg.axis()
    .scale(yScale)
    .ticks(20)
    .orient('left');

  // remove any existing plots before rendering
  if(this.svg) {
    this.svg.remove();
  }

  // setup canvas
  this.svg = d3.select(this.element).append('svg')
    .attr('id', 'line-plot')
    .attr('width', this.width + this.margin.left + this.margin.right)
    .attr('height', this.height + this.margin.top + this.margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

  // create data for line
  var lineData = [];
  for(i = 0; i < data.length; i++) {
    var point = [];
    point.push(i+1);
    point.push(data[i]['mean']);
    lineData.push(point);
  }

  // line function
  var line = d3.svg.line()
    .x(function(d) {
      return xScale(d[0])
    })
    .y(function(d) {
      return yScale(d[1])
    });

  // append line to graph
  this.svg.append('path')
    .attr('d', line(lineData))
    .attr('stroke', 'blue')
    .attr('stroke-width', this.strokeWidth)
    .attr('fill', 'none');

  // append x and y axis
  this.svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + this.height + ')')
    .call(this.xAxis);
  this.svg.append('g')
    .attr('class', 'y axis')
    .call(this.yAxis);

  // add x axis label
  this.svg.append('text')
    .attr('class', 'label')
    .attr('text-anchor', 'end')
    .attr('x', this.width/2 + 50)
    .attr('y', this.height + 35)
    .text('Position in read (bp)');

  // add title
  this.svg.append('text')
    .attr('class', 'label')
    .attr('text-anchor', 'end')
    .attr('x', this.width/2 + 150)
    .attr('y', -10)
    .text('Quality scores across all bases (Illumina >v1.3 encoding)');

};