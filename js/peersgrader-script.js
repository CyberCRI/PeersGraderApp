// http://bl.ocks.org/bunkat/2595950 Scatter plot
/* ******************************************************************** */
/* SET UP ************************************************************* */
/* ******************************************************************** */
var getNumberOfSessions = function(keys) {
  var count = keys.filter(function(str) { return str.indexOf('presenting') > -1; }).length;
  return count
}

/* ******************************************************************** */
/* DATA FORMATING ***************************************************** */
/* ******************************************************************** */
var sortJSON = function (data, key, way) {
  return data.sort(function(a, b) {
    var x = a[key], y = b[key];
    if (way==='123') { return ((x<y)? -1 : ((x>y)?1:0)) ; }
    if (way==='321') { return ((x>y)? -1 : ((x<y)?1:0)) ; }
  });
};
var individualIdToGroupId = function (string) {
  var str = string || '';
  str.match(/\d/)? str= str.match(/.*\d/)[0]: str=str ;
  return str
};

// key : 'actual string on google questionnaire'  <==== !!!!!
var  createListOfTerms = function(sessions){
  var obj = {
    indivEmail : 'Email Address', // 	Session #1 — group presenting to me	Session #1 — grade you give
    indivFamily: 'Name?',
    indivId    : 'Identifiant?',
    country    : 'Country of education?',
    city       : 'City of education?',
    gender     : 'Gender?',
    indivStatus: 'status',  // THIS CAN BE DELETED?
    groupId    : 'Group?', // THIS CAN BE DELETED?
    session    : 'session',
    presenting : 'presenting',
  };
  for (var s=1; s<=sessions; s++) {
    obj['S'+s+'group'] = 'Session #'+s+' — group presenting to me'; // 'title '+S+' on google sheet';
    obj['S'+s+'grade'] = 'Session #'+s+' — grade you give'; // 'title '+S+' on google sheet';
  };
  return obj
}

var finalDataForm = function(item){
  return {
    "indivId"     : item.indivId,
    "averageProfs": item.averageProfs,
    "averagePeers": item.averagePeers,
    "normalness"  : item.normalness,
    "finalGrade"  : item.finalScore,
    "indivFamily" : item.indivFamily,
    "indivEmail"  : item.indivEmail
  }
}

/* ******************************************************************** */
/* Extract instance of Evaluation ************************************* */
// flat data with instance of evaluation "A grade B" and metadata.
var normalizing = function(jsonData, numberOfSessions, terms) {
  var d = [], S = numberOfSessions;
  jsonData.forEach(function(x){
    var evaluationsByStudentX = {
      indivEmail  : x[terms.indivEmail],
      indivFamily : x[terms.indivFamily],
      indivGroupId: individualIdToGroupId(x[terms.indivId]),
      indivId     : x[terms.indivId],
      indivStatus :
        individualIdToGroupId(x[terms.indivId]).match('Prof')?'professor':
        individualIdToGroupId(x[terms.indivId]).match('G')?'student':'observator'
    };
    for (var i=1; i<S+1;i++){
//      console.log('Troll1a!','1/'+'S'+i+'group'||"fails1",'2/'+terms['S'+i+'group']||"fails2",'3/'+individualIdToGroupId(x[terms['S'+i+'group']]||"fails3") );
      evaluationsByStudentX['S'+i+'group'] = individualIdToGroupId(x[terms['S'+i+'group']]);
      evaluationsByStudentX['S'+i+'grade'] = x[terms['S'+i+'grade']] === "I'm presenting (no grade)"? terms.presenting: +x[terms['S'+i+'grade']];
    }
    d.push(evaluationsByStudentX);
  })
  return d;
};

// flattening the database, showing up each instance of evaluation "A grade B" and metadata.
var flattening = function(jsonData, numberOfSessions, terms) {
  var d = [];
  jsonData.forEach(function(x){
    for (var i=1; i<=numberOfSessions;i++){
      var instanceOfEvaluation = {
        session     : i,
        indivEmail  : x[terms.indivEmail],
        indivFamily : x[terms.indivFamily],
        indivId     : x[terms.indivId],
        indivGroupId: individualIdToGroupId(x[terms.indivId]),
        indivStatus :
          individualIdToGroupId(x[terms.indivId]).match('Prof')?'professor':
          individualIdToGroupId(x[terms.indivId]).match('G')?'student':'observator',
        grpEv: individualIdToGroupId(x[terms['S'+i+'group']]),
        grdEv: x[terms['S'+i+'grade']] === "I'm presenting (no grade)"? terms.presenting: +x[terms['S'+i+'grade']]
      };
      d.push(instanceOfEvaluation);
    }
  })
  return d;
};

