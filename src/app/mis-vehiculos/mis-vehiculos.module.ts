import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MisVehiculosPageRoutingModule } from './mis-vehiculos-routing.module';

import { MisVehiculosPage } from './mis-vehiculos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MisVehiculosPageRoutingModule
  ],
  declarations: [MisVehiculosPage]
})
export class MisVehiculosPageModule {}
