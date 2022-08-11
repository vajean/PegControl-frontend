import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Measurement} from "../model/measurement";
import {where} from "@angular/fire/firestore";
import {Observable} from "rxjs";
import {ControlService} from "./control.service";
import {waitForAsync} from "@angular/core/testing";

@Injectable({
  providedIn: 'root'
})
export class MeasurementsService {
  constructor(private store: AngularFirestore) {
  }

  lastDrying: Observable<Measurement[]> | undefined;
  oneMeasurement: Observable<Measurement[]> | undefined;
  data: Measurement[] = [];
  latest: number[] = [0,0,0]

  getFrom() {

    this.lastDrying = this.store.collection('messages', ref => ref.orderBy('time', 'desc').limit(20)).valueChanges() as Observable<Measurement[]>;

  }

  getOne() {

    this.oneMeasurement = this.store.collection('messages', ref => ref.orderBy('time', 'desc').limit( 1)).valueChanges() as Observable<Measurement[]>;

  }

  convertDate(item: any) {
    return new Date(item.time * 1000);
  }

  delete(id: string) {
    this.store.collection('messages').doc(id).delete();
  }

}
