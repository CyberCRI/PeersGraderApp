// http://bl.ocks.org/bunkat/2595950 Scatter plot
/* ******************************************************************** */
/* SET UP ************************************************************* */
/* ******************************************************************** */
var dev = true;
var cl = function(args){ var args = args || []; if(dev){ return console.log(args); } };
/* Timer **** */
/* var timer = []; timer.push(now ()); cl.timer(timer,[bolean]) */
var now = function(comment) { return { time: new Date(), step: comment}};
var timer=[];
cl.timer = function(array,reset){
  reset= reset?true:false;
  for(var i=0; i<array.length -1;i++){
    var comment = array[i].comment?' Step: '+array[i].comment:'';
  	console.log(
      "Period_"+i+"⟶"+(i+1)+" : "+(array[i+1].time-array[i].time)/1000+"sec."+comment+'.'
    );
  }
	console.log("Period_0⟶"+(array.length-1)+" : "+(array[array.length-1]-array[0])/1000+"sec.");
  if(reset){ timer=[] };
};

/* ******************************************************************** */
/* QUERY ************************************************************** */
/* ******************************************************************** */
var getUrlVars = function() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
    vars[key] = value;
  });
  return vars;
}
cl(['Source > window.location.search',getUrlVars()["google"]]);

/* ******************************************************************** */
/* DATA FORMATING ***************************************************** */
/* ******************************************************************** */
var sortJSON = function (arr, key, way) {
  return arr.sort(function(a, b) {
    var x = a[key], y = b[key];
    if (way==='123') { return ((x<y)? -1 : ((x>y)?1:0)); }
    if (way==='321') { return ((x>y)? -1 : ((x<y)?1:0)); }
  });
};

var getNumberOfSessions = function(keys) {
  var count = keys.filter(function(str) { return str.indexOf('presenting') > -1; }).length;
  return count;
}
var individualIdToGroupId = function (string) {
  var str = string || '';
  str.match(/\d/)? str= str.match(/.*\d/)[0]: str=str ;
  return str
};

// key : 'actual string on google questionnaire'  <==== !!!!!
var  createListOfTerms = function(sessions){
  var obj = {
    date      : 'Event',
    email     : 'Email Address', // 	Session #1 — group presenting to me	Session #1 — grade you give
    family    : 'Name?',
    id        : 'Identifiant?',
    country   : 'Country of education?',
    city      : 'City of education?',
    gender    : 'Gender?',
    session   : 'session',
    presenting: 'presenting',
  };
  for (var s=1; s<=sessions; s++) {
    obj['S'+s+'group'] = 'Session #'+s+' — group presenting to me'; // 'title '+S+' on google sheet';
    obj['S'+s+'grade'] = 'Session #'+s+' — grade you give'; // 'title '+S+' on google sheet';
  };
  return obj
}

