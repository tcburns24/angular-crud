import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AthleteService } from '../services/athlete.services';

@Component({
  selector: 'app-athletes-with-sports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h3>Athletes with Sports</h3>
    <table>
      <tbody>
        <tr>
          <th>Name</th>
          <th>Fall Sport</th>
          <th>Winter Sport</th>
          <th>Spring Sport</th>
        </tr>
        <tr *ngFor="let athlete of athletesWithSports">
          <td>{{ athlete.first_name }} {{ athlete.last_name }}</td>
          <td>{{ athlete.fall_sport || '--' }}</td>
          <td>{{ athlete.winter_sport || '--' }}</td>
          <td>{{ athlete.spring_sport || '--' }}</td>
        </tr>
      </tbody>
    </table>
  `,
})
export class AthletesWithSportsComponent implements OnInit {
  athletesWithSports: any[] = [];

  constructor(private athleteService: AthleteService) {}

  ngOnInit() {
    this.athleteService.getAthletesWithSports().subscribe((data) => {
      this.athletesWithSports = data;
    });
  }
}
