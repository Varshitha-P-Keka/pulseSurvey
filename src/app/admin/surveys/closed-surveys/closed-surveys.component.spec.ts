import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosedSurveysComponent } from './closed-surveys.component';

describe('ClosedSurveysComponent', () => {
  let component: ClosedSurveysComponent;
  let fixture: ComponentFixture<ClosedSurveysComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClosedSurveysComponent]
    });
    fixture = TestBed.createComponent(ClosedSurveysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