/* ******************************************************************** */
/* EVALUATIONS ******************************************************** */
/* ******************************************************************** */
// flattening the database, showing up each instance of evaluation "A grade B" and metadata.
var flattening = function(jsonData, numberOfSessions, terms) {
  var d = [];
  jsonData.forEach(function(x){
    for (var i=1; i<=numberOfSessions;i++){
      var grade = x[terms['S'+i+'grade']];
      var instanceOfEvaluation = {
        evalDate    : x[terms.date],
        evalSession : i,
        graderEmail : x[terms.email],
        graderFamily: x[terms.family],
        graderId    : x[terms.id],
        graderGroupId: individualIdToGroupId(x[terms.id]),
        graderGender: x[terms.gender],
        graderCity  : x[terms.city],
        graderStatus:
          individualIdToGroupId(x[terms.id]).match('Prof')?'professor':
          individualIdToGroupId(x[terms.id]).match('G')?'student':'observator',
        presenterGroupId: individualIdToGroupId(x[terms['S'+i+'group']]),
        evalGrade:
        //  typeof (+grade) === 'number'? +grade
        //    :grade === "I'm presenting (no grade)"? terms.presenting
        //      :grade === "Not evaluating"? 'none'
        //        :'Warning: invalide evaluation grade ('+grade+') from '+x[terms.id]+' to '+individualIdToGroupId(x[terms['S'+i+'group']])+'.'
         x[terms['S'+i+'grade']] === "I'm presenting (no grade)"? terms.presenting
         :x[terms['S'+i+'grade']] === "Not evaluating"? 'none'
          :+x[terms['S'+i+'grade']]
      };
      d.push(instanceOfEvaluation);
    }
  })
  return d;
};
// Enrich evaluations by presenter's demographics
var findPresenter = function(evaluations,session,presenterGroupId){
  var res = evaluations
    .filter(eval => eval.graderGroupId===presenterGroupId)
    .filter(eval => eval.evalGrade==='presenting')
    .filter(eval => eval.evalSession===session);
  return res;
}
var findPresenter2 = function(evaluations,session,presenterGroupId){
  var res = evaluations
    .filter(eval => eval.graderGroupId===presenterGroupId
      && eval.evalGrade==='presenting'
      && eval.evalSession===session);
  return res;
}
var evaluationsPlusPresenters = function(evaluations){
  return evaluations.map(function(eval,index){
    var enriched = {...eval};
    item = findPresenter2(evaluations,eval.evalSession,eval.presenterGroupId);
    //console.log('EVALUATING:',eval); console.log('ITEM:',item);
/**/if(item.length!==1){ console.warn('WARNING: abnormal number ('+item.length+') of individuals recorded to present at that time.\nData: ',eval) };
      enriched.presenterEmail  = item[0]? item[0].graderEmail : 'none', // THIS IS THE PRESENTER
      enriched.presenterFamily = item[0]? item[0].graderFamily: 'none',
      enriched.presenterId     = item[0]? item[0].graderId:     'none',
      enriched.presenterGroupId= item[0]? item[0].graderGroupId:'none',
      enriched.presenterGender = item[0]? item[0].graderGender :'none',
      enriched.presenterCity   = item[0]? item[0].graderCity :  'none',
      enriched.presenterStatus = item[0]? item[0].graderStatus: 'none';
/**/if(index==0){ console.log(evaluations[0]); console.log(eval) }
    return enriched;
  });
};
 // converts evaluation into evaluator's demographics and enriched evaluation into dual demographic object
var evalToDemo = function(eval){ // convert enriched evaluation into dual demographic object
  if(!eval.presenterId){ return {
      evalDate     : eval.evalDate,
      graderStatus : eval.graderStatus,
      graderEmail  : eval.graderEmail,
      graderFamily : eval.graderFamily,
      graderId     : eval.graderId,
      graderGroupId: eval.graderGroupId,
      graderGender : eval.graderGender,
      graderCity   : eval.graderCity,
    }
  }
  else { return {
   'from':eval.graderId,'fromGender':eval.graderGender,'fromFamily':eval.graderFamily,
   'evalGrade':eval.evalGrade,
   'toReceivedAverage':'undefined', // <<<<<<<<<<<<<<<<<------------------------------------------------------------- NEXT TO FIX
   'to': eval.presenterId, 'toGender': eval.presenterGender,'toFamily':eval.presenterFamily,}
  }
 };

/* ******************************************************************** */
/* EVALUATIONS FILTERS ************************************************ */
var participantInteractions= (evaluations,emailAsId) => { return evaluations.filter(eval => (eval['graderEmail']   ===emailAsId || eval['presenterEmail']===emailAsId)) ||[] },
    participantAsGrader    = (evaluations,emailAsId) => { return evaluations.filter(eval => (eval['graderEmail']   ===emailAsId && typeof eval.evalGrade === 'number')) ||[] }, // excludes "I'am presenting" evaluations
    participantAsPresenter = (evaluations,emailAsId) => { return evaluations.filter(eval => (eval['presenterEmail']===emailAsId)) ||[] }, // INCLUDEs "I'am presenting" evaluations
    participantPeersEvals  = (evaluations,emailAsId) => { return evaluations.filter(eval => (eval['presenterEmail']===emailAsId && typeof eval.evalGrade === 'number' && eval['graderStatus']==='student')) ||[] },
    participantProfsEvals  = (evaluations,emailAsId) => { return evaluations.filter(eval => (eval['presenterEmail']===emailAsId && typeof eval.evalGrade === 'number' && eval['graderStatus']==='professor')) ||[] }; // grades given and presentations given, needs "typeof eval.evalGrade==='number'" for only grades given.

