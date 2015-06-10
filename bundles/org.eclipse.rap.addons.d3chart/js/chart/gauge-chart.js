d3chart.GaugeChart = function(parent) {
	this._chart = new d3chart.Chart(parent, this);
	
	var config = 
	{
		size: this._chart._width,
		label: "Gauge",
		min: 0,
		max: 100,
		minorTicks: 5,
		majorTicks: 5
	};
	this.gaugeValue=0;
	
	this.configure(config);
};

d3chart.GaugeChart.prototype = {
	initialize : function() {
		this._updateLayout();
	},
	
	destroy: function() {
	    this._chart.destroy();
	},
	
	configure : function(configuration)
	{
		
		
		this.config = configuration;
		
		var range = configuration.max - configuration.min;
		this.config.yellowZones = [{ from: configuration.min + range*0.75, to: configuration.min + range*0.9 }];
		this.config.redZones = [{ from: configuration.min + range*0.9, to: configuration.max }];
		
		//this.config.size = this.config.size * 0.95;
		
		this.config.radius = this.config.size * 0.97 / 2;
		//this.config.radius = this.config.size / 2;
		this.config.cx = this._chart._width / 2;
		this.config.cy = this._chart._height / 2;
		
		this.config.min = undefined !== configuration.min ? configuration.min : 0; 
		this.config.max = undefined !== configuration.max ? configuration.max : 100; 
		this.config.range = this.config.max - this.config.min;
		
		this.config.majorTicks = configuration.majorTicks || 5;
		this.config.minorTicks = configuration.minorTicks || 2;
		
		this.config.greenColor 	= configuration.greenColor || "#109618";
		this.config.yellowColor = configuration.yellowColor || "#FF9900";
		this.config.redColor 	= configuration.redColor || "#DC3912";
		
		this.config.transitionDuration = configuration.transitionDuration || 500;
	},

	_updateLayout : function()
	{
		this._layer = this._chart.getLayer( "layer" );
		
		this.body = this._layer
					.append("svg:svg")
					.attr("class", "gauge")
					.attr("width", this.config.size)
					.attr("height", this.config.size);
		
		this.body.append("svg:circle")
					.attr("cx", this.config.cx)
					.attr("cy", this.config.cy)
					.attr("r", this.config.radius)
					.style("fill", "#ccc")
					.style("stroke", "#000")
					.style("stroke-width", "0.5px");
					
		this.body.append("svg:circle")
					.attr("cx", this.config.cx)
					.attr("cy", this.config.cy)
					.attr("r", 0.9 * this.config.radius)
					.style("fill", "#fff")
					.style("stroke", "#e0e0e0")
					.style("stroke-width", "2px");
					
		for (var index in this.config.greenZones)
		{
			this.drawBand(this.config.greenZones[index].from, this.config.greenZones[index].to, this.config.greenColor);
		}
		
		for (var index2 in this.config.yellowZones)
		{
			this.drawBand(this.config.yellowZones[index2].from, this.config.yellowZones[index2].to, this.config.yellowColor);
		}
		
		for (var index3 in this.config.redZones)
		{
			this.drawBand(this.config.redZones[index3].from, this.config.redZones[index3].to, this.config.redColor);
		}
		
		if (undefined !== this.config.label)
		{
			var fontSize1 = Math.round(this.config.size / 9);
			this.body.append("svg:text")
						.attr("x", this.config.cx)
						.attr("y", this.config.cy / 2 + fontSize1 / 2)
						.attr("dy", fontSize1 / 2)
						.attr("text-anchor", "middle")
						.text(this.config.label)
						.style("font-size", fontSize1 + "px")
						.style("fill", "#333")
						.style("stroke-width", "0px");
		}
		
		var fontSize = Math.round(this.config.size / 16);
		var majorDelta = this.config.range / (this.config.majorTicks - 1);
		for (var major = this.config.min; major <= this.config.max; major += majorDelta)
		{
			var minorDelta = majorDelta / this.config.minorTicks;
			for (var minor = major + minorDelta; minor < Math.min(major + majorDelta, this.config.max); minor += minorDelta)
			{
				var point11 = this.valueToPoint(minor, 0.75);
				var point12 = this.valueToPoint(minor, 0.85);
				
				this.body.append("svg:line")
							.attr("x1", point11.x)
							.attr("y1", point11.y)
							.attr("x2", point12.x)
							.attr("y2", point12.y)
							.style("stroke", "#666")
							.style("stroke-width", "1px");
			}
			
			var point1 = this.valueToPoint(major, 0.7);
			var point2 = this.valueToPoint(major, 0.85);	
			
			this.body.append("svg:line")
						.attr("x1", point1.x)
						.attr("y1", point1.y)
						.attr("x2", point2.x)
						.attr("y2", point2.y)
						.style("stroke", "#333")
						.style("stroke-width", "2px");
			
			if (major === this.config.min || major === this.config.max)
			{
				var point = this.valueToPoint(major, 0.63);
				
				this.body.append("svg:text")
				 			.attr("x", point.x)
				 			.attr("y", point.y)
				 			.attr("dy", fontSize / 3)
				 			.attr("text-anchor", major === this.config.min ? "start" : "end")
				 			.text(major)
				 			.style("font-size", fontSize + "px")
							.style("fill", "#333")
							.style("stroke-width", "0px");
			}
		}
		
		var pointerContainer = this.body.append("svg:g").attr("class", "pointerContainer");
		
		var midValue = (this.config.min + this.config.max) / 2;
		
		var pointerPath = this.buildPointerPath(midValue);
		
		var pointerLine = d3.svg.line()
									.x(function(d) { return d.x; })
									.y(function(d) { return d.y; })
									.interpolate("basis");
		
		pointerContainer.selectAll("path")
							.data([pointerPath])
							.enter()
								.append("svg:path")
									.attr("d", pointerLine)
									.style("fill", "#dc3912")
									.style("stroke", "#c63310")
									.style("fill-opacity", 0.7);
					
		pointerContainer.append("svg:circle")
							.attr("cx", this.config.cx)
							.attr("cy", this.config.cy)
							.attr("r", 0.12 * this.config.radius)
							.style("fill", "#4684EE")
							.style("stroke", "#666")
							.style("opacity", 1);
		
		fontSize = Math.round(this.config.size / 10);
		pointerContainer.selectAll("text")
							.data([midValue])
							.enter()
								.append("svg:text")
									.attr("x", this.config.cx)
									.attr("y", this.config.size - this.config.cy / 4 - fontSize)
									.attr("dy", fontSize / 2)
									.attr("text-anchor", "middle")
									.style("font-size", fontSize + "px")
									.style("fill", "#000")
									.style("stroke-width", "0px");
		
		//this.render(this.gaugeValue, 0);
	},
	
	buildPointerPath : function(value)
	{
		var that = this;
		function valueToPoint(value, factor)
		{
			var point = that.valueToPoint(value, factor);
			point.x -= that.config.cx;
			point.y -= that.config.cy;
			return point;
		}
		
		var delta = this.config.range / 13;
		
		var head = valueToPoint(value, 0.85);
		var head1 = valueToPoint(value - delta, 0.12);
		var head2 = valueToPoint(value + delta, 0.12);
		
		var tailValue = value - (this.config.range * (1/(270/360)) / 2);
		var tail = valueToPoint(tailValue, 0.28);
		var tail1 = valueToPoint(tailValue - delta, 0.12);
		var tail2 = valueToPoint(tailValue + delta, 0.12);
		
		return [head, head1, tail2, tail, tail1, head2, head];
		
		
	},
	
	drawBand : function(start, end, color)
	{
		var that = this;
		if (0 >= end - start) { return; }
		
		this.body.append("svg:path")
					.style("fill", color)
					.attr("d", d3.svg.arc()
						.startAngle(this.valueToRadians(start))
						.endAngle(this.valueToRadians(end))
						.innerRadius(0.65 * this.config.radius)
						.outerRadius(0.85 * this.config.radius))
					.attr("transform", function() { return "translate(" + that.config.cx + ", " + that.config.cy + ") rotate(270)"; });
	},
	
	render : function()
	{
		var that = this;
		
		var pointerContainer = this.body.select(".pointerContainer");
		
		pointerContainer.selectAll("text").text(Math.round(this.gaugeValue));
		
		var pointer = pointerContainer.selectAll("path");
		pointer.transition()
					.duration(this.config.transitionDuration)
					//.delay(0)
					//.ease("linear")
					//.attr("transform", function(d) 
					.attrTween("transform", function()
					{
						var pointerValue = that.gaugeValue;
						if (pointerValue > that.config.max) {
							pointerValue = that.config.max + 0.02*that.config.range;
						} else if (pointerValue < that.config.min) {
							pointerValue = that.config.min - 0.02*that.config.range;
						}
						var targetRotation = (that.valueToDegrees(pointerValue) - 90);
						var currentRotation = that._currentRotation || targetRotation;
						that._currentRotation = targetRotation;
						
						return function(step) 
						{
							var rotation = currentRotation + (targetRotation-currentRotation)*step;
							return "translate(" + that.config.cx + ", " + that.config.cy + ") rotate(" + rotation + ")"; 
						};
					});
	},
	
	valueToDegrees : function(value)
	{
		// thanks @closealert
		//return value / this.config.range * 270 - 45;
		return value / this.config.range * 270 - (this.config.min / this.config.range * 270 + 45);
	},
	
	valueToRadians : function(value)
	{
		return this.valueToDegrees(value) * Math.PI / 180;
	},
	
	valueToPoint : function(value, factor)
	{
		return { 	x: this.config.cx - this.config.radius * factor * Math.cos(this.valueToRadians(value)),
					y: this.config.cy - this.config.radius * factor * Math.sin(this.valueToRadians(value)) 		};
	},
	setGaugeValue : function( value ) {
		this.gaugeValue=value;
	    this._chart._scheduleUpdate();
	},
	setLabel : function( label ) {
		this.config.label=label;
	    this._chart._scheduleUpdate(true);
	},
	setMin : function( value ) {
		this.config.min = value;
		this.configure(this.config);
		this._chart._scheduleUpdate(true);
	},
	setMax : function( value ) {
		this.config.max = value;
		this.configure(this.config);
		this._chart._scheduleUpdate(true);
	},
	setMinorTicks : function( value ) {
		this.config.minorTicks = value +1;
		this.configure(this.config);
		this._chart._scheduleUpdate(true);
	},
	setMajorTicks : function( value ) {
		this.config.majorTicks = value + 1;
		this.configure(this.config);
		this._chart._scheduleUpdate(true);
	}
};

// TYPE HANDLER

rap.registerTypeHandler("d3chart.GaugeChart", {

	factory : function(properties) {
		var parent = rap.getObject(properties.parent);
		return new d3chart.GaugeChart(parent);
	},

	destructor : "destroy",

	properties : [ "gaugeValue", "label", "min", "max", "minorTicks", "majorTicks" ],

	events : [ "Selection" ]

});
