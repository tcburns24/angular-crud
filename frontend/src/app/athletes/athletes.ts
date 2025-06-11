import { Component } from '@angular/core';
import { AthleteService } from '../services/athlete.services';

@Component({
  selector: 'app-athletes',
  imports: [],
  templateUrl: './athletes.html',
  styleUrl: './athletes.scss',
})
export class Athletes {
  athletes: any[] = [];
  showModal: boolean = false;

  newAthlete = {
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