/* ******************************************************************** */
/* CALCULATIONS ******************************************************* */
var averaging=(arrayOfNumbers) => { // important: all elements must be numbers
  return (arrayOfNumbers.reduce((a,b) => a+b, 0)/arrayOfNumbers.length).toFixed(1);
};
var participantGradesReceivedDistribution = (evaluations, emailAsId) => {
  // participantAsPresenter.filter(eval => typeof eval.evalGrade ==='number').map(eval => eval.evalGrade)
  return evaluations.filter(eval => eval['presenterEmail']===emailAsId && typeof eval.evalGrade ==='number').map(eval => eval.evalGrade);
};
var participantGradesReceivedAverage      = (evaluations, emailAsId) => {
      var grades = participantGradesReceivedDistribution(evaluations, emailAsId);
      return averaging(grades);
    };


    // Linear, 1d:
    // normalness = perfect - distance;
    /* Linear, 5d:
    normalness = perfect - distance*5; */
    /* Discrete :
    if      (distance<=0.05*perfect){ normalness=1.0*perfect; }
    else if (distance<=0.1*perfect) { normalness=0.8*perfect; }
    else if (distance<=0.2*perfect) { normalness=0.5*perfect; }
    else if (distance<=0.3*perfect) { normalness=0.3*perfect; }
    else { normalness= 0; } */
    // Sigmoid_function > Logistic function
    // var y = 1 / (1 + Math.exp(x));  // y = 1/(1+e^x)
/* SeriousnessAssessment (function) *********************************** */
    var seriousnessAssessment = function(average,gradeGiven,perfect,typical){
      perfect = perfect || 20,
      typical = perfect&&typical?typical:0.75*perfect,
      currentFormula= "Louis polynominale";
      var normalness = perfect
      - 1*Math.pow(average-gradeGiven,2)
      + 1*Math.abs(average-typical);
      // var detailOfSeriousness = { 'average': average, 'gradeGiven': gradeGiven, 'distance': distance, 'normalness': normalness, 'formula': formula };
      return normalness>perfect? perfect:normalness<0?0:normalness.toFixed(1);
    };
    var evalToSeriousness = function(evaluations,eval){ // convert enriched evaluation into dual demographic object
      gradePerfect = gradePerfect || 20, gradeTypical=gradeTypical || 15;
      var avg = participantGradesReceivedAverage(evaluations,eval.presenterEmail);
      return { // for each graded student, create a pre-normalness object which includs all received grades
       'from':eval.graderId,
       'fromGender':eval.graderGender,
       'fromFamily':eval.graderFamily,
       'evalGrade':eval.evalGrade,
       'evalDistanceToNorm': +(eval.evalGrade-avg).toFixed(2),
       'evalSeriousness': +seriousnessAssessment(avg,eval.evalGrade,gradePerfect,gradeTypical),
       'presenterGradesReceived': participantGradesReceivedDistribution(evaluations,eval.presenterEmail),
       'presenterGradesReceivedAverage': avg,
       'to': eval.presenterId,
       'toGender': eval.presenterGender,
       'toFamily':eval.presenterFamily }
     };
/*    var seriousness = function(accumulator, currentValue, currentIndex, array) {
      return accumulator + currentValue
    } */

