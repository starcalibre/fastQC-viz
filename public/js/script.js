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

function insertBasicTable(basic_data, insert_id) {
  /* Insert the key/value pairs into a table element on the DOM.

  basic_data = object containing key/value pairs
  insert_id  = the id on the DOM to insert the table into 
  
  Intentionally not including closing tags in the jquery requests;
  http://stackoverflow.com/a/14737115/2355035 */

  table_id = '#' + insert_id;
  var array_length = Object.keys(basic_data).length;
  var array_obj_names = Object.keys(basic_data);

  // create the table header
  $(table_id).empty();
  $(table_id).append('<thead>');
  $(table_id).append('<tr>')
  $(table_id).find('thead:last').append('<th>Tag');
  $(table_id).find('thead:last').append('<th>Data');

  // begin the table body and iterate through key/value pairs
  $(table_id).append('<tbody>');
  for (var i = 0; i < array_length; i++) {
    var attr_name = array_obj_names[i];
    var tag       = '<td>' + array_obj_names[i];
    var data      = '<td>' + basic_data[attr_name];

    $(table_id).find('tbody:last').append('<tr>' + tag + data);
  }
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
  insertBasicTable(fastQCFile.modules.basic, 'basic-stats-table');
}
