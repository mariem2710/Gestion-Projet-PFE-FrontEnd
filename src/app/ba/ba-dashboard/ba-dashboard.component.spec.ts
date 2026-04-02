import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaDashboardComponent } from './ba-dashboard.component';

describe('BaDashboardComponent', () => {
  let component: BaDashboardComponent;
  let fixture: ComponentFixture<BaDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
