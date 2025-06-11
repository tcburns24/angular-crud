import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Athlete {
  athlete_id?: number;
  first_name: string;
  last_name: string;
  class_year: 'freshman' | 'sophomore' | 'junior' | 'senior';
  gender: 'M' | 'F';
}

@Injectable({
  providedIn: 'root',
})
export class AthleteService {
  private apiUrl = 'http://localhost:3000/api/athletes';

  constructor(private http: HttpClient) {}

  getAthletes(): Observable<Athlete[]> {
    return this.http.get<Athlete[]>(this.apiUrl);
  }

  addAthlete(athlete: Athlete): Observable<any> {
    return this.http.post(this.apiUrl, athlete);
  }

  updateAthlete(id: number, athlete: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, athlete);
  }

  deleteAthlete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
