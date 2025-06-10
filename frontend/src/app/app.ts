import { Component } from '@angular/core';
import { UserFormComponent } from './user-form/user-form';
import { EmployeeAnalyticsComponent } from './employee-analytics/employee-analytics';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [UserFormComponent],
  template: `<app-user-form />`,
})
export class App {}
