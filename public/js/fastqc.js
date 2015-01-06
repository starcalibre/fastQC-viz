// fastQC parser

function FastQCParser(fileContents) {
  this.fileContents = fileContents;
  this.modules = {};
}

FastQCParser.prototype.parseQC = function() {
  var lines = this.fileContents.split('\n');
  this.modules = {};

  for(var i = 0; i < lines.length; i++) {
    var curLine = lines[i].split('\t');


    // Parse the basic stats section of FASTQC output file
    // and merge all parsed lines into basic_module object
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
    
    // Parse the per-base seq-quality section of FASTQC output file
    // and merge all parsed lines into qual_module object
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

    // Parse the per-seq-quality section of FASTQC output file
    // and merge all parsed lines into seq_qual_module object
    else if(curLine[0] === '>>Per sequence quality scores') {
      var seq_qual_module = {};
      seq_qual_module['status'] = curLine[1];
      seq_qual_module['scores'] = [];
      i += 2;
      curLine = lines[i].split('\t');

      while (curLine[0] !== '>>END_MODULE') {
        var score = {};
        score['quality'] = Number(curLine[0]);
        score['count']   = Number(curLine[1]);
        seq_qual_module['scores'].push(score);
        i += 1;
        curLine = lines[i].split('\t');
      }
    }

    // Parse the per-seq-quality section of FASTQC output file
    // and merge all parsed lines into seq_qual_module object
    else if(curLine[0] === '>>Per base sequence content') {
      var base_qual_module = {};
      base_qual_module['status'] = curLine[1];
      base_qual_module['base_percentages'] = [];
      i += 2
      curLine = lines[i].split('\t');

      while (curLine[0] !== '>>END_MODULE') {
        var base_dist = {};
        base_dist['base_num'] = curLine[0]
        base_dist['G'] = curLine[1]
        base_dist['A'] = curLine[2]
        base_dist['T'] = curLine[3]
        base_dist['C'] = curLine[4]
        base_qual_module['base_percentages'].push(base_dist);
        i += 1
        curLine = lines[i].split('\t');
      }
    }
  }

  // combine the parsed section objects into a single module object/array
  this.modules['basic'] = basic_module;
  this.modules['qual'] = qual_module;
  this.modules['score'] = seq_qual_module;
  this.modules['base_qual_dist'] = base_qual_module; 
  console.log(this.modules)
};