/* ******************************************************************** */
/* EVALUATIONS ******************************************************** */
/* ******************************************************************** */

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
/* STUDENTS *********************************************************** */
/* ******************************************************************** */
/* 1) Students listing ************************************************ */
var createCleanPersona = function(item){
  var persona = {
    indivStatus : item.indivStatus,
    indivEmail  : item.indivEmail,
    indivFamily : item.indivFamily,
    indivId     : item.indivId,
    indivGroupId: item.indivGroupId,
    gradesPeers : [],
    averagePeers: null,
    gradesProfs : [],
    averageProfs: null,
    averageAll  : null,
    gradesGiven : [],
    normalness  : null,
    finalScore  : null
  }
  return persona
}

var getPersonaList = function(evaluations) {
  let uniqIds = {};
  let filtered = evaluations
      .map(createCleanPersona)
      .filter(obj => !uniqIds[obj.indivId] && (uniqIds[obj.indivId] = true));
  return filtered
}

/* ******************************************************************** */
/* Student grades injection ******************************************* */
/*
var gradesReceivedBy= function(evaluations, presenterId){
  function presenting(item) {
    if(item.indivId == presenterId && item.grdEv == terms.presenting){ return item.session }
  }
  var sessionsPresenting = evaluations.map(presenting);
var evaluations.filter()
  function getFullName(item, index) {
    var fullname = [item.firstname,item.lastname].join(" ");
    return fullname;
  }
  return array
}*/

var getGradesReceived = function(evaluations, students, terms){
  for (var i = 0; i < evaluations.length; i++) {  // add session
    var presenterEval = evaluations[i];
    if (presenterEval.grdEv == terms.presenting) {
      for (var j = 0; j < evaluations.length; j++) {
        var graderEval = evaluations[j];
        if (  graderEval.session == presenterEval.session  // same session
            && graderEval.grpEv  == presenterEval.grpEv // presenting groups are equal
            && graderEval.grdEv !== terms.presenting // evaluator NOT presenting
           ) {
          for (var k = 0; k < students.length; k++) { // for all students
            if (students[k].indivEmail == presenterEval.indivEmail && !isNaN(graderEval.grdEv)) { // if presenter equal the evalued
              graderEval.indivStatus === 'student' || graderEval.indivStatus === 'observator' ?
                students[k].gradesPeers.push([graderEval.indivGroupId, +graderEval.grdEv]):
                students[k].gradesProfs.push([graderEval.indivGroupId, +graderEval.grdEv]); // in var student, collect grade
            }
          }
        }
      }
    }
  }
}

/* ******************************************************************** */
/*  Students A notes given to other injection ************************* */
var getGradesGiven = function(array, terms, sessions, students) {
  var output = array.map(function(x) { // for each students, who graded several times
    var grdGiven = [];
    for (var i = 1; i <= sessions; i++) {
      var grp = x['S'+i+'group'],
          grd = x['S'+i+'grade'] === terms.presenting? terms.presenting: +x['S'+i+'grade'];
      grdGiven.push([grp, grd]);
    }
    for (var i = 0; i < students.length; i++) {
      if (x.indivEmail === students[i].indivEmail) {
        students[i].gradesGiven = grdGiven;
      }
    }
  })
  return output
}
/* ******************************************************************* */
/* Set up ************************************************************ */
/* ******************************************************************* */
var evaluations= [],
    students   = [],
    groupsList = [],
    groups     = [],
    studentsClean=[];

