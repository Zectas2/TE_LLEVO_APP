import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MisVehiculosPage } from './mis-vehiculos.page';

const routes: Routes = [
  {
    path: '',
    component: MisVehiculosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MisVehiculosPageRoutingModule {}
