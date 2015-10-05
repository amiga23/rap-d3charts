/*******************************************************************************
 * Copyright (c) 2013 EclipseSource and others. All rights reserved. This
 * program and the accompanying materials are made available under the terms of
 * the Eclipse Public License v1.0 which accompanies this distribution, and is
 * available at http://www.eclipse.org/legal/epl-v10.html
 * 
 * Contributors: Ralf Sternberg - initial API and implementation
 ******************************************************************************/

d3chart.GroupedBarChart = function(parent) {
	this._chart = new d3chart.Chart(parent, this);
	
	this._myData = [];
	this._description = "Number";
	this._colors = [ "orange", "grey", "green" ];
	this._tooltipBoxWidth = 75;
	this._tooltipBoxHeight = 20;
	this._tooltipPadding = 5;
	this._legendPadding = 30;
	this._legendSpacing = 60;
	this._font = "12px sans-serif";
	this._yAxisLabelWidth = 40;
	this._paddingRight = 20;
};

d3chart.GroupedBarChart.prototype = {

	destroy : function() {
		this._chart.destroy();
	},

	initialize : function() {
		this._layer = this._chart.getLayer("layer");
	},

	render : function() {
		this._createSegment(this._layer);
	},

	setColors : function(colors) {
		this._colors = colors;
	},

	setValues : function(values) {
		this._myData = values;
	},
	
	setDescription : function (description) {
		this._description = description;
	},
	
	setTooltipBoxWidth : function (tooltipBoxWidth) {
		this._tooltipBoxWidth = tooltipBoxWidth;
	},
	
	setTooltipBoxHeight : function (tooltipBoxHeight) {
		this._tooltipBoxHeight = tooltipBoxHeight;
	},
	
	setTooltipPadding : function (tooltipPadding) {
		this._tooltipPadding = tooltipPadding;
	}, 
	
	setLegendSpacing : function (legendSpacing) {
		this._legendSpacing = legendSpacing;
	}, 
	
	setFont : function (font) {
		this._font = font;
	},
	
	setYAxisLabelWidth : function(yAxisLabelWidth) {
		this._yAxisLabelWidth = yAxisLabelWidth;
	},
	
	setPaddingRight : function(paddingRight) {
		this._paddingRight = paddingRight;
	},
	
	_createSegment : function(selection) {

		var margin = {
			top : 10 + this._tooltipBoxHeight + this._tooltipPadding - this._legendPadding,
			right : this._paddingRight,
			bottom : 30,
			left : this._yAxisLabelWidth 
		}
		
		var width = this._chart._width - margin.left - margin.right 
		var height = this._chart._height - margin.top - margin.bottom;
		
		
		selection.attr("transform","translate(" + margin.left + "," + margin.top + ")");
		
		var myData = this._myData;

		/**
		 * Creates a scale that is used for the x-axis (keys): A scale is a
		 * function that maps from an input domain (e.g. 6 keys are supposed to
		 * be displayed) to an output range (e.g. the available space for one
		 * group of bars (representing one key of six keys) )
		 */
		var x0 = d3.scale.ordinal().rangeRoundBands([ 10, width ], .1);

		/** Creates a scale that is used for the bars in the groups of bars */
		var x1 = d3.scale.ordinal();

		/** Creates a linear/continuous scale from 0 to height */
		var y = d3.scale.linear().range([ height, this._legendPadding ]);

		/** The bar's colors */
		var color = d3.scale.ordinal().range(this._colors);

		/** Creates a new axis, sets the scale x0 (keys) and the orientation */
		var xAxis = d3.svg.axis().scale(x0).orient("bottom");

		/**
		 * Creates a new vertical axis, sets the scale to y. 
		 * Also sets the orientation of the ticks and the tickFormat. 
		 * This axis will display the ticks' labels (i.e. numbers). 
		 */
		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left")
			.tickFormat(d3.format(".2s"));
  		
		/**
  		 * Creates a new vertical axis, sets the scale to y. 
  		 * Also sets the orientation of the ticks and the tick format 
  		 * so that the ticks are displayed horizontal grid lines. 
  		 * tickFormat("") results in no text as labels are 
  		 * displayed by the y-axis. 
  		 */
		var gridLines = d3.svg.axis()
  			.scale(y).
  			orient("right").
  			tickSize(width).
  			tickFormat("");

		/** Retrieve the bars' names from the JsonArray */
		var moduleNames = d3.keys(myData[0]).filter(function(key) {
			return key !== "Key";
		});
		
		myData.forEach(function(d) {
			d.names = moduleNames.map(function(name) {
				return {
					name : name,
					value : +d[name]
				};
			});
		});

		/** Maps the array's elements (keys) to the scale x0 */
		x0.domain(myData.map(function(d) {return d.Key;}));
		/** Maps the array's elements (moduleNames) to the scale x1 */
		x1.domain(moduleNames).rangeRoundBands([ 0, x0.rangeBand() ]);
		/** Sets the scale from 0 to the highest value */
		y.domain([ 0, d3.max(myData, function(d) {
			return d3.max(d.names, function(d) {
				return d.value;
			});
		}) ]);

		/** Appends the x-axis to the SVG */
		selection.append("g")
			.attr("class", "x_axis")
			.attr("transform","translate(0," + parseInt(height) + ")")
			.call(xAxis);

		/** Appends the y-axis to the SVG */
		selection.append("g")
			.attr("class", "yAxis")
			.call(yAxis)
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("x", - this._legendPadding)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text(this._description);
		
		/** Appends the grid lines to the SVG */
		selection.append("g")
			.attr("class", "gridLines")
			.call(gridLines);
		
		/** Creates a group for grouped bar charts for each key */
		var key = selection.selectAll(".key")
			.data(myData)
			.enter()
			.append("g")
			.attr("class", "g")
			.attr("id", function(d) {return x0(d.Key)})
			.attr("transform", function(d) {
				return "translate(" + (parseInt(x0(d.Key))) + ",0)";
			});

		/** Creates bars in each grouped bar chart and assigns values */
		var bar = key.selectAll("rect")
			.data(function(d) {return d.names;})
			.enter()
			.append("rect")
			.attr("width", x1.rangeBand())
			.attr("id", function(d, i) {return i})
			.attr("x", function(d) { return x1(d.name);})
			.attr("y", function(d) { return y(d.value);})
			.attr("height", function(d) {return height - y(d.value);})
			.style("fill", function(d) { return color(d.name);})
			.style("opacity", "1.0");
		
		/** Creates one legend element for each Module Name */
		var legendSpacing = this._legendSpacing
		var legend = selection.selectAll(".legend")
			.data(moduleNames.slice())
			.enter()
			.append("g")
			.attr("class", "legend")
			.attr("transform", function(d, i) {return "translate(" + i * legendSpacing + ", 0)";});
		
		/** Appends a colored rectangle for each legend element */
		legend.append("rect")
			.attr("x", width/2 - moduleNames.length*this._legendSpacing/2 )
			.attr("width", 18)
			.attr("height", 18)
			.style("fill", color);

		/** Appends the Modules Name for each legend element */
		legend.append("text")
			.attr("x", width/2 - moduleNames.length*this._legendSpacing/2 + 22)
			.attr("y", 9)
			.attr("dy",".35em")
			.style("text-anchor", "start")
			.text(function(d) {return d;});
		
		/** Sets variables that are used for tooltip */
		var tooltipBoxWidth = this._tooltipBoxWidth;
		var tooltipBoxHeight = this._tooltipBoxHeight;
		var tooltipPadding = this._tooltipPadding;
		
		/** The box that contains the text */
		var tooltipBox = selection.append("rect")
			.attr("x", 0)
			.attr("y", 0)
			.attr("width", tooltipBoxWidth)
			.attr("height", tooltipBoxHeight)
			.attr("dy", ".35em")
			.style("fill", "white")
			.style("opacity", "0.8")
			.style("stroke", "black")
			.style("stroke-width", "1")
			.style("display", "none");
	
		/** The text that will be displayed in the tooltip */
		var tooltipText = selection.append("text")
			.attr("x", width/2)
			.attr("y", 9)
			.attr("dy", ".35em")
			.style("fill", "black")
			.style("text-anchor", "middle")
			.style("display", "none");
		
		/** The pointer between the bar and the tooltip box */
		var tooltipPointer = selection.append("line")
			.attr("x1", 0)
			.attr("y1", 0)
			.attr("x2", 0)
			.attr("y2", 0)
			.style("opacity", "0.8")
			.style("stroke", "black")
			.style("stroke-width", "1")
			.style("dispaly", "none");
		
		/** Sets the actions that will be executed when the mouse hovers over one bar. 
		 * The tooltip's elements (tooltipText, tooltipBox, tooltipPointer) are 
		 * replaced to the appropriate position. 
		 */
		bar.on("mouseover", function(d,i) {
			//create a black border around the bar
			d3.select(this).style("stroke", "black");
			//TooltipText
			tooltipText.style("display", "block");
			tooltipText.text(d.name + ": " + d.value);
			tooltipText.attr("y", parseInt(d3.select(this).attr("y")) - tooltipPadding - tooltipBoxHeight/2 + 'px')
					   .attr("x", (
							parseInt(d3.select(this).attr("width"))/2 +
							parseInt(d3.select(this).attr("x")) + 
							parseInt(d3.select(this.parentNode).attr("id"))) 
							+"px");
			tooltipBox.style("display", "block");
			
			//tooltipPointer
			tooltipPointer.attr("y1", parseInt(d3.select(this).attr("y")));
			tooltipPointer.attr("y2", parseInt(d3.select(this).attr("y"))-tooltipPadding);
			tooltipPointer.attr("x1", parseInt(d3.select(this).attr("width"))/2 +
					parseInt(d3.select(this).attr("x")) + 
					parseInt(d3.select(this.parentNode).attr("id")));
			tooltipPointer.attr("x2", parseInt(d3.select(this).attr("width"))/2 +
					parseInt(d3.select(this).attr("x")) + 
					parseInt(d3.select(this.parentNode).attr("id")));
			tooltipPointer.style("display", "block");
			
			//tooltipBox
			tooltipBox.attr("y", parseInt(d3.select(this).attr("y")) - tooltipPadding - tooltipBoxHeight + 'px')
					  .attr("x", (
						parseInt(d3.select(this).attr("width"))/2 +
						parseInt(d3.select(this).attr("x")) + 
						parseInt(d3.select(this.parentNode).attr("id")) 
						- (parseInt(tooltipBoxWidth)) / 2)
						+"px");
		});
		
		/** Sets the actions that will be executed when the mouse does not hover over the bar anymore. 
		 * The tooltip's elements (tooltipText, tooltipBox, tooltipPointer) become invisible. 
		 */
		bar.on("mouseout", function(d,i) {
			//remove the black border of the bar
			d3.select(this).style("stroke", "none");
			//make the tooltip's elements invisible
			tooltipText.style("display", "none");
			tooltipBox.style("display", "none");
			tooltipPointer.style("display", "none");
		});
		
		/** Style the elements using CSS selectors and CSS properties */
		d3.selectAll("path").style("display", "none");
		d3.selectAll(".gridLines").selectAll(".tick").style("stroke", "#777").style("stroke-dasharray", "2,2");
		d3.selectAll("path").style("stroke", "#777");
		d3.selectAll("g").style("font", this._font);
		d3.selectAll("text").style("stroke", "black");
	},
};

// TYPE HANDLER

rap.registerTypeHandler("d3chart.GroupedBarChart", {

	factory : function(properties) {
		var parent = rap.getObject(properties.parent);
		return new d3chart.GroupedBarChart(parent);
	},

	destructor : "destroy",

	properties : [ "colors", "values", "description", "tooltipBoxWidth", "tooltipBoxHeight", "tooltipPadding", "legendSpacing", "font", "yAxisLabelWidth", "paddingRight" ],

	events : [ "Selection" ]

});
