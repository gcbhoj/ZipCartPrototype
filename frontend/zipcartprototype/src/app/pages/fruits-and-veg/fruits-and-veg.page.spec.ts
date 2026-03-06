import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FruitsAndVegPage } from './fruits-and-veg.page';

describe('FruitsAndVegPage', () => {
  let component: FruitsAndVegPage;
  let fixture: ComponentFixture<FruitsAndVegPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FruitsAndVegPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
