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
  isEditMode: boolean = false;

  currentEditId: number | null = null;

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

  updateAthlete(id: number, updatedAthlete: Athlete): void {
    this.athleteService.updateAthlete(id, updatedAthlete).subscribe(() => {
      this.loadAthletes();
    });
  }

  deleteAthlete(id: number): void {
    console.log('🍀 deleteAthlete | id = ', id);
    this.athleteService.deleteAthlete(id).subscribe(() => {
      this.loadAthletes();
    });
  }

  openAddAthleteModal(): void {
    this.isEditMode = false;
    this.newAthlete = {
      first_name: '',
      last_name: '',
      class_year: 'freshman',
      gender: 'M',
    };
    this.showModal = true;
  }

  openEditAthleteModal(athlete: Athlete): void {
    this.isEditMode = true;
    this.newAthlete = { ...athlete };
    this.currentEditId = athlete.athlete_id!;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  submitForm() {
    if (this.isEditMode && this.currentEditId !== null) {
      this.updateAthlete(this.currentEditId, this.newAthlete);
    } else {
      this.addAthlete();
    }
    this.showModal = false;
  }
}
