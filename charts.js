function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select('#selDataset');

  // Use the list of sample names to populate the select options
  d3.json('samples.json').then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append('option')
        .text(sample)
        .property('value', sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json('samples.json').then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select('#sample-metadata');

    // Use `.html("") to clear any existing metadata
    PANEL.html('');

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append('h6').text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// ------------------------------------------ DELIVERABLE #1 / BAR CHART
// Tips from plotly: https://plotly.com/javascript/bar-charts/

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json('samples.json').then(function ({ samples, metadata }) {

    // 3. Create a variable that holds the samples array. 
    var data = samples.filter((obj) => obj.id == sample)[0];
    console.log(data);

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    // Skills used - .map(): https://www.w3schools.com/jsref/jsref_map.asp
    var otuIDS = data.otu_ids.map((row) => `OTU ID: ${row}`);

    //  5. Create a variable that holds the first sample in the array.
    var sampleValues = data.sample_values.slice(0, 10);

    // 6. Create variables that hold the (samples.json = js charts file) otu_ids = otudIDs, otu_labels = otuLables, and sample_values = sampleValues.
    var sampleLabels = data.otu_labels.map((label) => 
      label.replace(/\;/g, ', ')
    );

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    // var yticks = data.sample_values.slice(0, 10);

    // 8. Create the trace for the bar chart. 
    var barData = [
      {
        x: sampleValues.sort(function(a,b){return a-b}),
        y: otuIDS,
        type: 'bar',
        orientation: 'h',
        text: sampleLabels,
        hoverinfo: 'text',
      },
    ];
    
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      margin: {
        t: 40,
        l: 150,
      },
      title: {
        text: 'Top 10 Bacterial Species (OTUs)',
      },
    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout);
    

    // ------------------------------------------ DELIVERABLE #2 / BUBBLE CHART
    // Tips from plotly: https://plotly.com/javascript/bubble-charts/
    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: data.otu_ids,
      y: data.sample_values,
      type: 'scatter',
      /*dataSorting: { 
        enabled: true
        sortKey: 'otuIDS'
      },*/
      text: sampleLabels,
      mode: 'markers',
      marker: {
        size: data.sample_values,
        color: data.otu_ids,
      },
    }];
    
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: {text: 'Bacteria Cultures per Sample'},
      xaxis: {title: 'otuIDS'},
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.plot('bubble', bubbleData, bubbleLayout)

    // ------------------------------------------ DELIVERABLE #3 / GAUGE CHART

    // 1. Create a variable that filters the metadata array for an object in the array whose id 
    // property matches the ID number passed into buildCharts() function as the argument.
    var metadataFilter = metadata.filter((obj) => obj.id == sample)[0];

    // 2. -3 Create a variable that holds the first sample in the array and
    // converts the washing frequency to a floating point number.
    washFrequency = metadataFilter.wfreq;

    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        //domain: ,
        value: washFrequency,
        title: {text: 'Belly Button Washing Frequency'},
        type: 'indicator',
        mode: 'gauge+number',
        gauge: {axis: {range: [,10]}}
      }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
     
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.plot('gauge', gaugeData, gaugeLayout)

  });
};
