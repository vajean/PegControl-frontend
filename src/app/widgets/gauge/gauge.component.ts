import {Component, OnInit} from '@angular/core';
import {ThemePalette} from "@angular/material/core";
import {ProgressSpinnerMode} from "@angular/material/progress-spinner";
import {MeasurementsService} from "../../core/measurements.service";
import {ControlService} from "../../core/control.service";
import {Measurement} from "../../model/measurement";

@Component({
  selector: 'app-gauge',
  templateUrl: './gauge.component.html',
  styleUrls: ['./gauge.component.css']
})
export class GaugeComponent implements OnInit {
  colorTemp: ThemePalette = 'warn';
  colorHum: ThemePalette = 'accent';
  colorClothes: ThemePalette = 'primary';
  values: any;
  mode: ProgressSpinnerMode = 'determinate';



  constructor(private measurements: MeasurementsService,
              public control: ControlService) {
  }

  ngOnInit(): void {
    this.measurements.getOne()
    // @ts-ignore
    this.measurements.oneMeasurement.subscribe(
      (measure: Measurement[]) => {
        this.values = measure;
      })
  }

}
