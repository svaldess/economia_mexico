
var margin = {top: 100, right: 50, bottom: 70, left: 100},
width = 750 - margin.left - margin.right,
height = 550 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y-%m-%d").parse;

var x = d3.time.scale()
.range([0, width]);

var y = d3.scale.linear()
.range([height, 0]);

var color = d3.scale.category10();

// Axis
var xAxis = d3.svg.axis()
.scale(x)
.innerTickSize(15)
.outerTickSize(0)
.orient("bottom");

var yAxis = d3.svg.axis()
.scale(y)
.tickFormat(function(d) { return d ;})
.ticks(5)
.innerTickSize(15)
.outerTickSize(1)
.orient("left");

var line = d3.svg.line()
.interpolate("basis")
.x(function(d) { return x(d.date); })
.y(function(d) { return y(d.valor); }); 

var svg = d3.select("body").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append('text')
  .attr('class', 'title')
  .attr('x', margin.left - 130)
  .attr('y', margin.top - 150)
  .attr("text-anchor", "start")  
  .attr("font-weight",function(d,i) {return i*550+550;})
  .attr("font-family", function(d,i) {return i<5 ? "sans-serif" : "sans-serif"; })
  .style("font-size", "27px") 
  .style('fill', '#424242')
  .html('Los efectos económicos de la pandemia en México');

svg.append("text")
  .attr("class", "subtitle")
  .attr('x', margin.left - 130)
  .attr("y", margin.top - 120)
  .attr("font-weight",function(d,i) {return i*550+550;})
  .attr("font-family", function(d,i) {return i<5 ? "sans-serif" : "sans-serif"; })
  .style("font-size", "15px") 
  .style('fill', '#424242')
  .html("Comportamiento mensual de actividades secundarias y terciarias (Enero 2013 - Junio 2020)");

svg.append("text")
  .attr("class", "cite")
  .attr('x', margin.right + 475)
  .attr("y", margin.bottom  + 370)
  .attr("font-weight",function(d,i) {return i*550+550;})
  .attr("font-family", function(d,i) {return i<5 ? "sans-serif" : "sans-serif"; })
  .style("font-size", "10px") 
  .style('fill', '#424242')
  .html("Fuente: Inegi.");

//legend
var legend = svg.append("g")
    .attr("transform", "translate(" + (width - 480) + ", " + (height - 125) + ")");

legend.append("text")
    .attr("x", -10)
    .attr("y", 10)
    .attr("text-anchor", "end")
    .text("Minería")
legend.append("rect")
    .attr("width", 10)
    .attr("height", 10)
    .attr("fill", "#1ac1db");

legend.append("text")
    .attr("x", -10)
    .attr("y", 30)
    .attr("text-anchor", "end")
    .text("Energía")
legend.append("rect")
    .attr("y", 20)
    .attr("width", 10)
    .attr("height", 10)
    .attr("fill", "#1adb1a");

legend.append("text")
    .attr("x", -10)
    .attr("y", 50)
    .attr("text-anchor", "end")
    .text("Construcción")
legend.append("rect")
    .attr("y", 40)
    .attr("width", 10)
    .attr("height", 10)
    .attr("fill", "#db1a61");

legend.append("text")
    .attr("x", -10)
    .attr("y", 70)
    .attr("text-anchor", "end")
    .text("Manufactura")
legend.append("rect")
    .attr("y", 60)
    .attr("width", 10)
    .attr("height", 10)
    .attr("fill", "blue");

legend.append("text")
    .attr("x", -10)
    .attr("y", 90)
    .attr("text-anchor", "end")
    .text("Sector terciario")
legend.append("rect")
    .attr("y", 80)
    .attr("width", 10)
    .attr("height", 10)
    .attr("fill", "#000");

