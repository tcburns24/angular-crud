import { Component } from '@angular/core';
import { Athletes } from './athletes/athletes';
import { AthletesWithSportsComponent } from './athletes-with-sports/athletes-with-sports';
import { TeamsComponent } from './teams/teams';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HttpClientModule,
    Athletes,
    FormsModule,
    AthletesWithSportsComponent,
    TeamsComponent,
  ],
  template: `
    <app-athletes></app-athletes>
    <app-athletes-with-sports></app-athletes-with-sports>
    <app-teams></app-teams>
  `,
})
export class App {}
