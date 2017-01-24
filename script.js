// http://bl.ocks.org/bunkat/2595950 Scatter plot

function sortJSON(data, key, way) {
    return data.sort(function(a, b) {
        var x = a[key], y = b[key];
        if (way==='123') { return ((x<y)? -1 : ((x>y)?1:0)) ; }
        if (way==='321') { return ((x>y)? -1 : ((x<y)?1:0)) ; }
    });
}
/* */
  function tabulate(data, columns) {
    var container = d3.select('body').append('div').attr('class','container')
    var table = container.append('table').attr("class", "table table-striped");
    var thead = table.append('thead')
    var	tbody = table.append('tbody');
    // append the header row
    thead.append('tr')
      .selectAll('th')
      .data(columns).enter()
      .append('th')
      .text(function (column) { return column; });
    // create a row for each object in the data
    var rows = tbody.selectAll('tr')
      .data(data)
      .enter()
      .append('tr');
    // create a cell in each row for each column
    var cells = rows.selectAll('td')
      .data(function (row) {
        return columns.map(function (column) {
          return {column: column, value: row[column]};
        });
      })
      .enter()
      .append('td')
      .text(function (d) { return d.value; });
    return table;
  }


var scatterPlot = function(students){
var data = [[5,3], [10,17], [15,4], [2,8]];
   
    var margin = {top: 20, right: 15, bottom: 60, left: 60}
      , width = 960 - margin.left - margin.right
      , height = 500 - margin.top - margin.bottom;
    
    var x = d3.scale.linear()
              .domain([0, d3.max(data, function(d) { return d[0]; })])
              .range([ 0, width ]);
    
    var y = d3.scale.linear()
    	      .domain([0, d3.max(data, function(d) { return d[1]; })])
    	      .range([ height, 0 ]);
 
    var chart = d3.select('body')
        .append('svg:svg')
        .attr('width', width + margin.right + margin.left)
        .attr('height', height + margin.top + margin.bottom)
        .attr('class', 'chart')

    var main = chart.append('g')
	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
	.attr('width', width)
	.attr('height', height)
	.attr('class', 'main')   
        
    // draw the x axis
    var xAxis = d3.svg.axis()
	.scale(x)
	.orient('bottom');

    main.append('g')
	.attr('transform', 'translate(0,' + height + ')')
	.attr('class', 'main axis date')
	.call(xAxis);

    // draw the y axis
    var yAxis = d3.svg.axis()
	.scale(y)
	.orient('left');

    main.append('g')
	.attr('transform', 'translate(0,0)')
	.attr('class', 'main axis date')
	.call(yAxis);

    var g = main.append("svg:g"); 
    
    g.selectAll("scatter-dots")
      .data(data)
      .enter().append("svg:circle")
          .attr("cx", function (d,i) { return x(d[0]); } )
          .attr("cy", function (d) { return y(d[1]); } )
          .attr("r", 8);
}

/* ******************************************************************* */
/* Set up ************************************************************ */
/* ******************************************************************* */
// meta info such id, email, family, etc.
// $("#button").click( function(){ do this; do that; })
var sessions = $( "#inputSessions" ).val() || 6,
    googleSheetKey = '1sqQB46CwxjcTwG46T_cAvoS_B5fT_6abe7_NBaRs0v0'; // $( "#inputGoogleSheet" ).val() || '1cD1Lt4RK2GGmMMi2MoM6nbkvH0c2TrkTbHATUSpipTc' //'1sqQB46CwxjcTwG46T_cAvoS_B5fT_6abe7_NBaRs0v0'
    // '1cD1Lt4RK2GGmMMi2MoM6nbkvH0c2TrkTbHATUSpipTc';
var evaluations= [],
    students   = [],
    groupsList = [],
    groups     = [],
    studentsClean=[];
/* Google Terms ****************************************************** */
var gSheetTerms = { // key : 'actual string on google questionnaire'  <==== !!!!!
  indivEmail : 'Email Address', // 	Session #1 — group presenting for me	Session #1 — grade you give
  indivFamily: 'Name?',
  indivId    : 'Identifiant?',
  indivStatus: 'status',
  groupId    : 'Group?',
  session    : 'session',
  presenting : 'presenting'
};
for (var S = 1; S < sessions + 1; S++) {
  gSheetTerms['S'+S+'group'] = 'Session #'+S+' — group presenting for me'; // 'title '+S+' on google sheet';
  gSheetTerms['S'+S+'grade'] = 'Session #'+S+' — grade you give'; // 'title '+S+' on google sheet';
};
// console.log('01/ gTerms: ', JSON.stringify(gSheetTerms)) // google sheet's columns titles and terms

