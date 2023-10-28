import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedSurveysComponent } from './completed-surveys.component';

describe('CompletedSurveysComponent', () => {
  let component: CompletedSurveysComponent;
  let fixture: ComponentFixture<CompletedSurveysComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CompletedSurveysComponent]
    });
    fixture = TestBed.createComponent(CompletedSurveysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
