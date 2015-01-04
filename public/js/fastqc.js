// fastQC parser

function FastQCParser(fileContents) {
  this.fileContents = fileContents;
  this.modules = {};
}

FastQCParser.prototype.parseQC = function() {
  var lines = this.fileContents.split('\n');
  this. modules = {};

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
        quintile['base'] = quintileSplit[0];
        quintile['mean'] = Number(quintileSplit[1]);
        quintile['med'] = Number(quintileSplit[2]);
        quintile['1q'] = Number(quintileSplit[3]);
        quintile['3q'] = Number(quintileSplit[4]);
        quintile['10p'] = Number(quintileSplit[5]);
        quintile['90p'] = Number(quintileSplit[6]);
        qual_module['quintiles'].push(quintile);
        i += 1;
        curLine = lines[i].split('/t');
      }
    }
  }
  this.modules['basic'] = basic_module;
  this.modules['qual'] = qual_module;
};
