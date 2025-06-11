import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AthletesWithSports } from './athletes-with-sports';

describe('AthletesWithSports', () => {
  let component: AthletesWithSports;
  let fixture: ComponentFixture<AthletesWithSports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AthletesWithSports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AthletesWithSports);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
