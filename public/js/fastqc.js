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
      i += 2;
      curLine = lines[i].split('\t');

      while (curLine[0] !== '>>END_MODULE') {
        var base_dist = {};
        base_dist['base_num'] = +curLine[0];
        base_dist['G'] = +curLine[1];
        base_dist['A'] = +curLine[2];
        base_dist['T'] = +curLine[3];
        base_dist['C'] = +curLine[4];
        base_qual_module['base_percentages'].push(base_dist);
        i += 1;
        curLine = lines[i].split('\t');
      }
    }

    // Parse the per-sequence GC content section of the FASTQC
    // output file and merge all parsed lines into seq_gc_content object
    else if(curLine[0] === '>>Per sequence GC content') {
      var seq_gc_content = {};
      seq_gc_content['status'] = curLine[1];
      seq_gc_content['gc'] = [];
      i += 2;
      curLine = lines[i].split('\t');

      while (curLine[0] !== '>>END_MODULE') {
        var gc_content = {};
        gc_content['gc'] = curLine[0];
        gc_content['count'] = curLine[1];
        seq_gc_content['gc'].push(gc_content);
        i += 1;
        curLine = lines[i].split('\t');
      }
    }

    // Parse the per-sequence N content section of the FASTQC
    // output file and merge all parsed lines into seq_n_content object
    else if(curLine[0] === '>>Per base N content') {
      var seq_n_content = {};
      seq_n_content['status'] = curLine[1];
      seq_n_content['n'] = [];
      i += 2;
      curLine = lines[i].split('\t');

      while (curLine[0] !== '>>END_MODULE') {
        var n_content = {};
        n_content['n'] = curLine[0];
        n_content['count'] = curLine[1];
        seq_n_content['n'].push(n_content);
        i += 1;
        curLine = lines[i].split('\t');
      }
    }


    // Parse the sequence length distribution section of the FASTQC
    // output file and merge all parsed lines into seq_lengths object
    else if(curLine[0] === '>>Sequence Length Distribution') {
      var seq_lengths = {};
      seq_lengths['status'] = curLine[1];
      seq_lengths['lengths'] = [];
      i += 2;
      curLine = lines[i].split('\t');

      while (curLine[0] !== '>>END_MODULE') {
        var length = {};
        length['length'] = curLine[0];
        length['count'] = curLine[1];
        seq_lengths['lengths'].push(length);
        i += 1;
        curLine = lines[i].split('\t');
      }
    }

    // Parse the per-sequence N content section of the FASTQC
    // output file and merge all parsed lines into seq_n_content object
    else if(curLine[0] === '>>Sequence Duplication Levels') {
      var seq_duplication = {};
      seq_duplication['status'] = curLine[1];
      seq_duplication['duplication'] = [];
      
      i += 1;
      curLine = lines[i].split('\t');
      seq_duplication['total_dupe_perc'] = curLine[1]
      
      i += 2;
      curLine = lines[i].split('\t');

      while (curLine[0] !== '>>END_MODULE') {
        var duplication = {};
        duplication['level'] = curLine[0];
        duplication['perc_dedupe'] = curLine[1];
        duplication['perc_total'] = curLine[2];
        seq_duplication['duplication'].push(duplication);
        i += 1;
        curLine = lines[i].split('\t');
      }
    }

    // Parse the per-sequence N content section of the FASTQC
    // output file and merge all parsed lines into seq_n_content object
    else if(curLine[0] === '>>Overrepresented sequences') {
      var overrep_seqs = {};
      seq_duplication['status'] = curLine[1];
      seq_duplication['overrep'] = [];
      
      i += 1;
      curLine = lines[i].split('\t');

      while (curLine[0] !== '>>END_MODULE') {
        var overrep_seq = {};
        overrep_seq['level'] = curLine[0];
        overrep_seq['perc_dedupe'] = curLine[1];
        seq_duplication['duplication'].push(duplication);
        i += 1;
        curLine = lines[i].split('\t');
      }
    }

    // Parse the adapter content section of the FASTQC output file
    // and merge all parsed lines into adapter_content object
    else if(curLine[0] === '>>Adapter Content') {
      var adapter_content = {};
      adapter_content['status'] = curLine[1];
      adapter_content['content'] = [];
      
      i += 2;
      curLine = lines[i].split('\t');

      while (curLine[0] !== '>>END_MODULE') {
        var cur_position = {};
        cur_position['position'] = curLine[0];
        cur_position['ill_universal'] = curLine[1];
        cur_position['ill_small_rna'] = curLine[2];
        cur_position['nextera_trans'] = curLine[3];
        adapter_content['content'].push(cur_position);
        i += 1;
        curLine = lines[i].split('\t');
      }
    }

    // Parse the kmer content of the FASTQC output file
    // and merge all parsed lines into kmer_content object
    else if(curLine[0] === '>>Kmer Content') {
      var kmer_content = {};
      kmer_content['status'] = curLine[1];
      kmer_content['kmer'] = [];
      
      i += 2;
      curLine = lines[i].split('\t');

      while (curLine[0] !== '>>END_MODULE') {
        var cur_kmer = {};
        cur_kmer['sequence'] = curLine[0];
        cur_kmer['count'] = curLine[1];
        cur_kmer['pvalue'] = curLine[2];
        cur_kmer['obs_exp_max'] = curLine[3];
        cur_kmer['max_obs_exp_pos'] = curLine[4];
        kmer_content['kmer'].push(cur_kmer);
        i += 1;
        curLine = lines[i].split('\t');
      }
    }
  }

  // combine the parsed section objects into a single module object/array
  this.modules['basic'] = basic_module;
  this.modules['qual'] = qual_module;
  this.modules['score'] = seq_qual_module;
  this.modules['base_qual_dist'] = base_qual_module; 
  this.modules['seq_gc_content'] = seq_gc_content;
  this.modules['seq_n_content'] = seq_n_content;
  this.modules['seq_lengths'] = seq_lengths;
  this.modules['seq_duplication'] = seq_duplication;
  this.modules['adapter_content'] = adapter_content;
  this.modules['kmer_content'] = kmer_content;
};
