import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistroVehiculosPage } from './registro-vehiculos.page';

const routes: Routes = [
  {
    path: '',
    component: RegistroVehiculosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistroVehiculosPageRoutingModule {}
