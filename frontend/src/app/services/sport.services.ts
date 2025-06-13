import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Sport {
  sport_id: number;
  name: string;
  gender: string;
  season: string;
  academic_year: string;
}

@Injectable({
  providedIn: 'root',
})
export class SportService {
  private apiUrl = 'http://localhost:3000/api/sports';

  constructor(private http: HttpClient) {}

  getSports(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getSportById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  addSport(sport: any): Observable<any> {
    return this.http.post(this.apiUrl, sport);
  }

  updateSport(id: number, sport: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, sport);
  }

  deleteSport(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
