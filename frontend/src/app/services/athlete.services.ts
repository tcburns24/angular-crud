import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Athlete {
  athlete_id: number;
  first_name: string;
  last_name: string;
  class_year: string;
  gender: string;
  fall_sport_id?: number | null;
  winter_sport_id?: number | null;
  spring_sport_id?: number | null;
}

@Injectable({
  providedIn: 'root',
})
export class AthleteService {
  private apiUrl = environment.apiUrl;

  private athletesWithSportsSource = new BehaviorSubject<any[]>([]);

  athletesWithSports$ = this.athletesWithSportsSource.asObservable();

  constructor(private http: HttpClient) {}

  getAthletes(): Observable<Athlete[]> {
    return this.http.get<Athlete[]>(`${this.apiUrl}/athletes`);
  }

  getAthletesWithSports() {
    return this.http
      .get<any[]>(`${this.apiUrl}/athletes-with-sports`)
      .pipe(tap((data) => this.athletesWithSportsSource.next(data)));
  }

  addAthlete(athlete: Athlete): Observable<any> {
    return this.http.post(`${this.apiUrl}/athletes`, athlete);
  }

  updateAthlete(id: number, athlete: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/athletes/${id}`, athlete);
  }

  deleteAthlete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/athletes/${id}`);
  }
}
