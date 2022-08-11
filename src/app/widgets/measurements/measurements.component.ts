import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {MeasurementsService} from "../../core/measurements.service";
import {ControlService} from "../../core/control.service";
import {Measurement} from "../../model/measurement";

@Component({
  selector: 'app-measurements',
  templateUrl: './measurements.component.html',
  styleUrls: ['./measurements.component.css']
})
export class MeasurementsComponent implements OnInit {

  meas: Measurement[] = []

  constructor(public measurements: MeasurementsService,
              public control: ControlService) {

  }

  ngOnInit(): void {
      // @ts-ignore
      this.measurements.lastDrying.subscribe(
        (measure: Measurement[]) => {
          this.meas = measure;
        })
    }


}
