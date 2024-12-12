import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MisVehiculosPage } from './mis-vehiculos.page';

describe('MisVehiculosPage', () => {
  let component: MisVehiculosPage;
  let fixture: ComponentFixture<MisVehiculosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MisVehiculosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