/* ******************************************************************** */
/* STUDENTS *********************************************************** */
/* ******************************************************************** */
/* 1) Students listing ************************************************ */
var createParticipants = function(evaluations, emailAsId, ratioProfs, ratioPeers, ratioSeriousness){
  var ratioProfs = ratioProfs|| 0.5, ratioPeers = ratioPeers || 0.25, ratioSeriousness= ratioSeriousness || 0.25;
  var participantEval = evaluations.find(eval => eval['graderEmail'] === emailAsId);
  // IF participant never grades other !??? ==> Still! I created evaluations elements where declared "GRADING"... no one.
  var curParticipantInteractions= participantInteractions(evaluations,emailAsId),
      curParticipantAsGrader    = participantAsGrader(curParticipantInteractions,emailAsId),
      curParticipantAsPresenter = participantAsPresenter(curParticipantInteractions,emailAsId),
      curParticipantPeersEvals  = participantPeersEvals(curParticipantInteractions,emailAsId),
      curParticipantProfsEvals  = participantProfsEvals(curParticipantInteractions,emailAsId);
  // list of enriched evaluations implying curParticipant and a graded student, then fetch graded student's other grades
  var preNormalness = curParticipantAsGrader.map(eval => { return evalToSeriousness(evaluations,eval); });
  //console.log('Prenormalness',curParticipantAsGrader,preNormalness);
  participant = {
    evalDate     : participantEval.evalDate,
    evalRatios   : { ratioProfs: ratioProfs, ratioPeers: ratioPeers, ratioSeriousness: ratioSeriousness },
    graderStatus : participantEval.graderStatus,
    graderEmail  : participantEval.graderEmail,
    graderFamily : participantEval.graderFamily,
    graderId     : participantEval.graderId,
    graderGroupId: participantEval.graderGroupId,
    graderGender : participantEval.graderGender,
    graderCity   : participantEval.graderCity,
    gradesReceivedAll:      curParticipantPeersEvals.concat(curParticipantProfsEvals).map(eval => { return evalToDemo(eval); }) || [],
/**/  gradesReceivedPeers:  curParticipantPeersEvals.map(eval => { return evalToDemo(eval); }) || [],
/**/  gradesReceivedProfs:  curParticipantProfsEvals.map(eval => { return evalToDemo(eval);}) || [],
    averagePeers: +(curParticipantPeersEvals.map(eval => eval.evalGrade).reduce((a,b) => a+b, 0)/curParticipantPeersEvals.length).toFixed(1) || null, // averaging()
    averageProfs: +(curParticipantProfsEvals.map(eval => eval.evalGrade).reduce((a,b) => a+b, 0)/curParticipantProfsEvals.length).toFixed(1) || null, // averaging()
/**/  averageAll  : null,
    gradesGiven : curParticipantAsGrader.map(eval => { return evalToDemo(eval); }) || [],
    averageGiven: +(curParticipantAsGrader.map(eval => eval.evalGrade).reduce((a, b) => a+b, 0)/curParticipantAsGrader.length).toFixed(1) || 'none',
/**/  normalnessDistribution: preNormalness.map(item => +item.evalSeriousness.toFixed(1)),
    averageNormalness: +(preNormalness.reduce((a,b) => a+b.evalSeriousness, 0) / preNormalness.length).toFixed(1),
    finalGrade  : null
  };
  participant.reviewedByProfs=  participant.gradesReceivedProfs.length? true:false;
  participant.reviewedByPeers= participant.gradesReceivedPeers.length? true:false;
  participant.averageAll = +(participant.averagePeers*ratioPeers + participant.averageProfs*ratioProfs + participant.averageNormalness * ratioSeriousness ).toFixed(1); // Does this equal 1 ????????
  // fail safe;
  return participant;
};

/* ******************************************************************** */
/* Adjustments ******************************************************** */
/* Fill averageProfs for students never reviewed by prof ************** */
var addAverageProfsOrPeersWhenMissing = function (students,groups){
  students.forEach(function(student, i) {
    if(student.reviewedByProfs=== false){ // no professor reviewed the students
      console.warn(`Warning: abnormal number of evaluation by professors (0).\n
      Please organize at least one teacher evaluation for `+student.graderFamily+` (`+student.graderId+`: `+student.graderEmail+`).`);
      var groupOfTheStudent = groups.find(group => group.groupId === student.graderGroupId);
      students[i].averageProfs = groupOfTheStudent.averageProfs || students[i].averagePeers || null ;
    }
    if (student.gradesReceivedPeers.length === 0){
      console.warn(`Warning: abnormal number of evaluation by peers (0).\n
      Please organize at least 2 peers evaluations for `+student.graderFamily+` (`+student.graderId+`: `+student.graderEmail+`).`);
      students[i].averagePeers = groupOfTheStudent.averagePeers || groupOfTheStudent.averageProfs || students[i].averageProfs || null;
    }
  })
  return students;
};

