import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeContentManagerComponent } from './employee-content-manager.component';

describe('EmployeeContentManagerComponent', () => {
  let component: EmployeeContentManagerComponent;
  let fixture: ComponentFixture<EmployeeContentManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeContentManagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeContentManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
