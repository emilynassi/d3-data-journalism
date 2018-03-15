var svgWidth = 960;
var svgHeight = 500;

var margin = { top: 20, right: 40, bottom: 60, left: 100 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var chart = svg.append("g");

// Append a div to the body to create tooltips, assign it a class
d3.select(".chart")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

d3.csv("data.csv", function(err, povertyData) {
  if (err) throw err;

  povertyData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.hasHealthcare = +data.hasHealthcare;
  });


  // Create scale functions
  var yLinearScale = d3.scaleLinear()
    .range([height, 0]);

  var xLinearScale = d3.scaleLinear()
    .range([0, width]);

  // Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Scale the domain
  xLinearScale.domain([(20, d3.min(povertyData, function(data) {
    return +data.poverty-1;
  })), (d3.max(povertyData, function(data){
    return +data.poverty+1}))]);

  yLinearScale.domain([(0, d3.min(povertyData, function(data) {
    return +data.hasHealthcare-1;
  })), (d3.max(povertyData, function(data){
    return +data.hasHealthcare+1}))]);

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([60, -60])
    .html(function(data) {
      var poverty = +data.poverty;
      var healthcare = +data.hasHealthcare;
      return (poverty + "<br>"+ healthcare);
    });

  chart.call(toolTip);

  chart.selectAll("circle")
    .data(povertyData)
    .enter().append("circle")
      .attr("cx", function(data, index) {
        console.log(data.poverty);
        return xLinearScale(data.poverty);
      })
      .attr("cy", function(data, index) {
        return yLinearScale(data.hasHealthcare);
      })
      .attr("r", "15")
      .attr("fill", "lightblue")
      .on("click", function(data) {
        toolTip.show(data);
      })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

  //add state abbreviation labels to data
  chart.selectAll("label")
    .data(povertyData)
    .enter()
    .append("text")
    .attr("dx", function(data, index){
      return xLinearScale(data.poverty)-11.5
    })
    .attr("dy", function(data){
      return yLinearScale(data.hasHealthcare)+4
    })
    .text(function (data, index){
      return data.abbreviation;
    })
    .style("fill", "white")
    ;

  chart.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chart.append("g")
    .call(leftAxis);

// Append y-axis labels
  chart.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Poverty");

// Append x-axis labels
  chart.append("text")
    .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 30) + ")")
    .attr("class", "axisText")
    .text("Healthcare");
});
