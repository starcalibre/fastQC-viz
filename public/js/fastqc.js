// fastQC parser

document.getElementById('file').onchange = function(){
  var file = this.files[0];
  var reader = new FileReader();
  var fastqc_object = {};

  reader.onload = function() {
    var lines = this.result.split('\n');

    for(var i = 0; i < lines.length; i++) {
      var curLine = lines[i].split('\t');

      if (curLine[0] === '>>Basic Statistics') {
        // parse module data for basic statistics
        var basic_module = {};
        basic_module['status'] = curLine[1];
        i += 2;
        curLine = lines[i].split('\t');

        while (curLine[0] !== '>>END_MODULE') {
          basic_module[curLine[0]] = curLine[1];
          i += 1;
          curLine = lines[i].split('\t');
        }

        fastqc_object['Basic Statistics'] = basic_module;
      }
      else if(curLine[0] === '>>Per base sequence quality') {
        var qual_module = {};
        qual_module['status'] = curLine[1];
        qual_module['quintiles'] = [];
        i += 2;
        curLine = lines[i].split('/t');

        while (curLine[0] !== '>>END_MODULE') {
          var quintileSplit = curLine[0].split(/\s+/);
          var quintile = {};
          quintile['base'] = Number(quintileSplit[0]);
          quintile['mean'] = Number(quintileSplit[1]);
          quintile['median'] = Number(quintileSplit[2]);
          quintile['1q'] = Number(quintileSplit[3]);
          quintile['3q'] = Number(quintileSplit[4]);
          quintile['10p'] = Number(quintileSplit[5]);
          quintile['90p'] = Number(quintileSplit[6]);
          qual_module['quintiles'].push(quintile);
          i += 1;
          curLine = lines[i].split('/t');
        }
        fastqc_object['Per base sequence quality'] = qual_module;
      }
    }
    console.log(fastqc_object);
  };
  reader.readAsText(file);
};
