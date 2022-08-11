import { Component, OnInit } from '@angular/core';
import {MeasurementsService} from "../../core/measurements.service";
import {ControlService} from "../../core/control.service";
import {WeatherService} from "../../core/weather.service";

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css']
})
export class ControlComponent implements OnInit {

  forecast:any;

  constructor(public measurement: MeasurementsService,
              public control: ControlService,
              private weather:WeatherService) {  }

  ngOnInit(): void {
    this.control.countdown()
    //this.control.updatePrediction()
    this.measurement.getFrom()
    this.weather.getForecast().subscribe(response =>
    {
      this.forecast = response;
    })
    console.log(this.forecast.data)


  }


}
