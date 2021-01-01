import React from 'react';
import { scaleLinear } from 'd3-scale';
import { max, min } from 'd3-array';
import { select } from 'd3-selection';
import { axisBottom, axisLeft } from 'd3-axis';
import data from "./wealth-health-2014.csv";
import { csv } from 'd3-request';

class Visualization extends React.Component {
    constructor(props){
        super(props);
        this.createVisualization = this.createVisualization.bind(this);
        this.state = {width: 640, height: 420,
            margin: {top: 30, right: 30, bottom: 50, left: 30}, csvdata: []}
    }
    
componentDidMount(){
    this.createVisualization();
}

componentDidUpdate(){
    this.createVisualization();
}

createVisualization = () => {
	// Step 2: Append a new SVG area with D3
	// The ID of the target div container in the html file is #chart-area
	// Use the margin convention with 50 px of bottom padding and 30 px of padding on other sides!
    
    var compare = (a,b) => {
                if (a.Population>b.Population) return -1;
                if (a.Population<b.Population) return 1;
                return 0;
             };
    const regions = [];
    var csvdata=[];
    var width = this.state.width;
    var height = this.state.height;
    var margin = this.state.margin;
    //const node = this.node;
    var createViz = (csvdata, regions, width, height, margin, node) => {

        // var svg = d3.select("body").append("svg")
        // 	.attr("id","chart-area")
        // 	.attr("width", width + margin.left + margin.right)
        // 	.attr("height", height + margin.top + margin.bottom)
        // 	.append("g")
        // 	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
        // Step 3: Create linear scales by using the D3 scale functions
        // You will need an income scale (x-axis) and a scale function for the life expectancy (y-axis).
        // Call them incomeScale and lifeExpectancyScale.
        // Use d3.min() and d3.max() for the input domain
        // Use the variables height and width for the output range
        
    
        
        var lowX = min(csvdata, function(d){ return d.Income;})-2000;
        var lowY = min(csvdata, function(d){ return d.LifeExpectancy;})-2;
        var highX = max(csvdata, function(d){ return d.Income;})+2000;
        var highY = max(csvdata, function(d){ return d.LifeExpectancy;})+5;
        console.log(min(csvdata, function(d){ return d.Income;}));
        var xScale = scaleLinear()
            .domain([lowX, highX])
            .range([margin.left, margin.left + width]);
        var yScale = scaleLinear()
            .domain([lowY,highY])
            .range([margin.top + height,margin.top]);
        var rScale = scaleLinear()
            .domain([
                min(csvdata, function (d){return d.Population;}),
                max(csvdata, function (d){return d.Population;})
            ])
            .range([4,30]);
        var linearColor = scaleLinear()
            .domain([0,1,2,3,4,5])
            .range(["darkgreen","darkorange","red","pink","blue","tan"]);
        // Step 4: Try the scale functions
        // You can call the functions with example values and print the result to the web console.
    
        // Step 5: Map the countries to SVG circles
        // Use select(), data(), enter() and append()
        // Instead of setting the x- and y-values directly,
        // you have to use your scale functions to convert the data values to pixel measures
        select(node)
            .selectAll("circle")
            .data(csvdata)
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
        var xAxis = axisBottom()
            .scale(xScale);
        var yAxis = axisLeft()
            .scale(yScale);
    
        // Step 7: Append the x- and y-axis to your scatterplot
        // Add the axes to a group element that you add to the SVG drawing area.
        // Use translate() to change the axis position
        select(node)
            .append("g")
            .attr("class", "xAxis")
            .attr("transform", "translate(" + (0) + "," + (margin.top + height + 20) + ")")
            .call(xAxis);
        select(node)
            .append("g")
            .attr("class", "yAxis")
            .attr("transform", "translate(" + (margin.left) + "," + (margin.top) + ")")
            .call(yAxis);
    
        // Step 8: Refine the domain of the scales
        // Notice that some of the circles are positioned on the outer edges of the svg area
        // You can include buffer values to widen the domain and to prevent circles and axes from overlapping
    
    
        // Step 9: Label your axes
        select(node)
            .append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("transform", "translate(" + (margin.left+width) + "," + (margin.top+height-3) + ")")
            .text("Income");
        select(node)
            .append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("transform", "translate(" + (margin.left+100) + "," + (margin.top+25) + ")")
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

    csv(data, (data) => {
        data.forEach(element => {
                if (!regions.includes(element.Region)){
                    regions.push(element.Region);
                }
                element.LifeExpectancy = parseFloat(element.LifeExpectancy);
                element.Income = parseInt(element.Income);
                element.Population = parseInt(element.Population);
                csvdata.push(element);
            }
                );
        console.log("Countries: " + data.length);
        data.sort(compare);
        console.log(data);
        console.log(regions);
        //this.setState({csvdata: data});
        createViz (data, regions, width, height, margin, this.node);

    });
}
    



render() {
    return (
        <svg ref={node=>this.node=node} width={this.state.width + this.state.margin.left + this.state.margin.right} height={this.state.height + this.state.margin.top + this.state.margin.bottom}></svg>
    );
}
}

export default Visualization;