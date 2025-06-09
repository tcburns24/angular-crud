import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-employee-analytics',
  templateUrl: './employee-analytics.html',
  styleUrl: './employee-analytics.scss',
})
export class EmployeeAnalytics implements OnInit {
  analytics: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http
      .get<any[]>('http://localhost:3000/api/employees/analytics')
      .subscribe((data) => {
        this.analytics = data;
      });
  }
}
