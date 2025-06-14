import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AthleteService, Athlete } from '../services/athlete.services';
import { SportService, Sport } from '../services/sport.services';

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
  selectedGender: string = 'M';
  allSports: Sport[] = [];
  sports: Record<string, Record<string, Sport[]>> = {
    M: {
      Fall: [],
      Winter: [],
      Spring: [],
    },
    F: {
      Fall: [],
      Winter: [],
      Spring: [],
    },
  };

  newAthlete: Athlete = {
    first_name: '',
    last_name: '',
    class_year: 'freshman',
    gender: this.selectedGender,
    fall_sport_id: null,
    winter_sport_id: null,
    spring_sport_id: null,
  };

  constructor(
    private athleteService: AthleteService,
    private sportService: SportService
  ) {}

  ngOnInit(): void {
    this.loadAthletes();
    this.loadAllSports();
  }

  loadAllSports(): void {
    this.sportService.getSports().subscribe((allSports: Sport[]) => {
      this.allSports = allSports;
      this.sports['M']['Fall'] = allSports.filter(
        (sport) => sport.gender === 'M' && sport.season === 'Fall'
      );
      this.sports['M']['Winter'] = allSports.filter(
        (sport) => sport.gender === 'M' && sport.season === 'Winter'
      );
      this.sports['M']['Spring'] = allSports.filter(
        (sport) => sport.gender === 'M' && sport.season === 'Spring'
      );
      this.sports['F']['Fall'] = allSports.filter(
        (sport) => sport.gender === 'F' && sport.season === 'Fall'
      );
      this.sports['F']['Winter'] = allSports.filter(
        (sport) => sport.gender === 'F' && sport.season === 'Winter'
      );
      this.sports['F']['Spring'] = allSports.filter(
        (sport) => sport.gender === 'F' && sport.season === 'Spring'
      );
    });
  }

  loadAthletes(): void {
    this.athleteService.getAthletes().subscribe((data: Athlete[]) => {
      this.athletes = data;
    });
  }

  getSportNameById(sportId: number | null): string {
    if (!sportId) return '--';
    const sport = this.allSports.find((s: Sport) => s.sport_id === sportId);
    return sport ? sport.name : '--';
  }

  addAthlete(): void {
    this.athleteService.addAthlete(this.newAthlete).subscribe(() => {
      this.loadAthletes();
      this.closeModal();
    });
  }

  updateAthlete(id: number, updatedAthlete: Athlete): void {
    this.athleteService.updateAthlete(id, updatedAthlete).subscribe(() => {
      this.loadAthletes();
      this.closeModal();
    });
  }

  deleteAthlete(id: number): void {
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
      fall_sport_id: null,
      winter_sport_id: null,
      spring_sport_id: null,
    };
    this.showModal = true;
  }

  openEditAthleteModal(athlete: Athlete): void {
    console.log('🌞 athlete = ', athlete);
    this.isEditMode = true;
    this.newAthlete = {
      athlete_id: athlete.athlete_id,
      first_name: athlete.first_name,
      last_name: athlete.last_name,
      class_year: athlete.class_year,
      gender: athlete.gender,
      fall_sport_id: athlete.fall_sport_id, // map correctly here
      winter_sport_id: athlete.winter_sport_id,
      spring_sport_id: athlete.spring_sport_id,
    };
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
