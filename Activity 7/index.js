import { csv, select } from 'd3';
//import * as d3 from 'https://cdn.skypack.dev/d3';
import { scatterPlot } from './scatterPlot';

const csvUrl = [
  'https://gist.githubusercontent.com/priya-zha/3dc3aa9a47007d7611c0e32d6a93ee3d/raw/32dc00c22df5f1d665c6b63181089d5eade9765f/iris.csv', // File name
].join('');
const parseRow = (d) => {
  d.sepal_length = +d.sepal_length;
  d.sepal_width = +d.sepal_width;
  d.petal_length = +d.petal_length;
  d.petal_width = +d.petal_width;
  return d;
};

const width = window.innerWidth;
const height = window.innerHeight;
const svg = select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

const xValue = (d) => d.petal_length;
const yValue = (d) => d.petal_width;
const rxValue = (d) => d.sepal_length;
const ryValue = (d) => d.sepal_width;
const speciesValue = (d) => d.species;
const colorValue = d => d.species;
const colorLabel = 'Species';


const main = async () => {
  const data = await csv(csvUrl, parseRow);
  const x = xValue((d) => d.petal_width);
  const y = yValue((d) => d.sepal_length);
  const marker = (d) => {
        	switch(d){
            case 'setosa': //label names on top
              return 'skyblue';  // colours for each type
            case 'versicolor':
              return 'lightgreen';
            default:
              return 'orange';
          }
        }
  //values of xand y axis
  const marks = data.map((d) => ({
          x: xValue((d) => d.petal_width),
          y: yValue((d) => d.sepal_length),
          species: speciesValue(d),
          color: marker(speciesValue(d)),
        	rx: rxValue(d),
          ry: ryValue(d),
                      
        }));
  
  
//structure of scatterplot  is defined
  const plot = scatterPlot()
    .width(width)
    .height(height)
    .data(await csv(csvUrl, parseRow))
    .xValue((d) => d.petal_width)
    .yValue((d) => d.sepal_length)
    .margin({
      top: 28,
      right: 53,
      bottom: 82,
      left: 88,

    })
    .radius(5);
  
  
 const g = svg.append('g')
          .attr('transform', `translate(${100},${100})`);

      const colorLegendG = g.append('g')
          .attr('transform', `translate(${100}, 150)`);





//shape of that scattered data 
svg
          .selectAll('circle')
          .data(marks)
          .join('circle')
          .attr('cx', (d) => d.x)
          .attr('cy', (d) => d.y)
        	.attr('fill', (d) => d.color)
        	.attr('rx', (d) => (d.rx))
        	.attr('ry', (d) => (d.ry));

     
    
  
  const columns = [
    'petal_width',
    'sepal_width',
    'petal_length',
    'sepal_length',
  ];

  
  let i = 0;
  setInterval(() => {
    plot.xValue((d) => d[columns[i % columns.length]]);  
		svg.selectAll('text').remove();
    svg.call(plot);
    
      colorLegendG.append('text')
          .attr('class', 'legend-label')
          .attr('x', -70)
          .attr('y', -210)
          .style("font-style","italic")
          .style("stroke","violet")
    			.style("font-weight","bold")
    			.style("font-style","italic")
          .text(colorLabel);

   
// display Title 
svg.append("text").attr("x", 450).attr("y", 20).text("Iris Scatterplot").style("font-size", "40px").attr("alignment-baseline","middle").attr('fill','lightgreen').style("font-style","italic")
        	.style("text-decoration","underline")

   
// Adding  labels in the legend and its style 
svg.append("text").attr("x", 150).attr("y", 70).text("Setosa").style("font-size", "20px").attr("alignment-baseline","middle")
svg.append("text").attr("x", 150).attr("y", 100).text("Versicolor").style("font-size", "20px").attr("alignment-baseline","middle")
svg.append("text").attr("x", 150).attr("y", 130).text("Virginica").style("font-size", "20px").attr("alignment-baseline","middle")
  
    svg
        	.append("text")
        	.attr('transform', 'rotate(-90)')
        	.attr('x',0 - (height /2))
        	.attr("y",  height/12)
    			.attr('fill', 'red')
        	.style("text-anchor", "middle")
        	.style("font-style","italic")
        	.style("font-weight","bold")
        	.text("Sepal Length");
    
    // Add points for legend
    svg.append("circle").attr("cx",130).attr("cy",70).attr("r", 6).style("fill", "lightblue")
		svg.append("circle").attr("cx",130).attr("cy",100).attr("r", 6).style("fill", "lightgreen")
		svg.append("circle").attr("cx",130).attr("cy",130).attr("r", 6).style("fill", "orange")
   // plot petal_width on x-axis
    if(i % columns.length==0) 
    svg
        	.append("text")
        	.attr("x", width / 2 )
      		.attr("y",  480 )
    			.attr('fill','red')
        	.style("text-anchor", "middle")
        	.style("font-style","italic")
        	.style("font-weight","bold")
      		.text("Petal Width");
     // plot sepal_width on x-axis
    else if(i % columns.length==1) 
    svg
        	.append("text")
        	.attr("x", width / 2 )
      		.attr("y",  480 )
    			.attr('fill','red')
        	.style("text-anchor", "middle")
        	.style("font-style","italic")
        	.style("font-weight","bold")
      		.text("Sepal Width");
     // plot petal_length on x-axis
    else if(i % columns.length==2) 
    svg
        	.append("text")
        	.attr("x", width / 2 )
      		.attr("y",  520 )
    			.attr('fill','red')
        	.style("text-anchor", "middle")
        	.style("font-weight","bold")
      		.text("Petal Length");
     // plot sepal_length on x-axis
       else 
    svg
        	.append("text")
        	.attr("x", width / 2 )
      		.attr("y",  540 )
        	.style("text-anchor", "middle")
        	.style("font-style","italic")
        	.style("font-weight","bold")
      		.text("Sepal Length");
    i++;
  }, 5000);// every 5 seconds changes the visualization
};
main();




