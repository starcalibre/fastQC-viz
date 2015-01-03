// some code to generate random data for the boxplot

var randomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var randomArray = function(n, min, max) {
  var random = [];
  for (var i = 0; i < n; i++) {
    random.push(randomInt(min, max));
  }
  return random;
};

var quantile = function(sample, p) {
  var idx = (sample.length) * p;
  if (p < 0 || p > 1) {
    return null;
  } else if (p === 1) {
    return sample[sample.length - 1];
  } else if (p === 0) {
    return sample[0];
  } else if (idx % 1 !== 0) {
    return sample[Math.ceil(idx) - 1];
  } else if (sample.length % 2 === 0) {
    return (sample[idx - 1] + sample[idx]) / 2;
  } else {
    return sample[idx];
  }
};

var boxData = function(data) {
  data = data.sort(function(a, b){return a-b});
  var q = {};
  q['min'] = Math.min.apply(Math, data);
  q['1q'] = quantile(data, 0.25);
  q['med'] = quantile(data, 0.5);
  q['3q'] = quantile(data, 0.75);
  q['max'] = Math.max.apply(Math, data);
  return q
};

var values = [];
for(var i = 0; i < 40; i++) {
  var random = randomArray(10, 3, 34);
  values.push(boxData(random))
}

// create boxplot object, and send it to the #plotbox div
var boxPlot = new BoxPlot()
  .bindTo('#plot-box')
  .width(800)
  .height(400);

boxPlot.render(values);