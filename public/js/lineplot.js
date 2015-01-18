function maxQuintile(fastQC) {
  var max = 0;
  for(var i = 0; i < fastQC.modules.qual.quintiles.length; i++) {
    if (fastQC.modules.qual.quintiles[i]['90p'] > max) {
      max = fastQC.modules.qual.quintiles[i]['90p'];
    }
  }
  return max;
}

function LinePlot() {
  this.strokeWidth = 0.75;
  this.margin = {top: 30, right: 30, bottom: 40, left: 30};
}

LinePlot.prototype.bindTo = function(value) {
  if(!arguments.length) { return value }
  this.element = value;
  return this
};

LinePlot.prototype.width = function(value) {
  if(!arguments.length) { return value }
  this.width = value - this.margin.left - this.margin.right;
  return this
};

LinePlot.prototype.height = function(value) {
  if(!arguments.length) { return value }
  this.height = value - this.margin.top - this.margin.bottom;
  return this
};

LinePlot.prototype.render = function(data) {
  // remove any existing plots before rendering
  $(this.element).empty();

  // [0].modules.qual.quintiles
  var nLines = data.length;
  console.log(data);

  // find max
  var yMax = d3.max(data, function(d) {return maxQuintile(d);} );
  var xMax = d3.max(data, function(d) {return d.modules.qual.quintiles.length;} );

  // setup colour scale
  var colourScale = d3.scale.category10();

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

  // setup canvas
  this.svg = d3.select(this.element).append('svg')
    .attr('id', 'line-plot')
    .attr('width', this.width + this.margin.left + this.margin.right)
    .attr('height', this.height + this.margin.top + this.margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

  // create data for lines
  var allLines = [];
  for(var i = 0; i < nLines; i++) {
    var newLine = [];
    for(var j = 0; j < data[i].modules.qual.quintiles.length; j++) {
      var newPoint = [];
      newPoint.push(j+1);
      newPoint.push(data[i].modules.qual.quintiles[j]['mean']);
      newLine.push(newPoint);
    }
    allLines.push(newLine);
  }

  // line function
  var line = d3.svg.line()
    .x(function(d) {
      return xScale(d[0])
    })
    .y(function(d) {
      return yScale(d[1])
    });

  // append lines to graph
  this.svg.selectAll('path')
    .data(allLines)
    .enter()
    .append('path')
    .attr('d', function(d) {
      return line(d);
    })
    .attr('stroke', function(d, i) {
      return colourScale(i);
    })
    .attr('stroke-width', this.strokeWidth)
    .attr('fill', 'none')
    .style('opacity', 0.7)
    .on('mouseover', function(d, i) {
      d3.select(this)
        .style('opacity', 1);
    })
    .on('mouseout', function(d, i) {
      d3.select(this)
        .style('opacity', 0.7);
    });

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
