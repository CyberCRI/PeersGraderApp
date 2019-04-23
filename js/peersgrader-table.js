/* */
function tablify(data,columns,tableId) {
  tableId = '-'+tableId || '';
  $('.activity:last').append('<div class="hook-table'+tableId+'"></div>');
  var sortAscending = true;
  console.log ("/* Tablify ***************************** /")
  var container = d3.select('.hook-table'+tableId).append('div')
    .attr('class','container')
  var table = container.append('table')
      .attr("class", "table table-striped");
  var thead = table.append('thead')
  var	tbody = table.append('tbody');

  // append the header row
  thead.append('tr')
    .selectAll('th')
    .data(columns).enter()
    .append('th')
    .text(function (d) { return d; })
    .on('click', function (d) {
      thead.attr('class', 'header');
      if (sortAscending) {
        rows.sort(function(a, b) {
          if(b[d] > a[d]) {return +1;}
          if(b[d] < a[d]) {return -1;}
        });
        sortAscending = false;
        this.className = 'aes';
      } else {
        rows.sort(function(a, b) {
          if(b[d] > a[d]) {return -1;}
          if(b[d] < a[d]) {return +1;}
        });
        sortAscending = true;
        this.className = 'des';
      }
    });

  // create a row for each object in the data
  var rows = tbody.selectAll('tr')
    .data(data)
    .enter()
    .append('tr');

  // create a cell in each row for each column
  var cells = rows.selectAll('td')
    .data(function (row) {
      return columns.map(function (column) {
        var d = row[column],
        decimal = +d.toString().split('.')[1];
        if(!isNaN(+d)&&decimal&&decimal.toString().length>0){ d= (+d).toFixed(2) }
        return {"column": column, "value": d };
      });
    })
    .enter()
    .append('td')
    .attr('data-th', function (d) {	return d.value; })
    .text(function (d) {

      return d.value; });
}


var scatterPlot = function(students){
console.log ("/* ScatterPlot ************************************* /")
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
