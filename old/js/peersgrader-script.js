// http://bl.ocks.org/bunkat/2595950 Scatter plot
/* ******************************************************************** */
/* SET UP ************************************************************* */
/* ******************************************************************** */
var dev = true;
var cl = function(parameters){
  if(dev){ console.log(parameters);}
};
var getNumberOfSessions = function(keys) {
  var count = keys.filter(function(str) { return str.indexOf('presenting') > -1; }).length;
  return count
}

var getUrlVars = function() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
    vars[key] = value;
  });
  return vars;
}
cl(["window.location.search",getUrlVars()["google"]]);
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
    date       : 'Event',
    indivEmail : 'Email Address', // 	Session #1 — group presenting to me	Session #1 — grade you give
    indivFamily: 'Name?',
    indivId    : 'Identifiant?',
    country    : 'Country of education?',
    city       : 'City of education?',
    gender     : 'Gender?',
    session    : 'session',
    presenting : 'presenting',
  };
  for (var s=1; s<=sessions; s++) {
    obj['S'+s+'group'] = 'Session #'+s+' — group presenting to me'; // 'title '+S+' on google sheet';
    obj['S'+s+'grade'] = 'Session #'+s+' — grade you give'; // 'title '+S+' on google sheet';
  };
  return obj
}

/* ******************************************************************** */
/* Extract instance of Evaluation ************************************* */

