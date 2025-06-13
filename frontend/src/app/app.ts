import { Component } from '@angular/core';
import { Athletes } from './athletes/athletes';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HttpClientModule, Athletes, FormsModule],
  template: ` <app-athletes></app-athletes> `,
})
export class App {}
