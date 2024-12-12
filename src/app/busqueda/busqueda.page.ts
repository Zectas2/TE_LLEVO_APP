import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal, LoadingController, ToastController } from '@ionic/angular';
import { Usuario } from '../usuario';
import { Vehiculo } from '../vehiculo';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.page.html',
  styleUrls: ['./busqueda.page.scss'],
})
export class BusquedaPage implements OnInit {
  //Variables de GET
  vehiculos: Vehiculo[] = [];
  vehiculosFiltrados: Vehiculo[] = []
  user: Usuario[] = [];
  //VARIABLES BUSQUEDA
  capacidad: number = 0;
  minPrecio: number = 0;
  maxPrecio: number = 99999;
  //VARIABLES MODAL
  isModalOpen = false;
  //VARIABLES CARRITO
  carrito: any[] = [];
  viaje:any[] = [];
  fecha: string;
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
    // Inicialización de propiedades
    this.nombreUsuario = this.authService.getCurrentUser().nombre;
    this.fecha = this.getCurrentDate();
  }

  ngOnInit() {
    this.loadData();
    this.ionViewWillEnter()
    // ngOnInit no tiene acceso a la vista, así que no podemos usar modal aquí
  }
  

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
  //GET
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
        this.vehiculosFiltrados = [...data];
      });
  }

  filtrarVehiculos() {
    this.vehiculosFiltrados = this.vehiculos.filter(vehiculo => {
      const precio = vehiculo.precio;
      const capacidad = vehiculo.categoria;
  
      return (
        (this.minPrecio != undefined ? precio >= this.minPrecio : true) &&
        (this.maxPrecio != undefined ? precio <= this.maxPrecio : true) &&
        (this.capacidad != undefined && this.capacidad != 0 ? capacidad == this.capacidad : true)
      );
    });
  }
 
  //CONTRATAR
  //Carrito
  ionViewWillEnter(){
    if(localStorage.getItem("carrito")){
      this.carrito = JSON.parse(localStorage.getItem("carrito")!)
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
