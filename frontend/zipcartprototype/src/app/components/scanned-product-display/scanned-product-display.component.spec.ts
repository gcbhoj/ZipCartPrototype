import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ScannedProductDisplayComponent } from './scanned-product-display.component';

describe('ScannedProductDisplayComponent', () => {
  let component: ScannedProductDisplayComponent;
  let fixture: ComponentFixture<ScannedProductDisplayComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ScannedProductDisplayComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ScannedProductDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
