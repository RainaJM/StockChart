import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { MatMenuModule, MatSidenavModule } from "@angular/material";

import { AppComponent } from "./app.component";
import { LineChartComponent } from "./01_line_chart/line-chart.component";
import { MultiSeriesComponent } from "./02_multi_series_line_chart/multi-series.component";
import { BarChartComponent } from "./03_bar_chart/bar-chart.component";
import { StackedBarChartComponent } from "./04_stacked_bar_chart/stacked-bar-chart.component";
import { BrushZoomComponent } from "./05_brush_zoom/brush-zoom.component";
import { PieChartComponent } from "./06_pie_chart/pie-chart.component";
import { DonutChartComponent } from "./07_donut_chart/donut-chart.component";
import { O8BrushZoomLinechartComponent } from "./o8-brush-zoom-linechart/o8-brush-zoom-linechart.component";
import { CandlestickComponent } from "./candlestick/candlestick.component";
const appRoutes: Routes = [
    // { path: "line-chart", component: LineChartComponent },
    // { path: "multi-series", component: MultiSeriesComponent },
    // { path: "bar-chart", component: BarChartComponent },
    // { path: "stacked-bar-chart", component: StackedBarChartComponent },
    // { path: "brush-zoom", component: BrushZoomComponent },
    // { path: "pie-chart", component: PieChartComponent },
    // { path: "donut-chart", component: DonutChartComponent },
    { path: "line-chart-zoom", component: O8BrushZoomLinechartComponent },
    { path: "candle-stick", component: CandlestickComponent },
    { path: "", redirectTo: "/line-chart-zoom", pathMatch: "full" },
    { path: "**", component: LineChartComponent },
];

@NgModule({
    declarations: [
        AppComponent,
        LineChartComponent,
        MultiSeriesComponent,
        BarChartComponent,
        StackedBarChartComponent,
        BrushZoomComponent,
        PieChartComponent,
        DonutChartComponent,
        O8BrushZoomLinechartComponent,
        CandlestickComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes),
        MatMenuModule,
        MatSidenavModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