/* ******************************************************************** */
/* GROUPS : this adds fairness **************************************** */
/* ******************************************************************** */
/* 2) Groups grades ************************************************** */
var createGroups = function(evaluations, groupID){
  let curGroupAllEvals   = evaluations.filter(eval => (eval['presenterGroupId'] ===groupID && typeof eval.evalGrade==='number')),
      curGroupPeersEvals = curGroupAllEvals.filter(eval => (eval['graderStatus']!=='professor')),
      curGroupProfsEvals = curGroupAllEvals.filter(eval => (eval['graderStatus']==='professor'));
  let group = {
    evalDate: [...new Set(curGroupPeersEvals.map(eval => eval.evalDate))],
    groupId  : groupID,
    gradesReceivedPeers: curGroupPeersEvals.map(eval => { return {'from': eval.graderId, 'grade': eval.evalGrade}}),
    gradesReceivedProfs: curGroupProfsEvals.map(eval => { return {'from': eval.graderId, 'grade': eval.evalGrade}}),
    gradesAll:  curGroupAllEvals.map(eval => { return {'from': eval.graderId, 'grade': eval.evalGrade}}),
    averagePeers : curGroupPeersEvals.map(eval => eval.evalGrade).reduce((a, b) => a+b, 0)/curGroupPeersEvals.length,
    averageProfs : curGroupProfsEvals.map(eval => eval.evalGrade).reduce((a, b) => a+b, 0)/curGroupProfsEvals.length,
    averageAll   : null
  };
  group.averageAll = +(group.averagePeers/2 + group.averageProfs/2).toFixed(1);
  // fail proof:
  if(curGroupProfsEvals.length === 0) group.averageProfs= group.averagePeers;
  if(curGroupPeersEvals.length === 0) group.averagePeers= group.averageProfs;
  return group;
};

var addFinalGrades = (arrOfStudents,ratioProfs,ratioPeers,ratioNormalness,targetColumn) => {
  var arr = arrOfStudents.map((item,i) => {
    item[targetColumn]=+(ratioProfs*item.averageProfs+ ratioPeers*item.averagePeers + ratioNormalness*item.averageNormalness).toFixed(1);
    return item; })
  console.log('Added a final grade column based on:\n{ ratioProfs: ',ratioProfs,', ratioPeers: ',ratioPeers,', ratioNormalness: ',ratioNormalness,', targetColumn: ',targetColumn,'}')
  return arr;
};
// Based on column A sorted from higher to lower, in column B, adds the rank. When value in A repeats, repeats rank, but continue to increment by +1 each time.
var addRank = function(sortedArr,sourceColumn,newColumn){
  var arr= sortedArr.map((item,i) => {
    item[newColumn] = i===0 || sortedArr[i][sourceColumn] !== sortedArr[i-1][sourceColumn]  ? i+1 // anytime new grade appears, rank=i
        : sortedArr[i-1][newColumn] // elseIf: equal grade, then equal rank
    return item; })
  console.log('Added a rank column `'+newColumn+'` based on `'+sourceColumn+'`.\n',sortedArr);
  return arr;
};
/*
var addRank2 = (array,sourceColumnumn,newColumnumn) => array.reduce(
  function(a,b,currentIndex){ array[currentIndex][newColumnumn] = ; }
) */
/*  var  = function(previous, current, currentIndex, array) {
      // Math.min(1,2,3,4)
      current.
      return newPrevious;
    } */