/*
sectors.forEach(function(sector, i){
    var legendRow = legend.append("g")
        .attr("transform", "translate(0, " + (i * 20) + ")");

        legendRow.append("text")
            .attr("x", -10)
            .attr("y", 10)
            .attr("text-anchor", "end")
            .text(sector);
              
        legendRow.append("rect")
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", colors);
});
*/

// labels
var yLabel = svg.append("text")
    .attr("y", -60)
    .attr("x", -180)
    .attr("font-size", "12px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Volúmen físico (año base = 2013)");


d3.csv("data_reduced.csv", function(error, data) {
color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

data.forEach(function(d) {
d.date = parseDate(d.date);
});

var actividades = color.domain().map(function(name) {
return {
  name: name,
  values: data.map(function(d) {
    return {date: d.date, valor: +d[name]};
  })
};
});

x.domain(d3.extent(data, function(d) { return d.date; }));

y.domain([
d3.min(actividades, function(c) { return d3.min(c.values, function(v) { return v.valor; }); }),
d3.max(actividades, function(c) { return d3.max(c.values, function(v) { return v.valor; }); })
]);

svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);

svg.append("g")
  .attr("class", "y axis")
  .call(yAxis);

svg.append("line")
    .attr(
    {
        "class":"horizontalGrid",
        "x1" : 0,
        "x2" : width,
        "y1" : y(0),
        "y2" : y(0),
        "fill" : "none",
        "shape-rendering" : "crispEdges",
        "stroke" : "black",
        "stroke-width" : "1px",
        "stroke-dasharray": ("3, 3")
    });

var company = svg.selectAll(".company")
  .data(actividades)
.enter().append("g")
  .attr("class", "company");

var path = svg.selectAll(".company").append("path")
  .attr("class", "line")
  .attr("d", function(d) { return line(d.values); })
  .style("stroke", function(d) { if (d.name == "Mineria") 
                                    {return "#1ac1db"}
                                  else if (d.name == "Energia")
                                    {return "#1adb1a"}
                                  else if (d.name == "Construccion")
                                    {return "#db1a61"}
                                  else if (d.name == "Manufactura")
                                    {return "blue"}
                                  else {return "#000";}
                                     });

//var totalLength = path.node().getTotalLength();
/*
console.log(path);
console.log(path.node());
console.log(path[0][0]);
console.log(path[0][1]);
*/
var totalLength = [path[0][0].getTotalLength(), path[0][1].getTotalLength(), path[0][2].getTotalLength(), path[0][3].getTotalLength(), path[0][4].getTotalLength()];

console.log(totalLength);


d3.select(path[0][0])
  .attr("stroke-dasharray", totalLength[0] + " " + totalLength[0] ) 
  .attr("stroke-dashoffset", totalLength[0])
  .transition()
    .duration(5000)
    .ease("linear")
    .attr("stroke-dashoffset", 0);

d3.select(path[0][1])
  .attr("stroke-dasharray", totalLength[1] + " " + totalLength[1] )
  .attr("stroke-dashoffset", totalLength[1])
  .transition()
    .duration(5000)
    .ease("linear")
    .attr("stroke-dashoffset", 0);

d3.select(path[0][2])
  .attr("stroke-dasharray", totalLength[2] + " " + totalLength[2] )
  .attr("stroke-dashoffset", totalLength[2])
  .transition()
    .duration(5000)
    .ease("linear")
    .attr("stroke-dashoffset", 0);

d3.select(path[0][3])
  .attr("stroke-dasharray", totalLength[3] + " " + totalLength[3] )
  .attr("stroke-dashoffset", totalLength[3])
  .transition()
  .duration(5000)
  .ease("linear")
  .attr("stroke-dashoffset", 0);

d3.select(path[0][4])
  .attr("stroke-dasharray", totalLength[4] + " " + totalLength[4] )
  .attr("stroke-dashoffset", totalLength[4])
  .transition()
  .duration(5000)
  .ease("linear")
  .attr("stroke-dashoffset", 0);


});