// flattening the database, showing up each instance of evaluation "A grade B" and metadata.
var flattening = function(jsonData, numberOfSessions, terms) {
  var d = [];
  jsonData.forEach(function(x){
    for (var i=1; i<=numberOfSessions;i++){
      var instanceOfEvaluation = {
        date        : x[terms.date],
        session     : i,
        indivEmail  : x[terms.indivEmail],
        indivFamily : x[terms.indivFamily],
        indivId     : x[terms.indivId],
        indivGroupId: individualIdToGroupId(x[terms.indivId]),
        indivGender : x[terms.gender],
        indivCity   : x[terms.city],
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
/* STUDENTS *********************************************************** */
/* ******************************************************************** */
/* 1) Students listing ************************************************ */
var createCleanPersona = function(item){
  var persona = {
    date   : item.date,
    indivStatus : item.indivStatus,
    indivEmail  : item.indivEmail,
    indivFamily : item.indivFamily,
    indivId     : item.indivId,
    indivGroupId: item.indivGroupId,
    indivGender : item.indivGender,
    indivCity   : item.indivCity,
    gradesPeers : [],
    averagePeers: null,
    gradesProfs : [],
    averageProfs: null,
    averageAll  : null,
    gradesGiven : [],
    normalness  : null,
    finalGrade  : null
  }
  return persona
}

/* ******************************************************************** */
/* Students > create table of students ******************************** */
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
var getGradesGiven = function(evaluations, students){
  for (var i = 0; i < students.length; i++) {
    var student = students[i];
    students[i].gradesGiven = [];
    for (var j = 0; j < evaluations.length; j++) {
      var evaluation = evaluations[j],
          studentEvaluationsSent = (student.indivEmail == evaluation.indivEmail);
      if(studentEvaluationsSent) {
        students[i].gradesGiven.push([ evaluation.grpEv, evaluation.grdEv])
      }
    }
  }
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
function showInfo(data,tabletop,eventNum) {
  eventNum = eventNum || 1;
  console.log(i,data,tabletop)
  var keys = Object.keys(data[0]),
      sessions = getNumberOfSessions(keys),
      googleTerms = createListOfTerms(sessions); // matching google sheet
  cl(['1/ keys: ',keys.length, keys]);
  cl(['2/ sessions: ',sessions]);
  cl(['3/ googleTerms: ',googleTerms.length, googleTerms]);
  // https://docs.google.com/spreadsheets/d/1cD1Lt4RK2GGmMMi2MoM6nbkvH0c2TrkTbHATUSpipTc
  // http://www.jsoneditoronline.org/?id=f1c7796026cc37212e950eb0ac30b24d

  var evaluations = flattening(data, sessions, googleTerms);
  cl(['4a/ evaluations ',evaluations.length,evaluations]); // Students list
  var students = getPersonaList(evaluations).filter(function (e) { return e.indivStatus == 'student';});
  cl('5a/ students > creation (empty)',students.length,students);
  getGradesReceived(evaluations, students, googleTerms) // not sorted by session
  cl('5b/ students > add "gradesReceived"');
  getGradesGiven(evaluations, students);
  cl('5c/ students > add "gradesGiven"');

  /* ******************************************************************** */
  /* 2b) Students average injection ************************************* */
  for (var i = 0; i < students.length; i++) {
    var student = students[i]
    var avgPeers = student.gradesPeers.length ?
          student.gradesPeers.reduce(function(toll, arr) { return toll + arr[1]; }, 0) / student.gradesPeers.length : undefined;
    var avgProfs = student.gradesProfs.length ?
          (student.gradesProfs.reduce(function(a, b) { return a + b[1];}, 0) / student.gradesProfs.length)
          : avgPeers;
    if (!student.gradesPeers.length){ avgPeers = avgProfs; }
    console.log("here: ",+avgPeers.toFixed(1),avgPeers,+avgProfs.toFixed(1),avgProfs);
    students[i].averagePeers = +avgPeers.toFixed(1);
    students[i].averageProfs = +avgProfs.toFixed(1);
    students[i].profReviewed = student.gradesProfs.length? true:false;
  }
  cl('5d/ students > add "averagePeers", "averageProfs", "profReviewed"\'s values.');
  cl(['5e/ students ',students.length,students]);

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
  cl(['7/ groupsList=[]: ',groupsList.length,groupsList]); // Students list
  /* ******************************************************************** */
  /* Groups table creation ********************************************** */
  for (var i = 0; i < groupsList.length; i++) {
    if (!groupsList[i].match('Prof') ) {
      groups.push({
        groupDate:null,               //
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
    var avgPeers = rowGrp.gradesPeers.reduce(function(a, b) { return a + b; }, 0) / rowGrp.gradesPeers.length,
        avgProfs = rowGrp.gradesProfs.length?
          rowGrp.gradesProfs.reduce(function(a, b) { return a + b; }, 0) / rowGrp.gradesProfs.length
          : avgPeers;
    groups[i].averagePeers = avgPeers;
    groups[i].averageProfs = avgProfs;
    groups[i].averageAll = (avgPeers/2 + avgProfs/2).toFixed(1);
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
 // cl(["10/ groups[0]: ", JSON.stringify(groups)]);



  /* ******************************************************************** */
  /* NORMALNESS SCORE *************************************************** */
  /* ******************************************************************** */
  /* ******************************************************************** */
  /* SeriousnessAssessment (function) *********************************** */
  var seriousnessAssessment = function(a, b, bonus, counter){
    var distance = Math.abs(a - b),
        bump = 20 - distance*5;
        /*
    if      (distance<= 1) { bump=20; }
    else if (distance<= 2) { bump=16; }
    else if (distance<= 4) { bump=10; }
    else if (distance<= 6) { bump= 6; }
    else { bump= 0; } */
    bonus= bonus + bump;
    counter= counter+1;
    return [bonus,counter,bump]
  }
  // Linear:
  // bump = 20 - distance;
  // Sigmoid_function > Logistic function
  // var y = 1 / (1 + Math.exp(x));  // y = 1/(1+e^x)

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
//        cl(['Seriousness -- Eval by x:',[groupId,grd],'; Eval by all:',[groupId,avgAll],'=> ',bump]);
        }
      }
    }
    students[i].normalness =(bonus/counter).toFixed(1);
    // cl(['Seriousness overall for',name,bonus.toFixed(1),'/',counter,': ',students[i].normalness]);
  }

  /* ******************************************************************** */
  /* FINAL STUDENT SCORE ************************************************ */
  /* ******************************************************************** */
  /* Final grade injection ************** */
  for (var i = 0; i < students.length; i++) {
    var row = students[i],
      sum = .50*(row.averageProfs) + .25*row.averagePeers + .25*row.normalness;
      students[i].finalGrade = +sum.toFixed(1);
  }
  for (var i = 0; i < students.length; i++) {
    var row = students[i],
      sum = 0.66*(row.averageProfs) + 0.34*row.averagePeers + 0*row.normalness;
      students[i].finalGradePP = +sum.toFixed(1);
  }
  cl('11/ students > add "finalGrade"'); // students with grades



  /* ******************************************************************** */
  /* FOTA *************************************************************** */
  var addRank = function(input,basedOnCol,returnedCol){
    for(var i = 0; i<input.length; i++){
    	if(i !=0 && input[i][basedOnCol] == input[i-1][basedOnCol]){
      	input[i][returnedCol]=input[i-1][returnedCol];
      } else { input[i][returnedCol] = i; }
    }
  	return input;
  };

  var findExtrems = function(input,basedOnCol,returnedCol){
  	var minBaseCol,
    		maxBaseCol,
    		minReturnCol,
        maxReturnCol;
    for(var i=0; i<input.length; i++){
    	 	if(minBaseCol===undefined || input[i][basedOnCol] < minBaseCol){ minBaseCol = input[i][basedOnCol]; minReturnCol = input[i][returnedCol]; }
    	 	if(maxBaseCol===undefined || input[i][basedOnCol] > maxBaseCol){ maxBaseCol = input[i][basedOnCol]; maxReturnCol = input[i][returnedCol]; }
    }
    return { "min": minReturnCol, "max": maxReturnCol};
  }
  // given min, max, and data.length, assign a FOPA key with levant value.
  var addFopa = function(data,referenceCol,resultCol,min,max){
  	var output = data;
  	var distance = (max-min)/(data.length-1);
  	for(var i=0; i<output.length; i++){
      console.log(max, i+1, output[i][referenceCol], distance);
    	output[i][resultCol] = +(max - (output[i][referenceCol])*distance).toFixed(3);
    }
    return output;
  }
  /* ************************************************************************* */
  // FOPA ALGO ******************************************************************** */
  /* var min = findExtrems(data).min,
  		max = findExtrems(data).max; */
  var ext = findExtrems(students,'finalGrade','averageProfs'),
  		min = ext.min,
  		max = ext.max;
  var _dataSorted = sortJSON(students, 'finalGrade', '321');
  var _dataRanked = addRank(_dataSorted,'finalGrade','rank')
  var _dataFopaed = addFopa(_dataRanked,'rank','fopa', min, max);

  // FopqPP
  var extPP = findExtrems(students,'finalGradePP','averageProfs'),
      minPP = extPP.min,
      maxPP = extPP.max;
  var _dataSortedPP = sortJSON(students, 'finalGradePP', '321');
  var _dataRankedPP = addRank(_dataSortedPP,'finalGradePP','rankPP')
  var _dataFopaedPP = addFopa(_dataRankedPP,'rankPP','fopaPP',minPP, maxPP);

  /* ******************************************************************** */
  /* DATA CLEANING ****************************************************** */
  /* ******************************************************************** */
  /* SORTING ************************************************************ */
  var studentsSort = sortJSON(students,'indivId', '123')
  cl(['12/ students > sorted: ',studentsSort.length, studentsSort]); // students with grades
  /* ******************************************************************** */
  /* Pre-TABLE ********************************************************** * /
  var finalDataForm = function(item){
    // THIS IS NEEDS, GIVES STRUCTURE TO TABLE
    return {
      "indivId"     : item.indivId,
      "averageProfs": item.averageProfs,
      "averagePeers": item.averagePeers,
      "normalness"  : item.normalness,
      "finalGrade"  : item.finalGrade,
      "indivFamily" : item.indivFamily,
      "indivEmail"  : item.indivEmail
    }
  }
  var studentsSortAverages = studentsSort.map(finalDataForm);
  cl(['13/ studentsReformated: ',studentsSortAverages.length, studentsSortAverages]); // students with grades

  /* ******************************************************************** */
  /* RENDERING ********************************************************** */
  /* ******************************************************************** */
  var cols = ["date","indivId","indivGender","profReviewed","averageProfs","averagePeers","normalness","finalGrade","rank","fopa","finalGradePP","rankPP","fopaPP","indivFamily","indivEmail"]; //,"indivCity"
  $(".activity:last").append('<h4>Table</h4>')
  tablify(studentsSort,cols,eventNum);
  $(".activity:last").append('<h4>Violins</h4>')
  violinPlot(studentsSort,"hook"+eventNum);
};


/* ******************************************************************* */
/* Data call ********************************************************* */
/* ******************************************************************* */
var gkeys = {
  "2016.11.25": '1cD1Lt4RK2GGmMMi2MoM6nbkvH0c2TrkTbHATUSpipTc', // named P5 fdv
  "2017.01.10": '1sqQB46CwxjcTwG46T_cAvoS_B5fT_6abe7_NBaRs0v0', // named P5 biomed
  "2017.05.12": '1wHNlEtNZoyQ-wgKHMb6wnewpruiGkqTqnX12v8vY6Mo', // named P5 biomed
  "2017.05.29": '1ZyN70SJImSgttxiETCVNNSmwB5r2lneliFR4KzDLJWs', // named P5 fdv
  "2017.06.07": '1nmyiVNnGNmSUC8suoQj7s_06D-cFb0UQZvM_odpEYlA', // named P7 bio?
  "2017.12.01": '1Yz7Njbbu9-lA0sQIMFyF2S5K3LN8bHEbd-nl8v7gHII', // named P7 bio?
  "2018.01.12": '1xQF8EyIultcDMmZUAOYYU07xIQFW6bGbQFYm8CmC3Q4', // named P5 biomed
  "2018.04.14": '1KIcOQZcSsM7ifXlypevI2ut7qyqSshLyR8dGmBE7VTo', // named P5 fdv
  "2018.05.03": '1TcGypsFLd2jvYJrI_AlPRKPhSOYPFpBWa9uvFrwhoLg', // named P5 biomed
  "2019.01.11": '1ai3SnqmW6tmA8AKsDmjxxI1ey-Esn3m6jc0_JeCDQVg', // named P5 biomed
  "testpoem"  : '1MQkHnD-2XJSVnvL5PQDjfygJOJXoeHayVoBiak82jLU'
};

var displayResults = function(googleSheetID,cycle) {
  var cycle= cycle;
  console.log('cycle1',cycle)
  Tabletop.init({
    key: googleSheetID,
    callback: showInfo,
    simpleSheet: true
  })
};

var googleId = function(date) {
  var id =  document.getElementById("googleSheetId").value || getUrlVars()["google"] || gkeys[date||'2019.01.11'];
  return id;
};
var resetPage = function(){ $('#hook').empty(); }
// On page load
window.onload = function() {
  $('#run').on('click', function(){
    resetPage();
    $("#hook").append('<div><h3>Activity</h3></div>');
    displayResults(googleId())
  });
  $('#open').on('click', function(){
    var url = location.pathname + "?google="+googleId();
    window.open(url, '_blank');
  });

  $('#biomeds').on('click', function(){
    var biomeds = ["2017.01.10","2017.05.12","2018.01.12","2018.05.03","2019.01.11"];
    resetPage();
    for (var item of biomeds) {
      $("#hook").append('<div class="activity"><h3>'+item+'</h3></div>');
      displayResults(googleId(item))
    };
  });
}
// On button RUNS click
// in html page
