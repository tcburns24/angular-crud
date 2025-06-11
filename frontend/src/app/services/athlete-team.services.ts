import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AthleteTeamService {
  private apiUrl = 'http://localhost:3000/api/athlete_teams';

  constructor(private http: HttpClient) {}

  getAthleteTeams(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getAthleteTeamById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  addAthleteTeam(athleteTeam: any): Observable<any> {
    return this.http.post(this.apiUrl, athleteTeam);
  }

  updateAthleteTeam(id: number, athleteTeam: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, athleteTeam);
  }

  deleteAthleteTeam(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
