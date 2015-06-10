package org.eclipse.rap.addons.d3chart;

import org.eclipse.swt.widgets.Composite;

public class GaugeChart extends Chart {

	private static final long serialVersionUID = 2256990720324804975L;

	private static final String REMOTE_TYPE = "d3chart.GaugeChart";
	
	private int gaugeValue = 0;
	private int min = 0;
	private int max = 100;
	
	private int minorTicks = 5;
	private int majorTicks = 5;
	
	private String label = "";

	public GaugeChart(Composite parent, int style) {
		super(parent, style, REMOTE_TYPE);
	}
	
	public void setGaugeValue(int gaugeValue) {
		checkWidget();
//		JsonObject jsonObject = new JsonObject();
//		jsonObject.add("value", value);
//		jsonObject.add("transitionDuration", 2f);
//		remoteObject.call("redraw", jsonObject );
//		System.out.println("Value23: "+value);
		this.gaugeValue = gaugeValue;
		remoteObject.set("gaugeValue", gaugeValue);
	}
	
	public int getGaugeValue() {
		checkWidget();
		return gaugeValue;
	}
	
	public void setLabel(String label) {
		checkWidget();
		this.label = label;
		remoteObject.set("label",label);
	}
	
	public String getLabel() {
		checkWidget();
		return label;
	}
	
	public void setMin(int value) {
		checkWidget();
		min=value;
		remoteObject.set("min", value);
	}
	
	public int getMin() {
		checkWidget();
		return min;
	}
	
	public void setMax(int value) {
		checkWidget();
		max=value;
		remoteObject.set("max", value);
	}
	
	public int getMax() {
		checkWidget();
		return max;
	}
	
	public void setMinorTicks(int value) {
		checkWidget();
		minorTicks = value;
		remoteObject.set("minorTicks", value);
	}
	
	public int getMinorTicks() {
		checkWidget();
		return minorTicks;
	}
	
	public void setMajorTicks(int value) {
		checkWidget();
		majorTicks = value;
		remoteObject.set("majorTicks", value);
	}
	
	public int getMajorTicks() {
		checkWidget();
		return majorTicks;
	}

}
