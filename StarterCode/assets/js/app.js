//Create Parameters for Total Height and Width of the SVG
let svgHeight = 500;
let svgWidth = 1000;

//Create Inner Margins of the SVG 
let margin = {
  top: 40,
  bottom: 80,
  right: 40,
  left: 80
};

//Set the Height and Width of the Area for the Chart with Reference to SVG Parameters and Margins 
let height = svgHeight - margin.top - margin.bottom;
let width = svgWidth - margin.left - margin.right;

//Append the SVG to the Page and Set Attributes of the Parameters of the SVG
let svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

//Append a chartGroup to the SVG and Set Attributes of the Inner Margins of the SVG
let chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Create a Variable for the Path to the CSV File
let csvFile = "assets/data/data.csv"

//Import CSV File to Call a Function to Append Data
d3.csv(csvFile).then(appendData);

//Create a Function that Will Use the Data of the CSV as an Argument
function appendData(dataTable) {

  //Create a Loop to Collect the Data and Return Values as Numbers
  dataTable.map(function (data) {
    data.poverty = +data.poverty;
    data.smokes = +data.smokes;
  });

  //Create the Linear Scale for X and Y Axes and Establish Domain and Range
  let xLinearScale = d3.scaleLinear()
    .domain([8, d3.max(dataTable, d => d.poverty)])
    .range([0, width]);
  let yLinearScale = d3.scaleLinear()
    .domain([6, d3.max(dataTable, d => d.smokes)])
    .range([height, 0]);

  //Use the Linear Scale to Create Axes for the Bottom and Left of the Chart
  let bottomAxis = d3.axisBottom(xLinearScale);
  let leftAxis = d3.axisLeft(yLinearScale);

  //Append the Axes to the Chart 
  //Adjust Axis for Bottom with Reference to Height 
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
  chartGroup.append("g")
    .call(leftAxis);

  //Create Circles for the Scatterplot
  var circlesGroup = chartGroup.selectAll("circle")
    .data(dataTable)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.smokes))
    .attr("r", "18")
    .attr("fill", "#CD4545")
    .attr("opacity", ".50")

  //Append Text to the Circles
  var circlesGroup = chartGroup.selectAll()
    .data(dataTable)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.smokes))
    .style("font-size", "12px")
    .style("text-anchor", "middle")
    .style('fill', 'black')
    .text(d => (d.abbr));

  //Create the Tooltip
  let toolTip = d3.tip()
    .attr("class", "tooltip")
    .style("background",'#D7D7D7')
    .offset([0, -50])
    .html(function (d) {
      return (`${d.state}<br>Poverty: ${d.poverty}%<br>Smoking: ${d.smokes}% `);
    });

  //Call the Tooltip to the Chart
  chartGroup.call(toolTip);

  //Create the Event Listeners for the Tooltip
  circlesGroup.on("mouseover", function (data) {
    toolTip.show(data, this);
  })
    .on("mouseout", function (data) {
      toolTip.hide(data);
    });

  //Create Text for the Axes
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 10)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Smoking (%)");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
    .attr("class", "axisText")
    .text("Poverty (%)");
}