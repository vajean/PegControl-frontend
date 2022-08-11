import {AfterViewInit, Component, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {MeasurementsService} from "../../core/measurements.service";
import {Chart, ChartConfiguration, ChartType} from "chart.js";
import {BaseChartDirective} from "ng2-charts";
import {Measurement} from "../../model/measurement";
import {ControlService} from "../../core/control.service";

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})

export class GraphComponent implements AfterViewInit {

  @ViewChild(BaseChartDirective) chart: any;

  ngAfterViewInit() {
    this.addData();
  }

  temp: number[] = [];
  hum: number[] = [];
  wet: number[] = [];
  labels: string[] = [];


  constructor(public measurements: MeasurementsService,
              public control: ControlService) {
  }

  removeData() {

    this.chart.chart.data.datasets.forEach((dataset:any) => {
      for (let i = 0; i < dataset.data.length; i++){
        dataset.data.pop();
        this.chart.chart.data.labels.pop();
      }

    });
    this.chart.chart.update()
  }


  addData() {
    // @ts-ignore
    this.measurements.lastDrying.subscribe(
      (measure: Measurement[]) => {
        // @ts-ignore
        let hum = measure.map(r => {
          this.hum.push(r['hum'])
          return r['hum']
        });
        let temp = measure.map(r => {
          this.temp.push(r['temp'])
          return r['temp']
        });
        let wet = measure.map(r => {
          this.wet.push(r['wet']/21)
          return r['wet']
        });


        let labels = measure.map(r => {
          let date = this.measurements.convertDate(r)
          this.labels.push(date.toLocaleTimeString())

          return r['time']

        });

      }
    );
    this.chart.chart.update()

  }


  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: this.wet,
        label: 'Fabric Moist(%)',
        yAxisID: 'y-axis-2',
        backgroundColor: 'rgba(14,101,244,0.39)',
        borderColor: 'rgba(14,101,244,0.60)',
        pointBackgroundColor: 'rgba(14,101,244,0.85)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
      },
      {
        data: this.hum,
        label: 'Air Humidity(%)',
        yAxisID: 'y-axis-0',
        backgroundColor: 'rgba(77,83,96,0.2)',
        borderColor: 'rgba(77,83,96,1)',
        pointBackgroundColor: 'rgba(77,83,96,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(77,83,96,1)',
        fill: 'origin',
      },
      {
        data: this.temp,
        label: 'Air Temperature',
        yAxisID: 'y-axis-1',
        backgroundColor: 'rgba(255,0,0,0.3)',
        borderColor: 'red',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
      }
    ],
    labels: this.labels
  };
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    elements: {
      line: {
        tension: 0.5
      }
    },
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      x: {},
      'y-axis-0':
        {
          position: 'left',
        },
      'y-axis-1': {
        position: 'right',
        grid: {
          color: 'rgba(255,0,0,0.3)',
        },
        ticks: {
          color: 'red'
        }
      }
    },

    plugins: {
      legend: {display: true},

    }
  };

  public lineChartType: ChartType = 'line'


}


