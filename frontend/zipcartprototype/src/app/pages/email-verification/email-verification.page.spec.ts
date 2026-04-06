import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmaiVerificationPage } from './email-verification.page';

describe('EmaiVerificationPage', () => {
  let component: EmaiVerificationPage;
  let fixture: ComponentFixture<EmaiVerificationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EmaiVerificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
