var funcs = {
createmenu: function() {
    var menus = [
                  {text:'Zukertort', items: [
                           {text:'Hoofdpagina', url:'/index.html' },
                           {text:'Nieuws', url:'/nieuws.html' },
                           {text:'Zukertort Blog', url:'http://zukertortamstelveen.blogspot.nl' },
                           {text:'Michel\'s blog', url:'https://schaakblog.nl' },
                           {text:'Jaarkalender', url:'/kalender.html#currentdate' },
                           {text:'Ratinglijst', url:'/ratings.html' },
                           {text:'Links', url:'/links.html' },
                  ] },
                  {text:'Extern', items: [
                           {text:'Zukertort Amstelveen 1', url:'/a1.html' },
                           {text:'Zukertort Amstelveen 2', url:'/a2.html' },
                           {text:'Zukertort Amstelveen 3', url:'/a3.html' },
                           {text:'Zukertort Amstelveen 4', url:'/a4.html' },
                           {text:'Zukertort Amstelveen SGA 1', url:'/z1.html' },
                  ] },
                  {text:'Intern', items: [
                           {text:'Info open kampioenschap', url:'/openkamp.html' },
                           {text:'Uitslagen/stand Groep A', url:'/zaintern2223.php' },
                           {text:'Uitslagen/stand Groep B', url:'/keizer2223.html' },
                           {text:'Rapid / Simoniscup', url:'/rapid.html' },
                           {text:'Snelschaak / Verlaancup', url:'/snelschaak.html' },
                           {text:'Open Snelschaak 2019', url:'/opensnel/opensnel2019.html' },
                           {text:'Klokken instellen', url:'/klokken.html' },
                           {text:'Reglementen', url:'/reglementen.html' },
                  ] },
                  {text:'Jeugd', items: [
                           {text:'Zukertort jeugd', url:'/jeugd/index.html', target:"_blank" },
                  ] },
                  {text:'Historie', items: [
                           {text:'Geschiedenis', url:'/geschiedenis.html' },
                           {text:'Jan Herman Zukertort', url:'http://polishheritage.co.uk/index.php?option=com_content&view=article&id=289:polish-history-jan-herman-zukertort&catid=58:jan-herman-zukertort-&Itemid=288' },
                           {text:'Archief', url:'/archief.html' },
                           {text:'Nico Louters "Deserteurs"', url:'/deserteurs/deserteurs.php' },
                           {text:'Kampioenen', url:'/kampioenen.html' },
                           {text:'Winnaars Van Elmptbeker', url:'/vanelmpt.html' },
                  ] },
                  {text:'Contact', items: [
                           {text:'Bestuur', url:'/bestuur.html' },
                           {text:'Locatie/Route', url:'/route.html' },
                           {text:'Lid worden', url:'/lidinfo.html' },
                           {text:'Privacybeleid', url:'/privacybeleid.html' },
                           {text:'Disclaimer', url:'/disclaimer.html' },
                           {text:'Huishoudelijk reglement', url:'/huishregl.html' },
                           {text:'Statuten', url:'/statuten.html' },
                  ] },
                 ]
    var menu = document.createElement('ul');
    menu.id = 'menu';
    for (var i = 0; i < menus.length; i++) {
        var li = document.createElement('li');
        li.innerHTML = menus[i].text;
        var submenu = document.createElement('ul');
        for (var k = 0; k < menus[i].items.length; k++) {
            var subli = document.createElement('li');
            subli.innerHTML = menus[i].items[k].text;
            subli.nextpage = menus[i].items[k].url;
            if( menus[i].items[k].target )
               subli.targetname = menus[i].items[k].target;
            subli.addEventListener('mouseover', this.keepshowing)
            subli.addEventListener('mouseout', this.stopshowing)
            submenu.appendChild(subli);
        }
        submenu.style.display = 'none';

        li.appendChild(submenu);
        li.addEventListener('mouseover', this.showmenu);
        li.addEventListener('mouseout', this.hidemenu);
        menu.appendChild(li);
    }
    return menu;
},

showmenu: function (e) {
    var ul = e.target.getElementsByTagName('ul')[0];
    if (ul != null) {
        ul.style.position = 'absolute';
        var left = e.target.getBoundingClientRect().left;
        if ( ! isEarlyChrome() ) // or old mobile
          left += window.pageXOffset;
        ul.style.left = left + 'px';
        //ul.style.top = e.target.style.top + e.target.style.height + 1;
        ul.style.display = 'block';
    }
    e.stopPropagation();

      function isEarlyChrome() {
        var s = window.navigator.userAgent;
        var pos = s.search('Chrome');
        if( pos < 0 ) return false;
        var version = parseInt(s.substr(pos+7,2));
        return version <= 52;
      }
},

hidemenu: function (e) {
    e.stopPropagation();
    var ul = e.target.getElementsByTagName('ul')[0];
    if (ul != null)
        ul.style.display = 'none';
},

keepshowing: function (e) {
    e.stopPropagation();
    e.target.parentNode.style.display = 'block';
},

stopshowing: function (e) {
    e.stopPropagation();
    e.target.parentNode.style.display = 'none';
},

gotolink: function (e) {
    e.stopPropagation();
    if( e.target.nextpage ) {
      e.target.parentNode.style.display = 'none';
      if( e.target.targetname )
        window.open( e.target.nextpage, e.target.targetname);
      else
        window.open( e.target.nextpage, "_self");
    }
},

createbanner: function () {
  var tbl = document.createElement('table');
  tbl.style.width='100%';
  tbl.style.borderBottom = '1px blue solid';
  var tr = document.createElement('tr');
  tr.appendChild(this.createpic());
  
  var td = document.createElement('td');
  td.style.verticalAlign = 'top';
  td.style.textAlign = 'center';
  var div = document.createElement('div');
  div.id = 'clubname';
  var txt = document.createTextNode('Zukertort Amstelveen');
  div.appendChild(txt);
  td.appendChild(div);
  // td.appendChild(document.createElement('br'));
  var menu = funcs.createmenu();
  menu.addEventListener("click", this.gotolink);
  td.appendChild(menu);
  tr.appendChild(td);

  // tr.appendChild(this.createsoebanner());
  tr.appendChild(this.createsponsorkliks());

  tbl.appendChild(tr);
  return tbl;
},

createpic: function () {
  var tdpic = document.createElement('td');
  var img = document.createElement('img');
  img.src='/zukertortbluelogo.gif';
  img.alt='Zukertort Amstelveen'
  img.width=108;
  img.height=108;
  tdpic.appendChild(img)
  return tdpic;
},

createsponsorkliks: function () {
  var title ="SponsorKliks, sponsor Zukertort gratis!";
  var tds = document.createElement('td');
  var div = document.createElement('div');
  div.id='sponsor';
  div.title = title;
  div.style.width='208px';
  div.style.height = '104px';
  div.style.textAlign='center';
  div.style.backgroundColor = '#18a689';

  var ifr = document.createElement('iframe');
  ifr.frameborder = 0;
  ifr.width = 200;
  ifr.height = 100;
  ifr.src = "https://bannerbuilder.sponsorkliks.com/skinfo.php?&background-color=FFFFFF&text-color=000080&header-background-color=304B61&header-text-color=FFFFFF&odd-row=FFFFFF&even-row=09494a&odd-row-text=09494a&even-row-text=ffffff&type=financial&club_id=3846&width=250&height=100";
  div.appendChild(ifr);

  tds.appendChild(div);
  return tds;
}

};
function startpage() {
    if ( window.start ) window.start();
    // return;
    var tbl = funcs.createbanner();
    document.body.insertAdjacentElement('afterbegin', tbl);
}