/* ******************************************************************** */
/* FOPA *************************************************************** */
// on array of students, with baseColumn being `finalGrade` and newColumnumn being `averageProfs`
var findExtremsOnTwinColum = function(input,sourceColumn,newColumn){
  var minBaseCol,
      maxBaseCol,
      minReturnCol,
      maxReturnCol;
  for(var i=0; i<input.length; i++){
      if(minBaseCol===undefined || input[i][sourceColumn] < minBaseCol){
        minBaseCol = input[i][sourceColumn]; minReturnCol = input[i][newColumn]; }
      if(maxBaseCol===undefined || input[i][sourceColumn] > maxBaseCol){
        maxBaseCol = input[i][sourceColumn]; maxReturnCol = input[i][newColumn]; }
  }
  return { "min": minReturnCol, "max": maxReturnCol};
}
// given min, max, and data.length, assign a FOPA key with levant value.
var addFopa = function(data,referenceCol,resultCol,gradesMin,gradesMax){
  var output = data;
  var normalisedDistancesBetweenResultGrades = (gradesMax-gradesMin)/(data.length-1);
  for(var i=0; i<data.length; i++){
    output[i][resultCol] = +(gradesMax - (output[i][referenceCol]-1)*normalisedDistancesBetweenResultGrades).toFixed(3);
  }
  return output;
  //return output.map(item => (item) { item[resultCol] = +(gradesMax - (output[i][referenceCol])*normalisedDistancesBetweenResultGrades).toFixed(3 ; return item;})
}
/* ******************************************************************* */
/* Set up ************************************************************ */
/* ******************************************************************* */
var evaluations = [],
    studentsIDs = [],
    participantsIDs=[],
    students    = [],
    groupsIDs   = [],
    groups      = [],
    dataForAntoineArr=[];
var ratioProfs = 0.5,
    ratioPeers = 0.25,
    ratioNormalness = 1-(ratioProfs+ratioPeers),
    gradePerfect = 20,
    gradeTypical = 0.75*gradePerfect||15,
    gradeMinimum = 0;

