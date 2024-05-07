import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReporterService {

  constructor() { }
  public page: BehaviorSubject<any> = new BehaviorSubject(null);
}
