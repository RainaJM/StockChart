import {
    Component,
    OnInit,
    ViewEncapsulation,
    HostListener,
} from "@angular/core";
import * as d3 from "d3-selection";
import * as d3Scale from "d3-scale";
import * as d3Shape from "d3-shape";
import * as d3Axis from "d3-axis";
import * as d3Zoom from "d3-zoom";
import * as d3Brush from "d3-brush";
import * as d3Array from "d3-array";
import * as d3TimeFormat from "d3-time-format";

import { SP500 } from "../shared";

export interface Margin {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

interface Stock {
    date: Date;
    price: number;
}

@Component({
    selector: "app-o8-brush-zoom-linechart",
    encapsulation: ViewEncapsulation.None,
    templateUrl: "./o8-brush-zoom-linechart.component.html",
    styleUrls: ["./o8-brush-zoom-linechart.component.css"],
})
export class O8BrushZoomLinechartComponent implements OnInit {
    title = "Line Chart";

    public margin: Margin;
    public margin2: Margin;

    public width: number;
    public height: number;
    public height2: number;

    public svg: any; // TODO replace all `any` by the right type

    public x: any;
    public x2: any;
    public y: any;
    public y2: any;

    public xAxis: any;
    public xAxis2: any;
    public yAxis: any;

    public context: any;
    public brush: any;
    public zoom: any;
    public area: any;
    public area2: any;
    public focus: any;

    public line: any;
    public line2: any;
    public Line_chart: any;
    public trendLine: any;
    public isTrendClicked = false;
    public parseDate = d3TimeFormat.timeParse("%b %Y");

    constructor() {}

    ngOnInit() {
        this.initMargins();
        this.initSvg();
        this.drawChart(this.parseData(SP500));
    }

    private initMargins() {
        this.margin = { top: 20, right: 20, bottom: 110, left: 40 };
        this.margin2 = { top: 430, right: 20, bottom: 30, left: 40 };
    }

    private parseData(data: any[]): Stock[] {
        return data.map(
            (v) => <Stock>{ date: this.parseDate(v.date), price: v.price }
        );
    }

    private initSvg() {
        this.svg = d3.select("svg");

        this.width =
            +this.svg.attr("width") - this.margin.left - this.margin.right;
        this.height =
            +this.svg.attr("height") - this.margin.top - this.margin.bottom;
        this.height2 =
            +this.svg.attr("height") - this.margin2.top - this.margin2.bottom;

        this.x = d3Scale.scaleTime().range([0, this.width]);
        this.x2 = d3Scale.scaleTime().range([0, this.width]);
        this.y = d3Scale.scaleLinear().range([this.height, 0]);
        this.y2 = d3Scale.scaleLinear().range([this.height2, 0]);

        this.xAxis = d3Axis.axisBottom(this.x);
        this.xAxis2 = d3Axis.axisBottom(this.x2);
        this.yAxis = d3Axis.axisLeft(this.y);

        this.brush = d3Brush
            .brushX()
            .extent([
                [0, 0],
                [this.width, this.height2],
            ])
            .on("brush end", this.brushed.bind(this));

        this.zoom = d3Zoom
            .zoom()
            .scaleExtent([1, Infinity])
            .translateExtent([
                [0, 0],
                [this.width, this.height],
            ])
            .extent([
                [0, 0],
                [this.width, this.height],
            ])
            .on("zoom", this.zoomed.bind(this));

        this.line = d3Shape
            .line()
            .x((d: any) => this.x(d.date))
            .y((d: any) => this.y(d.price));

        this.line2 = d3Shape
            .line()
            .x((d: any) => this.x2(d.date))
            .y((d: any) => this.y2(d.price));

        this.svg
            .append("defs")
            .append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", this.width)
            .attr("height", this.height)
            .attr("x", 0)
            .attr("y", 0);

        this.Line_chart = this.svg
            .append("g")
            .attr("class", "focus")
            .attr(
                "transform",
                "translate(" + this.margin.left + "," + this.margin.top + ")"
            )
            .attr("clip-path", "url(#clip)");

        this.focus = this.svg
            .append("g")
            .attr("class", "focus")
            .attr(
                "transform",
                "translate(" + this.margin.left + "," + this.margin.top + ")"
            );

        this.context = this.svg
            .append("g")
            .attr("class", "context")
            .attr(
                "transform",
                "translate(" + this.margin2.left + "," + this.margin2.top + ")"
            );
    }

    private brushed() {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom")
            return; // ignore brush-by-zoom
        let s = d3.event.selection || this.x2.range();
        this.x.domain(s.map(this.x2.invert, this.x2));
        this.Line_chart.select(".line").attr("d", this.line);
        this.focus.select(".axis--x").call(this.xAxis);
        this.svg
            .select(".zoom")
            .call(
                this.zoom.transform,
                d3Zoom.zoomIdentity
                    .scale(this.width / (s[1] - s[0]))
                    .translate(-s[0], 0)
            );
    }