/* ******************************************************************* */
/* Data call ********************************************************* */
/* ******************************************************************* */
window.onload = function() {
  init()
};

function init() {
  Tabletop.init({
    key: googleSheetKey,
    callback: showInfo,
    simpleSheet: true
  })
}

function showInfo(data, tabletop) {
  var t = gSheetTerms,
      d=data;
  // https://docs.google.com/spreadsheets/d/1cD1Lt4RK2GGmMMi2MoM6nbkvH0c2TrkTbHATUSpipTc
  // http://www.jsoneditoronline.org/?id=f1c7796026cc37212e950eb0ac30b24d
//  console.log('2 / ', JSON.stringify(d[0]));

  /* ******************************************************************** */
  /* EVALUATIONS (instances of) ***************************************** */
  /* ******************************************************************** */
   // flattening the database, showing up each instance of evaluation "A grade B" and metadata.
  var normalizing = function(jsonData, numberOfSessions) {
    var d = [], S = numberOfSessions;
    jsonData.forEach(function(x){
      var evaluationsByStudentX = {
        indivEmail : x["Email Address"],
        indivFamily: x['Name?'],
        indivGroupId:x['Group?'],
        indivId    : x['Identifiant?'],	
        indivStatus: x['Group?'].replace(/[0-9]/g,'') === 'Profs'?'professor':'student'
      };
      for (var i=1; i<S+1;i++){
        evaluationsByStudentX['S'+i+'group'] = x['Session #'+i+' — group presenting for me'];
        evaluationsByStudentX['S'+i+'grade'] = x['Session #'+i+' — grade you give'] === "I'm presenting (no grade)"? t.presenting: +x['Session #'+i+' — grade you give'];
      }
      d.push(evaluationsByStudentX);
    })
    return d;
  };
  // console.log('3a/ normalized[0] premise:',sessions, data[0]);
  var normalized = normalizing(data, 6);
  console.log('3b/ normalized[0] :',JSON.stringify([normalized[0], normalized[1],normalized[2]]));

  
  // flattening the database, showing up each instance of evaluation "A grade B" and metadata.
  var flattening = function(jsonData, numberOfSessions) {
    var d = [];
    jsonData.forEach(function(x){
      for (var i=1; i<numberOfSessions+1;i++){
        var instanceOfEvaluation = {
          session     : i,
          indivEmail  : x.indivEmail,
         // indivFamily: x.indivFamily,
          indivGroupId: x.indivGroupId,
          indivId     : x.indivId,	
          indivStatus : x.indivStatus,
          grpEv: x['S'+i+'group'],
          grdEv: x['S'+i+'grade']
        };
        d.push(instanceOfEvaluation);
      }
    })
    return d;
  };
 // console.log('4a/ evaluations[0] premises :',sessions, t, normalized[0]);
  var evaluations = flattening (normalized, sessions, t);
  // console.log('4c/ evaluations[0]: ', JSON.stringify(evaluations[0]) ); // Evaluations

  /* ******************************************************************** */
  /* STUDENTS *********************************************************** */
  /* ******************************************************************** */
  /* 1) Students listing ************************************************ */
  var studentsInit = function(d){
    var students =[], toto=0;
    for (var i = 0; i < d.length; i++) {
      if (d[i].indivStatus === 'student') {
        var student = {
          indivEmail  : d[i].indivEmail,
          indivFamily : d[i].indivFamily,
          indivId     : d[i].indivId,
          indivGroupId: d[i].indivGroupId,
          gradesPeers : [],
          averagePeers: null,
          gradesProfs : [],
          averageProfs: null,
          averageAll  : null,
          gradesGiven : [],
          normalness  : null,
          finalScore  : null
        }
        students.push(student);
      } 
    } return students;
  }
  var students = studentsInit(normalized);
 // console.log('6b/ students[0] ',JSON.stringify(students[0])); // Students list

    console.log('6b/ evaluations ',JSON.stringify(evaluations)); // Students list
    console.log('6b/ students ',JSON.stringify(students)); // Students list

  /* ******************************************************************** */
  /* Student grades injection ******************************************* */
  var getGradesReceived = function(evaluations, students, terms){
    for (var i = 0; i < evaluations.length; i++) {  // add session
      var presenterEval = evaluations[i];
      if (presenterEval.grdEv == t.presenting) {    
        for (var j = 0; j < evaluations.length; j++) {
          var graderEval = evaluations[j];
          if (  graderEval.session == presenterEval.session  // same session
              && graderEval.grpEv  == presenterEval.grpEv // presenting groups are equal
              && graderEval.grdEv !== t.presenting // evaluator NOT presenting
             ) { 
            for (var k = 0; k < students.length; k++) { // for all students
              if (students[k].indivEmail == presenterEval.indivEmail) { // if presenter equal the evalued
                graderEval.indivStatus === 'student' ?
                  students[k].gradesPeers.push([graderEval.indivGroupId, +graderEval.grdEv]):
                  students[k].gradesProfs.push([graderEval.indivGroupId, +graderEval.grdEv]); // in var student, collect grade
              }
            }
          }
        }
      }
    }
  }
  getGradesReceived(evaluations, students, t) // not sorted by session
    console.log('6c/ students[0]: ',JSON.stringify(students[0])); // Students list

  /* ******************************************************************** */
  /*  Students A notes given to other injection ************************* */
  var studentsGrdGiven = normalized.map(function(x) { // for each students, who graded several times
    var grdGiven = [];
    for (var i = 1; i <= sessions; i++) {
      var grp = x['S'+i+'group'],
          grd = x['S'+i+'grade'] === t.presenting? t.presenting: +x['S'+i+'grade'];
      grdGiven.push([grp, grd]);
    }
    for (var i = 0; i < students.length; i++) {
      if (x.indivEmail === students[i].indivEmail) {
        students[i].gradesGiven = grdGiven;
      }
    }
  });
//  console.log('6d/ students[0] ',JSON.stringify(students[0])); // Students list

  /* ******************************************************************** */
  /* 2b) Students average injection ************************************* */
  for (var i = 0; i < students.length; i++) {
    var row = students[i];
    var sumPeers = row.gradesPeers.reduce(function(a, b) { return a + b[1];}, 0);
    var sumProfs = row.gradesProfs.reduce(function(a, b) { return a + b[1];}, 0); 
    students[i].averagePeers = Math.round((sumPeers) * 10 / row.gradesPeers.length) / 10;
    students[i].averageProfs = Math.round((sumProfs) * 10 / row.gradesProfs.length) / 10;
    students[i].averageAll = Math.round((students[i].averagePeers + students[i].averageProfs) * 10 / 2) / 10;
  }
console.log('8/ students: ',JSON.stringify([students[0],students[1]])); // students with grades

  /* ******************************************************************** */
  /* GROUPS ************************************************************* */
  /* ******************************************************************** */
  /* 1) Groups listing ************************************************** */
  for (var i = 0; i < normalized.length; i++) {
    var newId = normalized[i].indivGroupId;
    if (groupsList.indexOf(newId) === -1) {
      groupsList.push(newId);
    }
  }
  console.log('9/ groupsList=[]: ', JSON.stringify(groupsList)); // Students list
  /* ******************************************************************** */
  /* Groups table creation ********************************************** */
  for (var i = 0; i < groupsList.length; i++) {
    if (groupsList[i] !== 'Profs') {
      groups.push({
        groupId: groupsList[i],
        gradesPeers: [],
        averagePeers: null,
        gradesProfs: [],
        averageProfs: null,
        averageAll: null
      })
    }
  }
  /* ******************************************************************** */
  /* Groups grades gathering ******************************************** */
  for (var i = 0; i < groups.length; i++) {
    var rowGrp = groups[i];
    for (var j = 0; j < evaluations.length; j++) {
      var rowEv = evaluations[j];
      if (rowEv.grdEv !== 'presenting' && rowGrp.groupId === rowEv.grpEv) {
        rowEv.indivStatus === 'professor' ?
          groups[i].gradesProfs.push(rowEv.grdEv) :
          groups[i].gradesPeers.push(rowEv.grdEv);
      }
    }
  }
  /* ******************************************************************** */
  /* Groups averages calculus ******************************************* */
  for (var i = 0; i < groups.length; i++) {
    var rowGrp = groups[i];
    var sumPeers = rowGrp.gradesPeers.reduce(function(a, b) { return a + b; }, 0),
      sumProfs = rowGrp.gradesProfs.reduce(function(a, b) { return a + b; }, 0);
    var avgPeers = Math.round((sumPeers) * 10 / rowGrp.gradesPeers.length) / 10,
      avgProfs = Math.round((sumProfs) * 10 / rowGrp.gradesProfs.length) / 10,
      avgAll = Math.round((avgPeers + avgProfs) / 2 * 10) / 10;
    groups[i].averagePeers = avgPeers;
    groups[i].averageProfs = avgProfs;
    groups[i].averageAll = avgAll;
  }
  var grpClean = groups.map(function(x) {
    return {
      grp: x.groupeId,
      averagePeers: x.averagePeers,
      averageProfs: x.averageProfs
    };
  });
 
  /* ******************************************************************** */
  /* ADJUSTMENTS ******************************************************** */
  /* ******************************************************************** */
  /* Fill averageProfs for students never reviewed by prof ************** */
  for (var i = 0; i < students.length; i++) {
    for (var j = 0; j < groups.length; j++) {
      if (!students[i].averageProfs && students[i].indivGroupId === groups[j].groupId) {
        students[i].averageProfs = groups[j].averageProfs || students[i].averagePeers ;
      }
    }
  }
 //                         console.log("10/ groups[0]: ", JSON.stringify(groups));

  /* ******************************************************************** */
  /* NORMALNESS SCORE *************************************************** */
  /* ******************************************************************** */
  /* SeriousnessAssessment (function) *********************************** */
  var seriousnessAssessment = function(a, b, bonus, counter){ 
    var distance = Math.abs(a - b),
        bump = 0;
    if      (distance<= 1) { bump=20; }
    else if (distance<= 2) { bump=16; }
    else if (distance<= 4) { bump=10; }
    else if (distance<= 6) { bump= 6; }
    else { bump= 0; }
    bonus= bonus + bump;
    counter= counter+1;
    return [bonus,counter,bump]
  }

  /* ******************************************************************** */
  /* Seriousness calculation ******************************************** */
  for (var i=0; i< students.length; i++){
    var bonus=0, counter=0, averageTrust=0,
        row = students[i];
    var grdGiven = row.gradesGiven,
        name = row.indivEmail;
    for (var j=0;j<grdGiven.length;j++){
      var grp = grdGiven[j][0], 
          grd = grdGiven[j][1];
      for (var k=0;k<groups.length;k++){ //2
        if(grp === groups[k].groupId && typeof grd === 'number'){
          var avgProfs= groups[k].averageProfs, 
              avgAll  = groups[k].averageAll;
          var res = seriousnessAssessment(avgAll,grd,bonus,counter),
          bonus   = res[0],
          counter = res[1];
          var bump= res[2];
//        console.log('Seriousness -- Eval by x:',[groupId,grd],'; Eval by all:',[groupId,avgAll],'=> ',bump);
        }
      }
    }
    students[i].normalness = ( Math.round((bonus/counter)*10)/10*1);
  //  console.log('Seriousness overall for',name,bonus,'/',counter,': ',students[i].normalness)
  }
  
  /* ******************************************************************** */
  /* FINAL STUDENT SCORE ************************************************ */
  /* ******************************************************************** */
  /* Final grade injection ************** */
  for (var i = 0; i < students.length; i++) {
    var row = students[i],
        sum = .50*(row.averageProfs) + .25*row.averagePeers + .25*row.normalness;
    students[i].finalScore = Math.round((sum) * 10) / 10;
  }
//  console.log('11/ students[0]: ', JSON.stringify(students[0])); // students with grades

  /* ******************************************************************** */
  /* DATA CLEANING ****************************************************** */
  /* ******************************************************************** */
  studentsClean = students.map(function(x){
   // console.log(x)
    return {
      // "indivGrp": x.indivGroupId,
      "indivId"     : x.indivId,
      "averagePeers": x.averagePeers,
      "averageProfs": x.averageProfs,
      "normalness"  : x.normalness,
      "finalGrade"  : x.finalScore,
      "indivFamily" : x.indivFamily,
      "indivEmail"  : x.indivEmail
    }
  });
  //                          console.log('12/ studentsClean[0]: ', JSON.stringify(studentsClean)); // students with grades 


// Builds the HTML Table out of myList.
  // render the table(s)
  studentsClean = sortJSON(studentsClean,'indivId', '123'); // 123 or 321
  var cols = Object.keys(studentsClean[0]);
  tabulate(studentsClean, cols);
  scatterPlot(studentsClean);
  
};


