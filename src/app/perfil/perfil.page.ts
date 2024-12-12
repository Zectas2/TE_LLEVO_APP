import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { Usuario } from '../usuario';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  isModalOpen = false;
  user: Usuario[] = [];
  carrito:any;
  viaje: any;

  constructor(
    private toast: ToastController,
    public authService: AuthService,
    private loadingCtrl: LoadingController,
    private router: Router
  ) {
    this.user = this.authService.getCurrentUser(); // Obtiene el usuario actual
  }

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando datos...',
    });
    await loading.present();

    try {
      // Cargar datos de localStorage
      this.loadLocalStorageData();
      // Aquí puedes llamar a tus métodos de API si es necesario
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      await loading.dismiss();
    }
  }

  registrar() {
    this.router.navigate(['/mis-vehiculos']);
  }

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated(); // Verifica si hay un usuario autenticado
  }

  // MODAL
  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }


  loadLocalStorageData() {
    const viajeData = localStorage.getItem("viaje");
    const carritoData = localStorage.getItem("carrito");

    if (viajeData) {
      this.viaje = JSON.parse(viajeData);
      console.log(this.viaje);
    } else {
      this.viaje = []; // Inicializa como vacío si no hay datos
      this.showToastError('No hay datos de viaje en localStorage.');
    }

    if (carritoData) {
      this.carrito = JSON.parse(carritoData);
      console.log(this.carrito);
    } else {
      this.carrito = []; // Inicializa como vacío si no hay datos
      this.showToastError('No hay datos de carrito en localStorage.');
    }
  }

  delToCart(indice: number) {
    this.carrito.splice(indice, 1);
    localStorage.setItem("carrito", JSON.stringify(this.carrito));
    this.showToast(`Eliminado exitosamente.`);
  }

  delToViaje(indice: number) {
    this.viaje.splice(indice, 1);
    localStorage.setItem("viaje", JSON.stringify(this.viaje));
    this.showToast(`Eliminado exitosamente.`);
  }

  //Mensaje de operaciones exitosas
  async showToast(texto: string) {
    const toast = await this.toast.create({
      message: texto,
      duration: 3000,
      cssClass: 'rounded-toast'
    });
    await toast.present();
  }
  //Mensaje de errores
  async showToastError(texto: string) {
    const toast = await this.toast.create({
      message: texto,
      duration: 3000,
      color: 'warning',
      cssClass: 'rounded-toast'
    });
    await toast.present();
  }
}
