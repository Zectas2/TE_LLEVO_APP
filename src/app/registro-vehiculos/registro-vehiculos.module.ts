import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistroVehiculosPageRoutingModule } from './registro-vehiculos-routing.module';

import { RegistroVehiculosPage } from './registro-vehiculos.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistroVehiculosPageRoutingModule
  ],
  declarations: [RegistroVehiculosPage]
})
export class RegistroVehiculosPageModule {}
