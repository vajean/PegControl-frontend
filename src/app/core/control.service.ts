import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {MeasurementsService} from "./measurements.service";
import {Measurement} from "../model/measurement";
import {timestamp} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ControlService {
  // @ts-ignore
  intervalID: NodeJS.Timer;
  // @ts-ignore
  updateID: NodeJS.Timer;
  start: number = NaN
  stop: number = NaN
  status: string = 'Waiting'
  timeLeft: any = new Date();
  controlMessage: string = ''
  fabric: string = 'cotton'
  values: any;
  lastMeasurement: any = NaN

  control = this.firestore.collection("control").doc('vajean').ref.get()
    .then(snapshot => {
      // @ts-ignore
      this.start = snapshot.data().start
      // @ts-ignore
      this.stop = snapshot.data().stop
      // @ts-ignore
      this.status = snapshot.data().status
      // @ts-ignore
      this.controlMessage = snapshot.data().controlMessage
      // @ts-ignore
      this.fabric = snapshot.data().fabric
      // @ts-ignore
      this.timeLeft = snapshot.data().timeLeft
      // @ts-ignore
      this.lastMeasurement = snapshot.data().lastMeasurement
    });


  constructor(private firestore: AngularFirestore,
              private measurements: MeasurementsService) {

  }

  calculateTimeLeft() {
    console.log("tick")
    this.measurements.getOne()
    // @ts-ignore
    this.measurements.oneMeasurement.subscribe(
      (measure: Measurement[]) => {
        this.values = measure;
      })


   if (this.lastMeasurement != this.values[0].time){
      console.log("Update")
      this.lastMeasurement = this.values[0].time
      const current = new Date();
      const numberLeft = this.values[0].wet / (Math.min(this.values[0].temp / 7, 3) + Math.min((101 - this.values[0].hum) / 10, 3))

      current.setHours(Math.floor(numberLeft / 60))
      current.setMinutes(numberLeft % 60)
      current.setSeconds(0)
      // @ts-ignore
      this.timeLeft = current.getTime();
    }


  }

  startProgram() {

    this.start = Math.floor(Date.now() / 1000)
    this.status = 'Drying'
    this.updatePrediction()
    this.controlMessage = 'Enjoy Life!'
    this.setSettings()



  }

  stopProgram() {
    this.stop = Math.floor(Date.now() / 1000)
    this.status = 'Stopped'
    this.controlMessage = 'You stopped the program'
    this.setSettings()

  }

  resetProgram() {
    clearInterval(this.updateID)
    this.stop = NaN
    this.start = NaN
    this.lastMeasurement = NaN
    this.status = 'Waiting'
    this.controlMessage = ''
    this.timeLeft = NaN
    this.setSettings()
  }

  resumeProgram() {
    this.stop = NaN
    this.status = 'Drying'
    this.controlMessage = 'Enjoy Life'
    this.setSettings()
  }

  setSettings() {
    this.firestore.collection("control").doc('vajean').set({
      start: this.start,
      stop: this.stop,
      status: this.status,
      controlMessage: this.controlMessage,
      fabric: this.fabric,
      timeLeft: this.timeLeft,
      lastMeasurement: this.lastMeasurement
    })
  }

  countdown() {
    this.intervalID = setInterval(() => {
      this.timeLeft = this.timeLeft - 1000
      this.setSettings()
    }, 1000)

  }

  updatePrediction() {
    this.updateID = setInterval(() => {
      this.calculateTimeLeft()
      this.setSettings()
    }, 5000)
  }
}
