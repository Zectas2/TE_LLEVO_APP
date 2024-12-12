import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroVehiculosPage } from './registro-vehiculos.page';

describe('RegistroVehiculosPage', () => {
  let component: RegistroVehiculosPage;
  let fixture: ComponentFixture<RegistroVehiculosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroVehiculosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
