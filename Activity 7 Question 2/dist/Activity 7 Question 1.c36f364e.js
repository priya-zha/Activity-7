//import { csv, select, scaleOrdinal, schemeCategory10, rollup, pie, arc } from 'd3';
//import { scatterPlot } from './scatterPlot';
//console.log("D3 Version:", d3.version);
// GitHub Gist URL containing the CSV data
const csvUrl = 'https://gist.githubusercontent.com/priya-zha/d89852ea8864c23b2af402c67f635973/raw/6ebc0a376c35adb05054091217541923d52f2726/penguins.csv';
console.log("D3 Version:", d3.version);
// Function to parse the CSV and count species occurrences
const parseData = async ()=>{
    const data = await d3.csv(csvUrl);
    // Check if Species column exists
    if (!data[0].Species) {
        console.error("Column 'Species' not found in CSV!");
        return [];
    }
    // Count the occurrences of each species
    const speciesCount = d3.rollup(data, (v)=>v.length, (d)=>d.Species);
    // Prepare the pie chart data
    return Array.from(speciesCount, ([Species, count])=>({
            Species,
            count
        }));
};
// Set dimensions for the pie chart
const width = 400;
const height = 400;
const radius = Math.min(width, height) / 2;
// Create the SVG container
const svg = d3.select("#pieChart").attr("width", width).attr("height", height).append("g").attr("transform", `translate(${width / 2}, ${height / 2})`);
// Create the color scale
const color = d3.scaleOrdinal(d3.schemeCategory10);
// ✅ Rename `pie` to `pieGenerator` to avoid conflicts
const pieGenerator = d3.pie().value((d)=>d.count);
// ✅ Rename `arc` to `arcGenerator` to avoid conflicts
const arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);
// Function to draw the chart
const drawChart = (pieData)=>{
    if (pieData.length === 0) {
        console.error("No data to display in pie chart.");
        return;
    }
    // Calculate total count for percentage calculation
    const total = d3.sum(pieData, (d)=>d.count);
    // Draw the pie chart slices
    const arcs = svg.selectAll("arc").data(pieGenerator(pieData)).enter().append("g").attr("class", "arc");
    arcs.append("path").attr("d", arcGenerator).attr("fill", (d)=>color(d.data.Species));
    // ✅ Append text labels with percentages
    arcs.append("text").attr("transform", (d)=>`translate(${arcGenerator.centroid(d)})`).attr("dy", "0.35em").attr("text-anchor", "middle").style("font-size", "14px").style("fill", "#fff") // White text for better visibility
    .text((d)=>`${(d.data.count / total * 100).toFixed(1)}%`);
};
// Append text labels on the slices
// arcs.append("text")
//   .attr("transform", d => `translate(${arcGenerator.centroid(d)})`)
//   .attr("dy", "0.35em")
//   .attr("text-anchor", "middle")
//   .text(d => d.data.Species);
// Create the legend
const createLegend = (pieData)=>{
    const legend = d3.select(".legend");
    pieData.forEach((d, i)=>{
        const legendItem = legend.append("div").attr("class", "legend-item");
        legendItem.append("div") // Use div instead of rect
        .style("width", "20px").style("height", "20px").style("background-color", color(d.Species)).style("display", "inline-block").style("margin-right", "10px");
        legendItem.append("span").text(d.Species).style("font-size", "16px");
    });
};
// Main function to fetch data and draw the chart
const main = async ()=>{
    const pieData = await parseData();
    drawChart(pieData);
    createLegend(pieData);
};
main();

//# sourceMappingURL=Activity 7 Question 1.c36f364e.js.map
