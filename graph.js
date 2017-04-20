 /*
   In this file we have a code for rendering D3 Chart from JSON data.
   Here we have 3 Chart in which 2 are Bar Chart (For Agewise and Educationwise)
   and 1 is Stacked Bar Chart between Statewise and Genderwise.
 */

 // set the dimensions of the graph
  var margin = {top: 20, right: 20, bottom: 100, left: 100},
      width = 900 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;


  // set the ranges
  var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
  var y = d3.scale.linear().range([height, 0]);

  // define the axis
  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");
  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(5)
      .tickFormat(d3.format("s"));
  
/* Agewise Chart code starts here */
function renderAgeWiseData(){
   // load the data
  d3.json("./jsonData/ageWiseData.json", function(error, data) {

    document.getElementById("heading").innerHTML = "<h1>Agewise vs Total Literate Person</h1>";
    document.getElementById("graph").innerHTML = "";
    // add the SVG element
    var svg = d3.select("#graph").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", 
            "translate(" + margin.left + "," + margin.top + ")");
    
    // Toottip Code for Bars
    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
      return "<div><strong>Age Group:</strong> <span>" + d.ageGroup + "</span></div><strong>Total Literate:</strong> <span>" + d.totalLiterate + "</span>";
    })
    svg.call(tip);
    x.domain(data.map(function(d) { return d.ageGroup; }));
    y.domain([0, d3.max(data, function(d) { return d.totalLiterate; })]);

    // add axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.5em")
        .attr("dy", "-.35em")
        .attr("transform", "rotate(-45)" );
  
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 5)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Total Literate");


    // Add bar chart
    svg.selectAll("bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.ageGroup); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.totalLiterate); })
        .attr("height", function(d) { return height - y(d.totalLiterate); })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);
  });
}
/* Agewise Chart code ends here */

/* Educationwise Chart code starts here */
function renderEducationWiseData(){
   // load the data
  d3.json("./jsonData/educationCategoryData.json", function(error, data) {

    document.getElementById("heading").innerHTML = "<h1>Educationwise vs Total Person</h1>";
    document.getElementById("graph").innerHTML = "";
    // add the SVG element
    var svg = d3.select("#graph").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", 
            "translate(" + margin.left + "," + margin.top + ")");
    
    // Tooltip for Bars
    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
      return "<div><span>" + d.educationLevel + "</span></div><strong>Total:</strong> <span>" + d.totalNumber + "</span>";
    })
    svg.call(tip);
    x.domain(data.map(function(d) { return d.educationLevel; }));
    y.domain([0, d3.max(data, function(d) { return d.totalNumber; })]);

    // add axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "middle")
        .attr("dx", "-.5em")
        // .attr("dy", "-.35em")
        // .attr("transform", "rotate(-10)" )
        .call(wrap, x.rangeBand());
  
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 5)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Total Number");

    // Add bar chart
    svg.selectAll("bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.educationLevel); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.totalNumber); })
        .attr("height", function(d) { return height - y(d.totalNumber); })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);
  });
}
/* Educationwise Chart code ends here */

/* Statewise Stack Chart code starts here */
function renderStateWiseData(){
  d3.json("./jsonData/genderStateWise.json", function(error, data) {
    document.getElementById("heading").innerHTML = "<h1>Statewise vs Genderwise Graduate</h1>";
    document.getElementById("graph").innerHTML = "";
    // add the SVG element
    var svg = d3.select("#graph").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", 
            "translate(" + margin.left + "," + margin.top + ")");

  // Transpose the data into layers
  var dataset = d3.layout.stack()(["graduateMale", "graduateFemale"].map(function(gender) {
    return data.map(function(d) {
      return {x: (d.state), y: +d[gender]};
    });
  }));


  // Set x, y and colors
  var x = d3.scale.ordinal()
    .domain(dataset[0].map(function(d) { return d.x; }))
    .rangeRoundBands([10, width-10], 0.02);

  var y = d3.scale.linear()
    .domain([0, d3.max(dataset, function(d) {  return d3.max(d, function(d) { return d.y0 + d.y; });  })])
    .range([height, 0]);

  var colors = ["#4286f4", "#FFC0CB"];

  // Define and draw axes
  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(5)
    .tickSize(-width, 0, 0)
    .tickFormat(d3.format("s"));
    // .tickFormat( function(d) { return d } );

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.5em")
    .attr("dy", "-.35em")
    .attr("transform", "rotate(-45)");

  // Create groups for each series, rects for each segment 
  var groups = svg.selectAll("g.cost")
    .data(dataset)
    .enter().append("g")
    .attr("class", "cost")
    .style("fill", function(d, i) { return colors[i]; });

  var rect = groups.selectAll("rect")
    .data(function(d) { return d; })
    .enter()
    .append("rect")
    .attr("x", function(d) { return x(d.x); })
    .attr("y", function(d) { return y(d.y0 + d.y); })
    .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
    .attr("width", x.rangeBand())
    .on("mouseover", function() { tooltip.style("display", null); })
    .on("mouseout", function() { tooltip.style("display", "none"); })
    .on("mousemove", function(d) {
      var xPosition = d3.mouse(this)[0] - 15;
      var yPosition = d3.mouse(this)[1] - 25;
      tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
      tooltip.select("text").html((d.y0 == 0)?("Graduate Male - "+ d.y):("Graduate Female - "+ d.y));
    });

  // Prep the tooltip bits, initial display is hidden
  var tooltip = svg.append("g")
    .attr("class", "tooltip")
    .style("display", "none");
      
  tooltip.append("rect")
    .attr("width", 30)
    .attr("height", 20)
    .attr("fill", "white")
    .style("opacity", 0.5);

  tooltip.append("text")
    .attr("x", 15)
    .attr("dy", "1.2em")
    .style("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("font-weight", "bold");
  });
}
/* Statewise Stack Chart code ends here */

// Method to wrap Label text
function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}
