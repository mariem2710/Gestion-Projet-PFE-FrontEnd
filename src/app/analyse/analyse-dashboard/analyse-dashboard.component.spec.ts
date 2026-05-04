import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyseDashboardComponent } from './analyse-dashboard.component';

describe('AnalyseDashboardComponent', () => {
  let component: AnalyseDashboardComponent;
  let fixture: ComponentFixture<AnalyseDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyseDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyseDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
