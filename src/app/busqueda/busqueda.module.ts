import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BusquedaPageRoutingModule } from './busqueda-routing.module';
import { BusquedaPage } from './busqueda.page';

import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatCardModule} from '@angular/material/card';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BusquedaPageRoutingModule,
    MatCardModule
  ],
  declarations: [BusquedaPage]
})
export class BusquedaPageModule {}

export class CardOverviewExample {}
