import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScanitemsPage } from './scanitems.page';

describe('ScanitemsPage', () => {
  let component: ScanitemsPage;
  let fixture: ComponentFixture<ScanitemsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanitemsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
