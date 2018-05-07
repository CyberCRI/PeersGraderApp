/* ************************************************************************* */
/* VIOLIN TEMPLATE ********************************************************* */
var violinTemplate = function(){
  return {
    text: "sample length: 59",
    hoveron: "points+kde",
    meanline: { visible: true },
    legendgroup: "R",
    scalegroup: "R",
    points: "all",
    pointpos: 0,
    box: { visible: true },
    jitter: 0,
    scalemode: "count",
    marker: {
        line: { width: 2, color: "#8dd3c7" },
        symbol: "line-ns"
    },
    showlegend: false,
    side: "negative",
    type: "violin",
    name: "Some name",
    span: [ 0 ],
    line: { color: "#8dd3c7" },
    y0: "Some name for lagend",
    x: [ 12.65, 17.92, 16.45 ],
    orientation: "h"
  }
}
/* ************************************************************************* */
/* DATA example ************************************************************ */
var vizGrades = [
	{ name: "Student01a", grades: [ 12,12, 17, 17, 14.5, 10, 16, 15.5, 15.5, 15 ], color: "#8dc7d3", type: "received" },
	{ name: "Student01b", grades: [ 11,6,15, 12 ], color: "#d38dc7", type: "given" },
	{ name: "Student02a", grades: [ 12,12, 17, 17, 14.5, 10, 16, 15.5, 15.5, 15 ], color: "#8dc7d3", type: "received"  },
	{ name: "Student02b", grades: [ 12,8,13, 12 ], color: "#d38dc7", type: "given" }
]

var students = [ {"indivEmail":"laetitialnrt@free.fr","indivFamily":"LIENART Laetitia","indivId":"G15a","indivGroupId":"G15","gradesPeers":[["G14",18],["G16",17],["G16",17],["G13",17]],"averagePeers":17.3,"gradesProfs":[["Prof08",20]],"averageProfs":20,"averageAll":18.7,"gradesGiven":[["G17",18],["G15","presenting"],["G23",16],["G20",18],["G15","presenting"],["G15","presenting"]],"normalness":10.7,"finalScore":17}];

/* ************************************************************************* */
/* CREATE VALID VIZDATA **************************************************** */
var vizdata = [];
var dataForViolins = function(studentsRawData, template) {
  var traces = [];
  for (var i=0; i<studentsRawData.length;i++){
    var trace  = template(),
        student= studentsRawData[i];
    trace.showlegend = i==0?true:false;
    trace.legendgroup= "Got";
    trace.name = "Grades received by this student";
    trace.text = student.gradesPeers.join("; ").replace(/,/g,":")
    trace.y0   = student.indivId; //+" "+student.indivFamily ;
    trace.x    = student.gradesPeers.map(function(a) {return a[1];});
    trace.side = "positive";
    trace.line.color = '#8dc7d3';
    trace.pointpos= 0.2;
    traces.push({...trace});
    var trace  = template();
    trace.showlegend = i==0?true:false;
    trace.legendgroup= "Gave";
    trace.name = "Grades given by this student";
    trace.text = student.gradesGiven.join("; ").replace(/,/g,":")
    trace.y0   = student.indivId; //+" "+student.indivFamily ;
    trace.x    = student.gradesGiven.map(function(a) { return a[1] }).filter(Number);
    trace.side = "negative";
    trace.line.color = '#d38dc7';
	  trace.marker.line.color = '#d38dc7';
    trace.pointpos= -0.2;
    traces.push({...trace});
  }
  return traces
}
/*
  for (var i=0; i<vizGrades.length;i++){
  	var trace = violinTemplate();
  		 student = vizGrades[i];
  	trace.text = ".text "+i;
  	trace.y0   = student.name;
  	trace.name = student.name;
  	trace.x    = student.grades;
  	trace.line.color = student.color;
  	console.log(student, student.type)
  	trace["side"] = student.type == "given"?"negative":"positive";
  	console.log(vizGrades[i].type, trace, trace.side)
  	vizdata.push(trace);
  }
console.log(JSON.stringify(vizdata)); */

// Set up violin datavîz
var layout = {
  hovermode: "closest",
  width: 900,
  yaxis: { showgrid: true },
  title: "Students grades",
  legend: { tracegroupgap: 0 },
  violingap: 0,
  violingroupgap: 0,
  violinmode: "overlay",
  height: 1600
}
// Runs violin dataviz
var violinPlot = function(data,hook){
  console.log ("/* ViolinPlot ************************************* /")
  console.log(JSON.stringify(data[0]));
  var vizdata = dataForViolins(data,violinTemplate);
  console.log(JSON.stringify("vizdata[0]",vizdata[0]))
  Plotly.plot(hook, vizdata, layout) // moved to script
}
