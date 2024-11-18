import { ComponentFixture, TestBed } from '@angular/core/testing';
import {SuperadminDashboardComponent2} from "./superadmin-dashboard.component";


describe('SuperadminDashboardComponent', () => {
  let component: SuperadminDashboardComponent2;
  let fixture: ComponentFixture<SuperadminDashboardComponent2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuperadminDashboardComponent2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperadminDashboardComponent2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