/* ******************************************************************* */
/* ShowInfo ********************************************************** */
/* ******************************************************************* */
function showInfo(data, tabletop) {
  var keys = Object.keys(data[0]),
      sessions = getNumberOfSessions(keys),
      googleTerms = createListOfTerms(sessions); // matching google sheet
  console.log('1/ keys: ',keys.length, keys)
  console.log('2/ sessions: ',sessions)
  console.log('3/ googleTerms: ',googleTerms.length, googleTerms)
  // https://docs.google.com/spreadsheets/d/1cD1Lt4RK2GGmMMi2MoM6nbkvH0c2TrkTbHATUSpipTc
  // http://www.jsoneditoronline.org/?id=f1c7796026cc37212e950eb0ac30b24d

  var evaluations = flattening(data, sessions, googleTerms);
  console.log('4a/ evaluations ',evaluations.length,evaluations); // Students list

    var students = getPersonaList(evaluations).filter(function (e) { return e.indivStatus == 'student';});
    console.log('4b/ students ',students.length,students);

    getGradesReceived(evaluations, students, googleTerms) // not sorted by session
    console.log('4c/ students > gradesReceived ',students.length,students);

  var normalized = normalizing(data, sessions, googleTerms);
  console.log('5a/ normalized ',normalized.length,normalized); // Students list

    getGradesGiven(normalized, googleTerms, sessions, students);
    console.log('5b/ students > gradesGiven ',students.length,students);

  /* ******************************************************************** */
  /* 2b) Students average injection ************************************* */
  for (var i = 0; i < students.length; i++) {
    var row = students[i];
    var sumPeers = row.gradesPeers.reduce(function(a, b) { return a + b[1];}, 0);
    var sumProfs = row.gradesProfs.reduce(function(a, b) { return a + b[1];}, 0);
    // Summing and rounding :
    students[i].averagePeers = Math.round((sumPeers) * 10 / row.gradesPeers.length) / 10;
    // if no teachers, then use gradesPeers
    if(sumProfs) { students[i].averageProfs = Math.round((sumProfs) * 10 / row.gradesProfs.length) / 10, students[i].profReviewed = true  }
    else { students[i].averageProfs = students[i].averagePeers, students[i].profReviewed = false } ;
    students[i].averageAll = Math.round((students[i].averagePeers + students[i].averageProfs) * 10 / 2) / 10; // duplicata with later process ?
  }
console.log('6/ students > averagePeers/averageProf/averageAll: ',students.length,students); // students with grades

  /* ******************************************************************** */
  /* GROUPS ************************************************************* */
  /* This section is a work in progress for additional fairness ********* */
  /* ******************************************************************** */
  /* 1) Groups listing ************************************************** */
  for (var i = 0; i < evaluations.length; i++) {
    var newId = evaluations[i].indivGroupId;
    if (groupsList.indexOf(newId) === -1) {
      groupsList.push(newId);
    }
  }
  console.log('7/ groupsList=[]: ',groupsList.length,groupsList); // Students list
  /* ******************************************************************** */
  /* Groups table creation ********************************************** */
  for (var i = 0; i < groupsList.length; i++) {
    if (!groupsList[i].match('Prof') ) {
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
    avgPeers = Math.round((sumPeers) * 10 / rowGrp.gradesPeers.length) / 10 ;
    avgProfs = sumProfs ? Math.round((sumProfs) * 10 / rowGrp.gradesProfs.length) / 10 : avgPeers,
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
  /* Adjustments ******************************************************** */
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
  /* Seriousness calculation ******************************************** */
  for (var i=0; i< students.length; i++){
    var bonus=0, counter=0, averageTrust=0,
        item = students[i];
    var grdGiven = item.gradesGiven,
        name = item.indivEmail;
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
    console.log('Seriousness overall for',name,bonus,'/',counter,': ',students[i].normalness)
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
  console.log('11/ students > finalGrade: ',students.length, students); // students with grades

  /* ******************************************************************** */
  /* DATA CLEANING ****************************************************** */
  /* ******************************************************************** */
  /* SORTING ************************************************************ */
  var studentsSort = sortJSON(students,'indivId', '123')
  console.log('12/ students > sorted: ',studentsSort.length, studentsSort); // students with grades
  /* ******************************************************************** */
  /* Pre-TABLE ********************************************************** */
  var studentsSortAverages = studentsSort.map(finalDataForm);
  console.log('13/ studentsReformated: ',studentsSortAverages.length, studentsSortAverages); // students with grades

  /* ******************************************************************** */
  /* RENDERING ********************************************************** */
  /* ******************************************************************** */
  var cols = Object.keys(studentsSortAverages[0]);
  tablify(studentsSortAverages, cols);
  // scatterPlot(studentsCleaned);
  violinPlot(studentsSort,"hook-violin");
};


/* ******************************************************************* */
/* Data call ********************************************************* */
/* ******************************************************************* */
var gkeys = {
  "2016.11.25": '1cD1Lt4RK2GGmMMi2MoM6nbkvH0c2TrkTbHATUSpipTc',
  "2017.01.10": '1sqQB46CwxjcTwG46T_cAvoS_B5fT_6abe7_NBaRs0v0',
  "2017.05.12": '1wHNlEtNZoyQ-wgKHMb6wnewpruiGkqTqnX12v8vY6Mo',
  "2017.05.29": '1ZyN70SJImSgttxiETCVNNSmwB5r2lneliFR4KzDLJWs',
  "2017.06.07": '1nmyiVNnGNmSUC8suoQj7s_06D-cFb0UQZvM_odpEYlA',
  "2017.12.01": '1Yz7Njbbu9-lA0sQIMFyF2S5K3LN8bHEbd-nl8v7gHII',
  "2018.01.12": '1xQF8EyIultcDMmZUAOYYU07xIQFW6bGbQFYm8CmC3Q4',
  "2018.04.14": '1KIcOQZcSsM7ifXlypevI2ut7qyqSshLyR8dGmBE7VTo',
  "2018.05.03": '1TcGypsFLd2jvYJrI_AlPRKPhSOYPFpBWa9uvFrwhoLg',
  "testpoem"  : '1MQkHnD-2XJSVnvL5PQDjfygJOJXoeHayVoBiak82jLU'
}
var init = function() {
  var googleSpreadsheetKey = gkeys['2018.04.14'];
  Tabletop.init({
    key: googleSpreadsheetKey,
    callback: showInfo,
    simpleSheet: true
  })
};

// On page load
window.onload = function() { init() };
// On button RUNS click
// in html page
