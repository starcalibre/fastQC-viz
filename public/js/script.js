// create boxplot object, and send it to the #plotbox div
var linePlot = new LinePlot()
  .bindTo('#line-plot')
  .width(600)
  .height(400);

console.log(linePlot);

var boxPlot = new BoxPlot()
  .bindTo('#box-plot')
  .width(600)
  .height(400);

console.log(boxPlot);

// setup listener and handlers for file reading file
document.getElementById('file').onchange = function(){
  var file = this.files[0];
  var reader = new FileReader();
  reader.readAsText(file);
  reader.onerror = errorHandler;
  reader.onloadstart = loadStart;
  reader.onloadend = loadEnd;
};

function errorHandler(event) {
  console.log(event);
}

function loadStart(event) {
  console.log('file loading');
}

function loadEnd(event) {
  /* when text file is loaded, parse the contents
  and send the quality results to the D3 function that
  renders the boxplot */
  var fileContents = event.target.result;
  var fastQCFile = new FastQCParser(fileContents);
  fastQCFile.parseQC();
  console.log(fastQCFile);
  linePlot.render(fastQCFile.modules.qual.quintiles);
  boxPlot.render(fastQCFile.modules.qual.quintiles);
}
