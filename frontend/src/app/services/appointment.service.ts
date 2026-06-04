import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private apiUrl =
    'http://localhost:5000/api/appointments';

  constructor(
    private http: HttpClient
  ) {}

  createAppointment(
    appointment: any
  ): Observable<any> {

    return this.http.post(
      this.apiUrl,
      appointment
    );

  }

  getAppointments(): Observable<any> {

    return this.http.get(
      this.apiUrl
    );

  }

  deleteAppointment(
    id: string
  ): Observable<any> {

    return this.http.delete(
      `${this.apiUrl}/${id}`
    );

  }

}