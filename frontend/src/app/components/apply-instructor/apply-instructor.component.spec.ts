import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyInstructorComponent } from './apply-instructor.component';

describe('ApplyInstructorComponent', () => {
  let component: ApplyInstructorComponent;
  let fixture: ComponentFixture<ApplyInstructorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplyInstructorComponent]
    });
    fixture = TestBed.createComponent(ApplyInstructorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
