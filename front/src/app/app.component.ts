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
      'ax': '2019-01-01',
      'ay': 56000,
      'data': '무슨 아파트: '
    },
    {
      'ax': '2019-01-02',
      'ay': 56000,
      'data': '무슨 아파트: '
    }, {
      'ax': '2019-01-03',
      'ay': 76000,
      'data': '무슨 아파트: '
    }, {
      'ax': '2019-01-04',
      'ay': 58000,
      'data': '무슨 아파트: '
    }, {
      'ax': '2019-01-05',
      'ay': 2.8,
      'data': '무슨 아파트: '
    }, {
      'ax': '2019-01-06',
      'ay': 3.5,
      'data': '무슨 아파트: '
    }, {
      'ax': '2019-01-07',
      'ay': 5.1,
      'data': '무슨 아파트: '
    }, {
      'ax': '2019-01-08',
      'ay': 6.7,
      'data': '무슨 아파트: '
    }, {
      'ax': '2019-01-09',
      'ay': 8,
      'data': '무슨 아파트: '
    }, {
      'ax': '2019-01-10',
      'ay': 8.9,
      'data': '무슨 아파트: '
    }];

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      this.chart = am4core.create('chartdiv', am4charts.XYChart);
      this.chart.data = this.chartData;
      this.createChart();
    });
  }


  private createChart() {
    this.chart.dateFormatter.inputDateFormat = 'yyyy-MM-dd';

    const dateAxisX = this.chart.xAxes.push(new am4charts.DateAxis());
    dateAxisX.title.text = '기간';
    dateAxisX.dateFormats.setKey('day', 'd일');
    dateAxisX.periodChangeDateFormats.setKey('day', 'YYYY년 MM월 dd일');
    dateAxisX.renderer.minGridDistance = 40;

    const valueAxisY = this.chart.yAxes.push(new am4charts.ValueAxis());
    valueAxisY.title.text = '가격';
    valueAxisY.title.rotation = 1;

    const lineSeries = this.chart.series.push(new am4charts.LineSeries());
    lineSeries.dataFields.valueY = 'ay';
    lineSeries.dataFields.dateX = 'ax';
    lineSeries.strokeOpacity = 0;

    const bullet = lineSeries.bullets.push(new am4charts.CircleBullet());
    bullet.tooltipText = 'Value: [bold]{data}[/]';
    const circle = bullet.createChild(am4core.Circle);
    circle.propertyFields.width = 'count';
    circle.horizontalCenter = 'middle';
    circle.verticalCenter = 'middle';
    circle.strokeWidth = 0;
    circle.fill = this.chart.colors.getIndex(0);
    circle.width = 12;
    circle.height = 12;

    this.chart.scrollbarX = new am4core.Scrollbar();
  }
}
