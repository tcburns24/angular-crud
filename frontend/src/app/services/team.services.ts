import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Team {
  team_id: number;
  team_name: string;
}

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  private apiUrl = 'http://localhost:3000/api/teams';

  constructor(private http: HttpClient) {}

  getTeams(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getTeamRoster(teamId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${teamId}/roster`);
  }

  getTeamById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  addTeam(team: any): Observable<any> {
    return this.http.post(this.apiUrl, team);
  }

  updateTeam(id: number, team: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, team);
  }

  deleteTeam(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
