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

function parseBasicInfo(basic_data) {
  /* Determine the length of the fastQCFile.modules.basic 
  array, loop over the array, adding a completed <tr></tr> 
  for each object in array. */

  // setup table that will be inserted into the DOM
  var basic_table_HTML = '<table class="table table-striped">\n' + 
                         "<th>Tag</th>\n" +
                         "<th>Data</th>\n"

  // find array length and enumerate attribute keys
  var modules_basic_array_length = Object.keys(basic_data).length;
  var modules_basic_array_obj_names = Object.keys(basic_data);
  
  for (var i = 0; i < modules_basic_array_length; i++) {
    attribute_name = modules_basic_array_obj_names[i];
    basic_table_HTML += "<tr>";
    basic_table_HTML += "<td>" + modules_basic_array_obj_names[i] + "</td>";
    basic_table_HTML += "<td>" + basic_data[attribute_name] + "</td>";
    basic_table_HTML += "</tr>";
  }
  
  // close the table
  basic_table_HTML += "</table>\n";

  // output the table to the DOM
  $('#basic-table-insert').replaceWith(basic_table_HTML);
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
  parseBasicInfo(fastQCFile.modules.basic)
}
