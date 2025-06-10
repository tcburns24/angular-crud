import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { EmployeeAnalyticsComponent } from '../employee-analytics/employee-analytics';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    EmployeeAnalyticsComponent,
  ],
  templateUrl: './user-form.html',
  styleUrls: ['./user-form.scss'],
})
export class UserFormComponent {
  employee = {
    name: '',
    email: '',
    hometown: '',
    luckynumber: null,
    department: '',
  };

  employees: any[] = [];

  analytics: any[] = [];

  selectedEmployee: any = null;

  selectedIds: number[] = [];

  isEditModalOpen: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getEmployees();
  }

  onCheckboxChange(event: any) {
    const id = +event.target.value;
    if (event.target.checked) {
      this.selectedIds.push(id);
    } else {
      this.selectedIds = this.selectedIds.filter(
        (selectedID) => selectedID !== id
      );
    }
  }

  getEmployees() {
    this.http
      .get<any[]>('http://localhost:3000/api/employees')
      .subscribe((data) => {
        this.employees = data;
      });
  }

  getAnalytics() {
    this.http
      .get<any[]>('http://localhost:3000/api/employees/analytics')
      .subscribe((data) => {
        this.analytics = data;
      });
  }

  deleteEmployee(id: number) {
    this.http
      .delete(`http://localhost:3000/api/employees/${id}`)
      .subscribe(() => {
        this.getEmployees();
        this.employees = this.employees.filter((e) => e.employeeId !== id);
      });
  }

  bulkDelete() {
    this.http
      .post('http://localhost:3000/api/employees/bulk-delete', {
        ids: this.selectedIds,
      })
      .subscribe({
        next: () => {
          this.getEmployees();
          this.employees = this.employees.filter(
            (e) => !this.selectedIds.includes(e.employeeId)
          );
          this.selectedIds = [];
        },
        error: (err) => console.error("Bulk delete don't work.", err),
      });
  }

  openEditModal(employee: any) {
    this.selectedEmployee = { ...employee };
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.selectedEmployee = null;
    this.isEditModalOpen = false;
  }

  submitEditForm() {
    const id = this.selectedEmployee.id;

    this.http
      .put(`http://localhost:3000/api/employees/${id}`, this.selectedEmployee)
      .subscribe({
        next: () => {
          this.getAnalytics();
          this.getEmployees();
          this.closeEditModal();
        },
        error: (err) => {
          console.error('Uh oh! 🚨 Update failed!', err);
        },
      });
  }

  submitForm() {
    this.http
      .post<any>('http://localhost:3000/api/employees', this.employee)
      .subscribe({
        next: (res) => {
          console.log('Submitted successfully:', res);

          const newlyCreatedEmployee = {
            id: res.employeeId,
            ...this.employee,
          };

          this.employees.push(newlyCreatedEmployee);

          this.getAnalytics();
          this.getEmployees();

          this.employee = {
            name: '',
            email: '',
            hometown: '',
            luckynumber: null,
            department: '',
          };
        },
        error: (err) => {
          console.error('Submission failed:', err);
        },
      });
  }
}