    private zoomed() {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush")
            return; // ignore zoom-by-brush
        let t = d3.event.transform;
        this.x.domain(t.rescaleX(this.x2).domain());
        this.Line_chart.select(".line").attr("d", this.line);
        this.focus.select(".axis--x").call(this.xAxis);
        this.context
            .select(".brush")
            .call(this.brush.move, this.x.range().map(t.invertX, t));
    }

    private drawChart(data: Stock[]) {
        this.x.domain(d3Array.extent(data, (d: Stock) => d.date));
        this.y.domain([0, d3Array.max(data, (d: Stock) => d.price)]);
        this.x2.domain(this.x.domain());
        this.y2.domain(this.y.domain());

        this.focus
            .append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + this.height + ")")
            .call(this.xAxis);

        this.focus.append("g").attr("class", "axis axis--y").call(this.yAxis);

        this.Line_chart.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", this.line);

        this.context
            .append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", this.line2);

        this.context
            .append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + this.height2 + ")")
            .call(this.xAxis2);

        this.context
            .append("g")
            .attr("class", "brush")
            .call(this.brush)
            .call(this.brush.move, this.x.range());

        this.svg
            .append("rect")
            .attr("class", "zoom")
            .attr("width", this.width)
            .attr("height", this.height)
            .attr(
                "transform",
                "translate(" + this.margin.left + "," + this.margin.top + ")"
            )
            .call(this.zoom);
    }
    drawVLine() {
        var data = this.parseData(SP500);
        var h = this.height;
        var mouseG1 = this.svg.append("g").attr("class", "mouse-over-effects1");

        mouseG1
            .append("path") // this is the black vertical line to follow mouse
            .attr("class", "mouse-line1")
            .style("stroke", "steelblue")
            .style("stroke-width", "1px")
            .style("opacity", "0")
            .attr(
                "transform",
                "translate(" + this.margin.left + "," + this.margin.top + ")"
            );
        // var lines = document.getElementsByClassName('line');

        var mousePerLine = mouseG1
            .selectAll(".mouse-per-line1")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "mouse-per-line1")
            .attr(
                "transform",
                "translate(" + this.margin.left + "," + this.margin.top + ")"
            );
        mouseG1
            .append("svg:rect") // append a rect to catch mouse movements on canvas
            .attr("width", this.width) // can't catch mouse events on a g element
            .attr("height", this.height)
            .attr("fill", "none")
            .attr("pointer-events", "all")
            .attr(
                "transform",
                "translate(" + this.margin.left + "," + this.margin.top + ")"
            )
            .on("click", function () {
                d3.select(".mouse-line1").style("opacity", "1");

                // mouse moving over canvas
                var mouse = d3.mouse(this);
                console.log(mouse);

                d3.select(".mouse-line1").attr("d", function () {
                    var d = "M" + mouse[0] + "," + h;
                    d += " " + mouse[0] + "," + 0;
                    return d;
                });
            });
    }
    drawHLine() {
        console.log("hh");
        var mouseG = this.svg.append("g").attr("class", "mouse-over-effects");
        var data = this.parseData(SP500);
        var width = this.width;
        mouseG
            .append("path") // this is the black vertical line to follow mouse
            .attr("class", "mouse-line")
            .style("stroke", "steelblue")
            .style("stroke-width", "1px")
            .style("opacity", "0")
            .attr(
                "transform",
                "translate(" + this.margin.left + "," + this.margin.top + ")"
            );

        var mousePerLine = mouseG
            .selectAll(".mouse-per-line")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "mouse-per-line")
            .attr(
                "transform",
                "translate(" + this.margin.left + "," + this.margin.top + ")"
            );
        mouseG
            .append("svg:rect") // append a rect to catch mouse movements on canvas
            .attr("width", this.width) // can't catch mouse events on a g element
            .attr("height", this.height)
            .attr("fill", "none")
            .attr("pointer-events", "all")
            .attr(
                "transform",
                "translate(" + this.margin.left + "," + this.margin.top + ")"
            )
            .on("click", function () {
                d3.select(".mouse-line").style("opacity", "1");

                // mouse moving over canvas
                var mouse = d3.mouse(this);

                d3.select(".mouse-line").attr("d", function () {
                    var d = "M" + 0 + "," + mouse[1];
                    d += " " + width + "," + mouse[1];
                    return d;
                });
            });
    }

    drawTLine() {
        let line;
        let vis = this.svg.on("click", mousedown).on("dblclick", mouseup);

        function mousedown() {
            let m = d3.mouse(this);
            line = vis
                .append("line")
                .attr("x1", m[0])
                .attr("y1", m[1])
                .attr("x2", m[0])
                .attr("y2", m[1]);
            vis.on("mousemove", mousemove);
        }

        function mousemove() {
            let m = d3.mouse(this);
            line.attr("x2", m[0]).attr("y2", m[1]);
        }

        function mouseup() {
            vis.on("mousemove", null);
        }
    }
}