/* ******************************************************************* */
/* ShowInfo ********************************************************** */
/* ******************************************************************* */
function showInfo(data,tabletop,eventNum) {
  eventNum = eventNum || 1;
  console.log('/ Tabletop: \n',tabletop)
  console.log('/ Source data google:\n',data)
  var keys = Object.keys(data[0]),
      sessions = getNumberOfSessions(keys),
      googleTerms = createListOfTerms(sessions); // matching google sheet
  cl(['1/ keys: ',keys.length, keys]);
  cl(['2/ sessions: ',sessions]);
  cl(['3/ googleTerms: ',googleTerms.length, googleTerms]);

  evaluations = flattening(data, sessions, googleTerms);
  enrichedEvaluations = evaluationsPlusPresenters(evaluations);
  cl(['/ evaluations: '+ evaluations.length+'\n',evaluations]); // Students list
  cl(['/ enrichedEvaluations: '+enrichedEvaluations.length+'\n',enrichedEvaluations]); // Students list

  var dataForAntoine = function(arr){ return arr.map(eval =>evalToDemo(eval)) }
  console.log('Antoine',dataForAntoine(enrichedEvaluations).filter(eval => typeof eval.evalGrade === 'number'));

  participantsIDs= [...new Set(enrichedEvaluations.map(eval => eval.graderEmail))];
  studentsIDs    = [...new Set(enrichedEvaluations.filter(eval=>eval.evalGrade==='presenting').map(eval=>eval.graderEmail) )];
  students= studentsIDs.map(function(studentEmailAsId){ return createParticipants(enrichedEvaluations,studentEmailAsId)})
    .filter(function (eval) { return eval.graderStatus === 'student';}); // only true students, no observers nor professors
  cl(['/ participantsIDs=[]: ',participantsIDs.length,participantsIDs]); // Participants list
  cl(['/ studentsIDs=[]: ',studentsIDs.length,studentsIDs]); // Students list

  var groupsIDs = [...new Set(enrichedEvaluations.map(eval => eval.graderGroupId))];
  groups  = groupsIDs.filter(g=>!g.match('Prof')).map(g => createGroups(enrichedEvaluations,g));   // only true students ??
  cl(['/ groupsIDs=[]: ',groupsIDs.length,groupsIDs]); // groups list

 addAverageProfsOrPeersWhenMissing(students,groups);

  /* ******************************************************************** */
  /* FINAL STUDENT SCORE ************************************************ */
  /* ******************************************************************** */
// Based on averagePeers, averagePeers, averageNormalness and defined weights, creates and adds a final grade column and value.
var students = addFinalGrades(students,ratioProfs=.5,ratioPeers=.25,ratioNormalness=.25,targetColumn='finalGrade');
var students = addFinalGrades(students,.66,.34,0,'finalGradePP');
console.log(students[0])

  /* ************************************************************************* */
  // FOPA ALGO ******************************************************************** */
  /* var min = findExtrems(data).min,
  		max = findExtrems(data).max; */
  var extrems = findExtremsOnTwinColum(students,'finalGrade','averageProfs'),
  		min = extrems.min,
  		max = extrems.max;
  var _dataSorted = sortJSON(students, 'finalGrade', '321');
  var _dataRanked = addRank(_dataSorted,'finalGrade','rank')
  var _dataFopaed = addFopa(_dataRanked,'rank','fopa', min, max);

  // FopqPP
  var extremsPP = findExtremsOnTwinColum(students,'finalGradePP','averageProfs'),
      minPP = extremsPP.min,
      maxPP = extremsPP.max;
  var _dataSortedPP = sortJSON(students, 'finalGradePP', '321');
  var _dataRankedPP = addRank(_dataSortedPP,'finalGradePP','rankPP')
  var _dataFopaedPP = addFopa(_dataRankedPP,'rankPP','fopaPP',minPP, maxPP);

  /* ******************************************************************** */
  /* DATA CLEANING ****************************************************** */
  /* ******************************************************************** */
  /* SORTING ************************************************************ */
  var studentsSort = sortJSON(students,'graderId', '123')
  cl(['Students > sorted: \n',studentsSort.length, studentsSort]); // students with grades

  /* ******************************************************************** */
  /* RENDERING ********************************************************** */
  /* ******************************************************************** */
  var cols = ["evalDate","graderId","graderGender","reviewedByProfs","averageProfs","averagePeers","averageGiven","averageNormalness","finalGrade","rank","fopa","rankPP","fopaPP","finalGradePP","graderFamily","graderEmail"]; //,"graderCity"
  $(".activity:last").append('<h4>Table</h4>')
  tablify(studentsSort,cols,eventNum);
  $(".activity:last").append('<h4>Violins</h4>')
  // violinPlot(studentsSort,"hook"+eventNum);
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
  "2019.05.20": '1mF54W78XfpgUejgEJwv780yfH8Sm_l6h7btKXVU8Q78', // named P5 biomed
  "2020.01.10": '1ia0ZsS_HEHxIaOikGhtpv7Byxn9i6FystsGr4Mkz8cE', // named P5 biomed BUT PARTIAL EVENT
  "testpoem"  : '1MQkHnD-2XJSVnvL5PQDjfygJOJXoeHayVoBiak82jLU'
};

var displayResults = function(googleSheetID) {
  console.log("googleSheetID",googleSheetID)
  Tabletop.init({
    key: googleSheetID,
    callback: showInfo,
    simpleSheet: true
  })
};

var googleId = function(date) {
  date? date=date:date='2020.01.10';
  var id = document.getElementById("googleSheetId").value || getUrlVars()["google"] || gkeys[date];
  return id;
};
var resetPage = function(){ $('#hook').empty(); }
// On page load
window.onload = function() {
  $('#run').on('click', function(){
    resetPage();
    $("#hook").append('<div class="activity"><h3>Activity</h3></div>');
    displayResults(googleId())
  });
  $('#open').on('click', function(){
    var url = location.pathname + "?google="+googleId();
    window.open(url, '_blank');
  });

  $('#biomeds').on('click', function(){
    var biomeds = ["2017.01.10","2017.05.12","2018.01.12","2018.05.03","2019.01.11","2019.05.20"];
    resetPage();
    for (var item of biomeds) {
      $("#hook").append('<div class="activity"><h3>'+item+'</h3></div>');
      displayResults(googleId(item))
    };
  });
}
// On button RUNS click
// in html page
