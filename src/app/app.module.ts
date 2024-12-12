import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { MenuPrincipalComponent } from './components/menu-principal/menu-principal.component';


import { provideHttpClient } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent, MenuPrincipalComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [provideHttpClient(), { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, provideAnimationsAsync()],
  exports: [MenuPrincipalComponent],
  bootstrap: [AppComponent],
})


export class AppModule {}
