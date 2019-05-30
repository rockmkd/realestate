import {AfterViewInit, Component, NgZone} from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  title = 'front';

  constructor(private zone: NgZone) {
  }

  private chart: am4charts.XYChart;

  private chartData = [
    {
      'date': '2015-01-01',
      'ay': 6.5,
      'by': 2.2,
      'aValue': 15,
      'bValue': 10
    }, {
      'date': '2015-01-02',
      'ay': 12.3,
      'by': 4.9,
      'aValue': 8,
      'bValue': 3
    }, {
      'date': '2015-01-03',
      'ay': 12.3,
      'by': 5.1,
      'aValue': 16,
      'bValue': 4
    }, {
      'date': '2015-01-04',
      'ay': 2.8,
      'by': 13.3,
      'aValue': 9,
      'bValue': 13
    }, {
      'date': '2015-01-05',
      'ay': 3.5,
      'by': 6.1,
      'aValue': 5,
      'bValue': 2
    }, {
      'date': '2015-01-06',
      'ay': 5.1,
      'by': 8.3,
      'aValue': 10,
      'bValue': 17
    }, {
      'date': '2015-01-07',
      'ay': 6.7,
      'by': 10.5,
      'aValue': 3,
      'bValue': 10
    }, {
      'date': '2015-01-08',
      'ay': 8,
      'by': 12.3,
      'aValue': 5,
      'bValue': 13
    }, {
      'date': '2015-01-09',
      'ay': 8.9,
      'by': 4.5,
      'aValue': 8,
      'bValue': 11
    }, {
      'date': '2015-01-10',
      'ay': 9.7,
      'by': 15,
      'aValue': 15,
      'bValue': 10
    }, {
      'date': '2015-01-11',
      'ay': 10.4,
      'by': 10.8,
      'aValue': 1,
      'bValue': 11
    }, {
      'date': '2015-01-12',
      'ay': 1.7,
      'by': 19,
      'aValue': 12,
      'bValue': 3
    }
  ];

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      const chart = am4core.create('chartdiv', am4charts.XYChart);
      this.chart = chart;
      this.chart.data = this.chartData;
      this.createChart();
    });
  }

  private createChart() {
    // Create axes
    const xAxis = this.chart.xAxes.push(new am4charts.DateAxis());
    // xAxis.dataFields.category = 'category';
    xAxis.renderer.grid.template.location = 0;

    // xAxis.renderer.minGridDistance = 30;

    const yAxis = this.chart.yAxes.push(new am4charts.ValueAxis());

    // Create series
    const series1 = this.chart.series.push(new am4charts.LineSeries());
    series1.dataFields.valueY = 'ay';
    series1.dataFields.dateX = 'date';
    series1.dataFields.value = 'aValue';
    series1.strokeOpacity = 0;
    series1.cursorTooltipEnabled = false;

    const bullet1 = series1.bullets.push(new am4charts.CircleBullet());
    bullet1.tooltipText = 'x:{valueX} y:{valueY}';
    series1.heatRules.push({
      target: bullet1.circle,
      min: 10,
      max: 60,
      property: 'radius'
    });

    const series2 = this.chart.series.push(new am4charts.LineSeries());
    series2.dataFields.valueY = 'by';
    series2.dataFields.dateX = 'date';
    series2.dataFields.value = 'bValue';
    series2.strokeOpacity = 0;
    series2.cursorTooltipEnabled = false;

    const bullet2 = series2.bullets.push(new am4charts.Bullet());
    bullet2.tooltipText = 'x:{valueX} y:{valueY}';

    const rectangle2 = bullet2.createChild(am4core.Rectangle);
    rectangle2.verticalCenter = 'middle';
    rectangle2.horizontalCenter = 'middle';
    rectangle2.width = 10;
    rectangle2.height = 10;
    rectangle2.rotation = 45;
    rectangle2.stroke = am4core.color('#fff');
    rectangle2.strokeWidth = 1;
    rectangle2.nonScalingStroke = true;
    series2.heatRules.push({
      target: rectangle2,
      min: 1,
      max: 6,
      property: 'scale'
    });

// Add scrollbars
    this.chart.scrollbarX = new am4core.Scrollbar();
    this.chart.scrollbarY = new am4core.Scrollbar();

// Add cursor
    this.chart.cursor = new am4charts.XYCursor();
    this.chart.cursor.behavior = 'zoomXY';

  }
}
