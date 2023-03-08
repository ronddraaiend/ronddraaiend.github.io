var keizerutility = {

  getData: function (filename, callback) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var text = this.responseText;
        var data = keizerutility.GetDataFromFileText(text);

        var tables = new Object;
        tables.results = keizerutility.createResultsTable(data);
        tables.results.classList.add('keizerresults'); // IE 11 doesn't support multi-args
        tables.results.classList.add('keizertable');

        tables.rankings = keizerutility.createRankingsTable(data);
        tables.rankings.classList.add('keizerrankings');
        tables.rankings.classList.add('keizertable');

        callback(tables);
      }
    };
    request.open('get', filename, true);
    request.send();
  },

  GetDataFromFileText: function (alltext) {
    var data = new Object;
    var lines = alltext.split('\r\n');
    for (var linenr = 0; linenr < lines.length; linenr++) {
      if (linenr == 0) {
        data.roundinfo = this.getRoundInfo(lines[0]);
      } else if (lines[linenr].substring(0, 3).toLowerCase() == 'wit') {
        data.results = this.getResults(lines, linenr + 1);
        linenr += data.results.length;
      } else if (lines[linenr].substring(0, 2).toLowerCase() == 'nr') {
        data.rankings = this.getRankings(lines, linenr + 1);
        linenr += data.rankings.length;
      }
    }
    return data;
  },

  getRoundInfo: function (line) {
    var info = new Object;
    var roundnr = 0, datenr = 0;
    var lineparts = line.split(';');
    var words = lineparts[0].split(' ');
    for (var i = 0; i < words.length; i++) {
      if (words[i] == 'ronde') roundnr = i + 1;
      if (words[i] == 'op') datenr = i + 1;
    }
    info.roundnumber = parseInt(words[roundnr].replace(',', ''));
    info.date = '';
    for (var i = datenr; i < words.length; i++) {
      if (words[i].trim().length > 0) {
        info.date += words[i].trim() + ' ';
      }
    }
    return info;
  },

  GameType: Object.freeze({
    normal: { value: 1, text: "Normal game" },
    team: { value: 2, text: "Externe wedstrijd" },
    odd: { value: 3, text: "Oneven" },
    nogame: { value: 4, text: "Niet gespeeld buiten schuld" },
    abswith: { value: 5, text: "Afwezig met geldige reden" },
    abswithout: { value: 6, text: "Afwezig zonder geldige reden" },
    missing: { value: 7, text: "Afwezig zonder kennisgeving" }
  }),

  getResults: function (lines, startnr) {
    var results = [];
    for (var i = startnr; lines[i].split(';')[0].trim().length > 0; i++) {
      var result = new Object;
      var words = lines[i].split(';');
      for (var gt in this.GameType) {
        if (words[2].search(this.GameType[gt].text) >= 0) {  // found
          result.player = words[0];
          result.gametype = this.GameType[gt];
          if (this.GameType[gt] == this.GameType.team) {
            result.result = words[3];
          }
          break;
        }
      }
      if (result.player === undefined) {
        result.gametype = this.GameType.normal;
        result.white = words[0];
        result.black = words[2];
        result.result = words[3];
      }
      if (result.result !== undefined) {
        result.result = result.result.replace(new RegExp(String.fromCharCode(65533), 'g'), '&frac12;');
      }
      results.push(result);
    }
    return results;
  },

  formatPoints: function (str) {
    var s = str.replace(',', '.');
    var n = parseFloat(s);
    s = n.toFixed(2).replace('.', ',');
    return s;
  },

  getRankings: function (lines, startnr) {
    var ranks = [];
    for (var i = startnr; i < lines.length && lines[i].trim().length > 0; i++) {
      var words = lines[i].split(';');
      // nr, name, points, value
      // games, win, draw, loss, adj
      // percent, wp , sb, color, alternation
      // odd, notplayed, nbs, zk
      words[2] = this.formatPoints(words[2]);
      ranks.push(words);
    }
    return ranks;
  },

  createResultsTable: function (data) {
    var tbl = document.createElement('table');
    var tr = document.createElement('tr');
    var td = document.createElement('td');
    td.innerHTML = 'Resultaten ronde ' + data.roundinfo.roundnumber + ' (' + data.roundinfo.date + ')';
    td.colSpan = 4;
    tr.appendChild(td);
    tbl.appendChild(tr);

    var tr = document.createElement('tr');
    var td = document.createElement('td');
    td.innerHTML = 'Wit';
    tr.appendChild(td);
    var td = document.createElement('td');
    tr.appendChild(td);
    var td = document.createElement('td');
    td.innerHTML = 'Zwart';
    tr.appendChild(td);
    var td = document.createElement('td');
    td.innerHTML = 'Uitslag';
    tr.appendChild(td);
    tbl.appendChild(tr);

    for (var i = 0; i < data.results.length; i++) {
      if (data.results[i].gametype == this.GameType.normal) {
        var tr = document.createElement('tr');
        var td = document.createElement('td');
        td.innerHTML = data.results[i].white;
        tr.appendChild(td);
        var td = document.createElement('td');
        td.innerHTML = '-';
        tr.appendChild(td);
        var td = document.createElement('td');
        td.innerHTML = data.results[i].black;
        tr.appendChild(td);
        var td = document.createElement('td');
        td.innerHTML = data.results[i].result;
        tr.appendChild(td);
        tbl.appendChild(tr);
      }
    }

    for (var i = 0; i < data.results.length; i++) {
      if (data.results[i].gametype == this.GameType.team) {
        var tr = document.createElement('tr');
        var td = document.createElement('td');
        td.innerHTML = data.results[i].player;
        tr.appendChild(td);
        var td = document.createElement('td');
        td.innerHTML = '';
        tr.appendChild(td);
        var td = document.createElement('td');
        td.innerHTML = data.results[i].gametype.text;
        tr.appendChild(td);
        var td = document.createElement('td');
        td.innerHTML = data.results[i].result;
        tr.appendChild(td);
        tbl.appendChild(tr);
      }
    }

    var tr = document.createElement('tr');
    var td = document.createElement('td');
    td.colSpan = 2;
    for (var gt in { odd: 0, nogame: 0, abswith: 0 }) {
      this.addCategory(td, data.results, gt);
    }
    tr.appendChild(td);

    var td = document.createElement('td');
    td.colSpan = 2;
    for (var gt in { abswithout: 0, missing: 0 }) {
      this.addCategory(td, data.results, gt);
    }
    tr.appendChild(td);
    tbl.appendChild(tr);

    return tbl;
  },

  addCategory: function (td, results, category) {
    if (results.some(function (r) { return r.gametype == keizerutility.GameType[category]; })) {
      var d = document.createElement('div');
      d.classList.add('div' + category);
      d.innerHTML = keizerutility.GameType[category].text;
      results.filter(function (r) { return r.gametype == keizerutility.GameType[category]; })
                    .forEach(function (r) { d.innerHTML += '<br>&nbsp;' + r.player; });
      td.appendChild(d);
    }
  },

  createRankingsTable: function (data) {
    var tbl = document.createElement('table');
    var tr = document.createElement('tr');
    var td = document.createElement('td');
    td.innerHTML = 'Stand na ronde ' + data.roundinfo.roundnumber + ' (' + data.roundinfo.date + ')';
    td.colSpan = 18;
    tr.appendChild(td);
    tbl.appendChild(tr);

    var rankheaders = ['Nr', 'Naam', 'Punten', 'Waarde', 'Part', '1', '&frac12;', '0',
                     'Afg', '%', 'WP', 'SB', 'Kleur', 'Alt', 'Oneven', 'Afw', '', ''];
    var tr = document.createElement('tr');
    for (var i = 0; i < rankheaders.length; i++) {
      var td = document.createElement('td');
      td.innerHTML = rankheaders[i];
      tr.appendChild(td);
    }
    tbl.appendChild(tr);

    for (var i = 0; i < data.rankings.length; i++) {
      var tr = document.createElement('tr');
      for (var k = 0; k < data.rankings[i].length; k++) {
        var td = document.createElement('td');
        td.innerHTML = data.rankings[i][k];
        tr.appendChild(td);
      }
      tbl.appendChild(tr);
    }

    return tbl;
  }
}
