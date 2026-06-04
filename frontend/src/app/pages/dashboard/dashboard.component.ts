import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../services/appointment.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  appointments: any[] = [];

  totalAppointments = 0;
  todaysAppointments = 0;
  upcomingAppointments = 0;

  customerName = '';
  phoneNumber = '';
  appointmentTime = '';

  constructor(
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {

    this.appointmentService
      .getAppointments()
      .subscribe((data: any) => {

        this.appointments = data;

        this.totalAppointments = data.length;

        const today = new Date();

        this.todaysAppointments =
          data.filter((appointment: any) => {

            const date =
              new Date(
                appointment.appointmentTime
              );

            return (
              date.getDate() === today.getDate() &&
              date.getMonth() === today.getMonth() &&
              date.getFullYear() === today.getFullYear()
            );

          }).length;

        this.upcomingAppointments =
          data.filter((appointment: any) => {

            return (
              new Date(
                appointment.appointmentTime
              ) > new Date()
            );

          }).length;

      });

  }

  scheduleAppointment(): void {

    const appointment = {
      customerName: this.customerName,
      phoneNumber: this.phoneNumber,
      appointmentTime: this.appointmentTime
    };

    this.appointmentService
      .createAppointment(appointment)
      .subscribe({

        next: () => {

          this.customerName = '';
          this.phoneNumber = '';
          this.appointmentTime = '';

          this.loadAppointments();

        },

        error: (error) => {

          console.error(error);

        }

      });

  }

  deleteAppointment(
    id: string
  ): void {

    const confirmDelete =
      confirm(
        'Delete this appointment?'
      );

    if (!confirmDelete) return;

    this.appointmentService
      .deleteAppointment(id)
      .subscribe(() => {

        this.loadAppointments();

      });

  }

  formatAppointmentTime(
    dateString: string
  ): string {

    return new Date(dateString)
      .toLocaleString(
        'en-IN',
        {
          timeZone: 'Asia/Kolkata',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }
      );

  }

}