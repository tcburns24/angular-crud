import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-employee-analytics',
  templateUrl: './employee-analytics.html',
  styleUrls: ['./employee-analytics.scss'],
  imports: [CommonModule, FormsModule, HttpClientModule],
})
export class EmployeeAnalyticsComponent implements OnInit {
  @Input() analytics: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http
      .get<any[]>('http://localhost:3000/api/employees/analytics')
      .subscribe((data) => {
        this.analytics = data;
      });
  }
}
