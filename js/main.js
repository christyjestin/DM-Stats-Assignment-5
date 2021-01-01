
// SVG Size
var width = 700,
	height = 500;

var regions = [];
var prepareData = function(data) {
	// Step 1: Analyze and prepare the data
	// Use the web console to get a better idea of the dataset
	// Convert numeric values to numbers.
	// Make sure the regions array has the name of each region
	if (!regions.includes(data.Region)){
	regions.push(data.Region);
	}
	return {
		Country: data.Country,
		LifeExpectancy: parseFloat(data.LifeExpectancy),
		Income: parseInt(data.Income),
		Population: parseInt(data.Population),
		Region: data.Region
	};
}
 var compare = function (a,b){
	if (a.Population>b.Population) return -1;
	if (a.Population<b.Population) return 1;
	return 0;
 }

var margin = {top: 30, right: 30, bottom: 50, left: 30};
width = width - margin.left - margin.right;
height = height - margin.top - margin.bottom;
var createVisualization = function(data) {
	// Step 2: Append a new SVG area with D3
	// The ID of the target div container in the html file is #chart-area
	// Use the margin convention with 50 px of bottom padding and 30 px of padding on other sides!


	var svg = d3.select("body").append("svg")
		.attr("id","chart-area")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// Step 3: Create linear scales by using the D3 scale functions
	// You will need an income scale (x-axis) and a scale function for the life expectancy (y-axis).
	// Call them incomeScale and lifeExpectancyScale.
	// Use d3.min() and d3.max() for the input domain
	// Use the variables height and width for the output range
	var lowX = d3.min(data, function(d){ return d.Income;})-2000;
	var lowY = d3.min(data, function(d){ return d.LifeExpectancy;})-2;
	var highX = d3.max(data, function(d){ return d.Income;})+2000;
	var highY = d3.max(data, function(d){ return d.LifeExpectancy;})+5;
	var xScale = d3.scaleLinear()
		.domain([lowX, highX])
		.range([margin.left, margin.left + width]);
	console.log(xScale(d3.min(data, function(d){ return d.Income;})));
	var yScale = d3.scaleLinear()
		.domain([lowY,highY])
		.range([margin.top + height,margin.top]);
	var rScale = d3.scaleLinear()
		.domain([
			d3.min(data, function (d){return d.Population;}),
			d3.max(data, function (d){return d.Population;})
		])
		.range([4,30]);
	var linearColor = d3.scaleLinear()
		.domain([0,1,2,3,4,5])
		.range(["darkgreen","darkorange","red","pink","blue","tan"]);
	// Step 4: Try the scale functions
	// You can call the functions with example values and print the result to the web console.
		//console.log(xScale(2494));
		//console.log(yScale(57.9));

	// Step 5: Map the countries to SVG circles
	// Use select(), data(), enter() and append()
	// Instead of setting the x- and y-values directly,
	// you have to use your scale functions to convert the data values to pixel measures
	svg.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr("cx",function (d){
			return xScale(d.Income);
		})
		.attr("cy",function (d) {
			return yScale(d.LifeExpectancy);
		})
		.attr("r",function (d) {
			return rScale(d.Population);
		})
		.attr("fill", function (d){
			return linearColor(regions.indexOf(d.Region));
		});


	// Step 6: Use your scales (income and life expectancy) to create D3 axis functions
	var xAxis = d3.axisBottom()
		.scale(xScale);
	var yAxis = d3.axisLeft()
		.scale(yScale);

	// Step 7: Append the x- and y-axis to your scatterplot
	// Add the axes to a group element that you add to the SVG drawing area.
	// Use translate() to change the axis position
	svg.append("g")
		.attr("class", "xAxis")
		.attr("transform", "translate(" + (0) + "," + (margin.top + height) + ")")
		.call(xAxis);
	svg.append("g")
		.attr("class", "yAxis")
		.attr("transform", "translate(" + (margin.left) + "," + (margin.top) + ")")
		.call(yAxis);

	// Step 8: Refine the domain of the scales
	// Notice that some of the circles are positioned on the outer edges of the svg area
	// You can include buffer values to widen the domain and to prevent circles and axes from overlapping


	// Step 9: Label your axes
	svg.append("text")
		.attr("class", "x label")
		.attr("text-anchor", "end")
		.attr("transform", "translate(" + (margin.left+width) + "," + (margin.top+height-3) + ")")
		.text("Income");
	svg.append("text")
		.attr("class", "y label")
		.attr("text-anchor", "end")
		.attr("transform", "translate(" + (margin.left+20) + "," + (margin.top+25) + ")")
		.text("Life Expectancy");



	// Step 10: Add a scale function for the circle radius
	// Create a population-dependent linear scale function. The radius should be between 4 - 30px.
	// Then use the scale function to specify a dynamic radius


	// Step 11: Change the drawing order
	// Larger circles should not overlap or cover smaller circles.
	// Sort the countries by population before drawing them.


	// Step 12: Color the circles (countries) depending on their regions
	// Use a D3 color scale



}


// Load CSV file
d3.csv("data/wealth-health-2014.csv", prepareData,function(data){

	// Analyze the dataset in the web console
	console.log(data);
	console.log("Countries: " + data.length);
	data.sort(compare);
	createVisualization(data);
})



