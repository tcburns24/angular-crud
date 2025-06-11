import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AthleteService, Athlete } from '../services/athlete.services';

/* "Component Decorator" --> */ @Component({
  selector: 'app-athletes',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './athletes.html',
  styleUrls: ['./athletes.scss'],
})
export class Athletes implements OnInit {
  athletes: any[] = [];
  showModal: boolean = false;

  newAthlete: Athlete = {
    first_name: '',
    last_name: '',
    class_year: 'freshman',
    gender: 'M',
  };

  constructor(private athleteService: AthleteService) {}

  ngOnInit(): void {
    this.loadAthletes();
  }

  loadAthletes(): void {
    this.athleteService.getAthletes().subscribe((data) => {
      this.athletes = data;
    });
  }

  addAthlete(): void {
    this.athleteService.addAthlete(this.newAthlete).subscribe((data) => {
      this.loadAthletes();
      this.closeModal();
    });
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }
}
