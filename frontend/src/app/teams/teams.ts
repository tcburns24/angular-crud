import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeamService, Team } from '../services/team.services';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h3>Select a Team to View Roster</h3>
    <select [(ngModel)]="selectedTeamId" (change)="loadRoster()">
      <option *ngFor="let team of teams" [value]="team.team_id">
        {{ team.team_name }}
      </option>
    </select>

    <div *ngIf="roster.length">
      <h4>Roster:</h4>
      <ul>
        <li *ngFor="let athlete of roster">
          {{ athlete.first_name }} {{ athlete.last_name }} - #{{
            athlete.jersey_number
          }}
          ({{ athlete.position }})
          <span *ngIf="athlete.is_captain">👑 Captain</span>
        </li>
      </ul>
    </div>
  `,
})
export class TeamsComponent implements OnInit {
  teams: Team[] = [];
  roster: any[] = [];
  selectedTeamId: number | null = null;

  constructor(private teamService: TeamService) {}

  ngOnInit() {
    this.teamService.getTeams().subscribe((data) => {
      this.teams = data;
    });
  }

  loadRoster() {
    if (this.selectedTeamId !== null) {
      this.teamService.getTeamRoster(this.selectedTeamId).subscribe((data) => {
        this.roster = data;
      });
    }
  }
}
