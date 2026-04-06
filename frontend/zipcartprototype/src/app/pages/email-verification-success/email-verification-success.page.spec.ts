import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmaiVerificationSuccessPage } from './email-verification-success.page';

describe('EmaiVerificationSuccessPage', () => {
  let component: EmaiVerificationSuccessPage;
  let fixture: ComponentFixture<EmaiVerificationSuccessPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EmaiVerificationSuccessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
