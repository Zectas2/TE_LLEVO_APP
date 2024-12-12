import { HttpClient } from '@angular/common/http';
import { Component,ViewChild, OnInit } from '@angular/core';
import { IonModal, LoadingController, ToastController } from '@ionic/angular';
import { Usuario } from '../usuario';
import { Vehiculo } from '../vehiculo';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})


export class HomePage implements OnInit{
  vehiculos: Vehiculo[] = [];
  user: Usuario[] = [];
  carrito: any[] = [];
  viaje:any[] = [];
  fecha: string;

  isModalOpen = false;
  

  nombreUsuario: string;

  selectedItem: any;
  selectedUser: any;

  @ViewChild(IonModal) modal!: IonModal;

  constructor(
    public authService: AuthService,
    private toast: ToastController,
    private http:HttpClient,
    private loadingCtrl: LoadingController
  ) {
    this.fecha = this.getCurrentDate();
    this.nombreUsuario = this.authService.getCurrentUser().nombre;
  }
  ngOnInit() {
    this.loadData();
    this.ionViewWillEnter();
  }
  //funcion para llamar los datos y manejar errores
  async loadData() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando datos...',
    });
    await loading.present();
  
    try {
      await this.getUsuarios();
      await this.getvehiculos();
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      await loading.dismiss();
    }
  }
   async getUsuarios(){
    this.http.get<Usuario[]>("https://myths.cl/api/productos.php?grupo=USER")
    .subscribe((data)=>{
      this.user = data
    })
  }
  async getvehiculos() {
    this.http.get<Vehiculo[]>("https://myths.cl/api/productos.php?grupo=AUTO")
      .subscribe((data) => {
        this.vehiculos = data;
      });
  }

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated(); // Verifica si hay un usuario autenticado
  }
  
  //Carrito
  ionViewWillEnter(){
    if(localStorage.getItem("carrito") && localStorage.getItem("viaje")){
      this.carrito = JSON.parse(localStorage.getItem("carrito")!)
      this.viaje = JSON.parse(localStorage.getItem("viaje")!)
    }

  }

  async showToast(texto: string) {
    const toast = await this.toast.create({
      message: texto,
      duration: 3000,
      cssClass: 'rounded-toast'
    });
    await toast.present();
  }

 
  //MODAL
  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }
  mostrarModal(vehiculo: Vehiculo, usuario: Usuario) {
    this.selectedItem = vehiculo;
    this.selectedUser = usuario;
    this.setOpen(true);
  }

  addToCart() {
    const vehiculoConFecha = {
      ...this.selectedItem,
      destinoUsuario: this.selectedUser.imagen,
      fecha: this.fecha,
    };

    this.carrito.push(vehiculoConFecha);
    localStorage.setItem("carrito", JSON.stringify(this.carrito));
    this.showToast(`${this.selectedItem.nombre} Pedido Realizado!`);
    this.addViaje()
    this.setOpen(false);
    console.log(this.carrito)
  }
  addViaje() {
    
    const añadirfecha = {
      nombreConductor: this.selectedItem.detalle,
      precio: this.selectedItem.precio,
      destino: this.selectedUser.imagen,
      nombreCliente: this.nombreUsuario,
      fecha: this.fecha,
    };

    this.viaje.push(añadirfecha);
    localStorage.setItem("viaje", JSON.stringify(this.viaje));
    console.log(this.viaje)
  }

  //Fecha
  getCurrentDate(): string {
    const now = new Date(); // Captura la fecha y hora actuales

    // Formato día-mes-año y hora
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false // Cambia a true si deseas formato de 12 horas
    };

    return now.toLocaleString('es-ES', options); // Usa la configuración regional deseada
  }



}

