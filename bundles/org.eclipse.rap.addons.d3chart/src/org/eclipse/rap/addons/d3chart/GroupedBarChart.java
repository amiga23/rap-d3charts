/*******************************************************************************
 * Copyright (c) 2013 EclipseSource and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *    Ralf Sternberg - initial API and implementation
 ******************************************************************************/
package org.eclipse.rap.addons.d3chart;

import org.eclipse.rap.json.JsonArray;
import org.eclipse.rap.json.JsonObject;
import org.eclipse.rap.json.JsonValue;
import org.eclipse.swt.widgets.Composite;

public class GroupedBarChart extends Chart {

	private static final long serialVersionUID = 5125514639215833236L;

	private static final String REMOTE_TYPE = "d3chart.GroupedBarChart";

	private String[] colors;
	private String description;
	private JsonArray values;
	private int tooltipBoxWidth;
	private int tooltipBoxHeight;
	private int tooltipPadding;
	private int legendSpacing;
	private String fontAttribute; 
	private int yAxisLabelWidth;
	private int paddingRight;

	public GroupedBarChart(Composite parent, int style) {
		super(parent, style, REMOTE_TYPE);
	}

	public String[] getColors() {
		checkWidget();
		return colors;
	}

	/**
	 * Sets an Array of Strings. The Array can be of any size. Each String
	 * describes a color of one bar. The Strings can be named or defined using
	 * the color values (HEX), e.g. String[] colors = {"#141b4d", "#ffb81c",
	 * "#97999b", "green", "lightblue"}
	 * 
	 * @param colors
	 */
	public void setColors(String[] colors) {
		checkWidget();
		this.colors = colors;
		remoteObject.set("colors", jsonArray(colors));
	}

	public String getDescription() {
		checkWidget();
		return description;
	}

	/**
	 * Sets the description for the vertical axis. 
	 * @param description
	 */
	public void setDescription(String description) {
		checkWidget();
		this.description = description;
		remoteObject.set("description", this.description);
	}

	/**
	 * Sets the values for the Chart. The values are supposed to be organized 
	 * within a JsonArray. One element called "Key" is required. <br>
	 *  <br>
	 * JsonObject firstElement = new JsonObject();<br>
	 * firstElement.add("Key", "NY");<br>
	 * firstElement.add("Under 5 Years", 270);<br>
	 * firstElement.add("5 to 13 Years", 180);<br>
	 * firstElement.add("14 to 17 Years", 300);<br>
	 * <br>
	 * JsonObject secondElement = new JsonObject();<br>
	 * secondElement.add("Key", "CA");<br>
	 * secondElement.add("Under 5 Years", 100);<br>
	 * secondElement.add("5 to 13 Years", 150);<br>
	 * secondElement.add("14 to 17 Years", 180;<br>
	 * <br>
	 * JsonArray jsonArray = new JsonArray();<br>
	 * jsonArray.add(firstElement);<br>
	 * jsonArray.add(secondElement);<br>
	 * 
	 * @param values
	 */
	public void setValues(JsonArray values) {
		checkWidget();
		this.values = values;
		remoteObject.set("values", values);
	}
	
	public JsonArray getValues() {
		checkWidget();
		return values;
	}

	/**
	 * Optional. 
	 * Sets a width for the tooltip box (in px). Should be used to adjust
	 * to a new text size. Default is 75. 
	 * @param tooltipBoxWidth
	 */
	public void setTooltipBoxWidth(int tooltipBoxWidth) {
		checkWidget();
		this.tooltipBoxWidth = tooltipBoxWidth;
		remoteObject.set("tooltipBoxWidth", tooltipBoxWidth);
	}

	public int getTooltipBoxWidth() {
		checkWidget();
		return tooltipBoxWidth;
	}

	/** Optional. 
	 * Sets a height for the tooltip box (in px). Should be used to adjust
	 * to a new text size. Default is 20. 
	 * @param tooltipBoxHeight
	 */
	public void setTooltipBoxHeight(int tooltipBoxHeight) {
		checkWidget();
		this.tooltipBoxHeight = tooltipBoxHeight;
		remoteObject.set("tooltipBoxHeight", tooltipBoxHeight);
	}
	
	public int getTooltipBoxHeight() {
		checkWidget();
		return tooltipBoxHeight;
	}
	
	/**
	 * Optional. 
	 * Sets a padding for the tooltip (in px). The padding describes the 
	 * space between the tooltip box and the bar i.e. the points's length. 
	 * Default is 5.
	 * @param tooltipPadding
	 */
	public void setTooltipPadding(int tooltipPadding) {
		checkWidget();
		this.tooltipPadding = tooltipPadding;
		remoteObject.set("tooltipPadding", tooltipPadding);
	}

	public int getTooltipPadding() {
		checkWidget();
		return tooltipPadding;
	}

	/** Optional. 
	 * Sets a vertical padding that describes the space from one colored
	 * box to the next colored box. 
	 * Default is 60.
	 * @param legendSpacing
	 */
	public void setLegendSpacing(int legendSpacing) {
		checkWidget();
		this.legendSpacing = legendSpacing;
		remoteObject.set("legendSpacing", legendSpacing);
	}

	public int getLegendSpacing() {
		checkWidget();
		return legendSpacing;
	}
	
	/**
	 * Optional. 
	 * Sets the font style. Default is "12px sans-serif. 
	 * @param fontAttribute
	 */
	public void setFontAttribute(String fontAttribute) {
		checkWidget();
		this.fontAttribute = fontAttribute;
		remoteObject.set("font", fontAttribute);
	}

	public String getFontAttribute() {
		checkWidget();
		return fontAttribute;
	}

	/**
	 * Optional. 
	 * Sets the Width of the Y-axis label in order to adapt to the font size. 
	 * @param yAxisLabelWidth
	 */
	public void setyAxisLabelWidth(int yAxisLabelWidth) {
		checkWidget();
		this.yAxisLabelWidth = yAxisLabelWidth;
		remoteObject.set("yAxisLabelWidth", yAxisLabelWidth);
	}
	
	public int getyAxisLabelWidth() {
		checkWidget();
		return yAxisLabelWidth;
	}

	/**
	 * Optional. 
	 * Sets the padding to the right of the chart. 
	 * Default is 20. 
	 * @param paddingRight
	 */
	public void setPaddingRight(int paddingRight) {
		checkWidget();
		this.paddingRight = paddingRight;
		remoteObject.set("paddingRight", paddingRight);
	}

	public int getPaddingRight() {
		checkWidget();
		return paddingRight;
	}

	/**
	 * Transforms an Array of Strings to a JsonArray.
	 * 
	 * @param array
	 * @return jsonArray
	 */
	private JsonArray jsonArray(String[] array) {
		JsonArray jsonArray = new JsonArray();
		for (String value : array) {
			jsonArray.add(value);
		}
		return jsonArray;
	}

}
