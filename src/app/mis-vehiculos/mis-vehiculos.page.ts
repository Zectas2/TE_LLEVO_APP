import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { LoadingController, ToastController, } from '@ionic/angular';
import { Vehiculo } from '../vehiculo';
import { Usuario } from '../usuario';



@Component({
  selector: 'app-mis-vehiculos',
  templateUrl: './mis-vehiculos.page.html',
  styleUrls: ['./mis-vehiculos.page.scss'],
})
export class MisVehiculosPage implements OnInit {
  isModalOpen = false;
  isModalOpenDel = false;

  
  vehiculos: Vehiculo[] = [];
  user: Usuario[] = [];
  
  //VARIABLES PARA REGISTRAR VEHICULOS
  idVehiculo = 0;
  nombreVehiculo = "";
  precioVehiculo = 0;
  imagenVehiculo = "";
  capacidadVehiculo = 0;

  constructor(
    private toast: ToastController,
    public authService: AuthService,
    private http:HttpClient,
    private loadingCtrl: LoadingController,
    
  ) { 
    this.user = this.authService.getCurrentUser(); // Obtiene el usuario actual
  }

  ngOnInit() {
    this.loadData()
  }
  async loadData() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando datos...',
    });
    await loading.present();
  
    try {
      await this.getvehiculos();
      await this.getUsuarios();
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      await loading.dismiss();
    }
  }

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
    
  }
  //MODAL
  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }
  setOpenDel(isOpen: boolean) {
    this.isModalOpenDel = isOpen;
  }
  //GET para usuarios
  async getUsuarios(){
    this.http.get<Usuario[]>("https://myths.cl/api/productos.php?grupo=USER")
    .subscribe((data)=>{
      this.user = data
    })
  }
  //GET PARA LOS VEHICULOS
  async getvehiculos() {
    this.http.get<Vehiculo[]>("https://myths.cl/api/productos.php?grupo=AUTO")
      .subscribe((data) => {
        this.vehiculos = data;
      });
  }
  //ELIMINAR VEHICULOS
  async DelVehiculo(idVehiculo:number) {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando...',
    });
    loading.present()
    
    let body = {
      "id": idVehiculo,
      "grupo": "AUTO"
    }
    this.http.delete("https://myths.cl/api/productos.php", {body})
      .subscribe(async (data)=>{
      console.log(data)
      await loading.dismiss()
      await this.getvehiculos();
    })
    this.showToast(`Se ha eliminado a ${idVehiculo} correctamente.`);
    this.setOpen(false)
  }
  //REGISTRAR VEHICULOS
  async registrarVehiculo() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando...',
    });
    loading.present()
    const vehiculoExist = this.vehiculos.find((v: Vehiculo) => v.nombre == this.nombreVehiculo);
    if(!this.nombreVehiculo || !this.precioVehiculo || !this.imagenVehiculo || !this.capacidadVehiculo)
      {
        this.showToastError(`Debe completar todos los campos`)
        loading.dismiss();
      }else if(vehiculoExist){
        this.showToastError(`Ya hay un vehiculo con ese nombre`)
        loading.dismiss();
      }else{
      const nombreUsuario = this.authService.getCurrentUser().nombre;
      let body = {
        "producto": this.nombreVehiculo,
        "detalle": nombreUsuario,
        "precio": this.precioVehiculo,
        "imagen": this.imagenVehiculo,
        "categoria": this.capacidadVehiculo,
        "grupo": "AUTO"
      }
      this.http.post("https://myths.cl/api/productos.php", body)
        .subscribe( async (data)=>{
        console.log(data);
        await loading.dismiss();
        await this.getvehiculos();
      });
      this.showToast(`Se ha registrado a ${this.nombreVehiculo} correctamente.`);
      this.resetearVar();
      this.setOpen(false)
    }
  }
  //EDITAR VEHICULO
  captureId(itemId:number,itemName:string,itemPrice:number,itemCap:number,itemImg:string){
    this.setOpenDel(true);
    this.idVehiculo = itemId;
    this.nombreVehiculo = itemName;
    this.precioVehiculo = itemPrice;
    this.imagenVehiculo = itemImg;
    this.capacidadVehiculo = itemCap;
  }
  async editarVehiculo() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando...',
    });
    loading.present()
    const vehiculoExist = this.vehiculos.find((v: Vehiculo) => v.nombre == this.nombreVehiculo);
    if(!this.nombreVehiculo || !this.precioVehiculo || !this.imagenVehiculo || !this.capacidadVehiculo)
      {
        this.showToastError(`Debe completar todos los campos`)
        loading.dismiss();
      }else if(vehiculoExist){
        this.showToastError(`Ya hay un vehiculo con ese nombre`)
        loading.dismiss();
      }else{
      const nombreUsuario = this.authService.getCurrentUser().nombre;
      let body = {
        "producto": this.nombreVehiculo,
        "detalle": nombreUsuario,
        "precio": this.precioVehiculo,
        "imagen": this.imagenVehiculo,
        "categoria": this.capacidadVehiculo,
        "grupo": "AUTO"
      }
    this.http.put("https://myths.cl/api/productos.php", body)
      .subscribe( async (data)=>{
      console.log(data);
      await loading.dismiss();
      await this.getvehiculos();
    });
    this.showToast(`Cambios a ${this.nombreVehiculo} realizados correctamente.`);
    this.resetearVar();
    this.setOpenDel(false);
  }};
  //funcion para reseater las variables
  resetearVar(){
    this.idVehiculo = 0;
    this.nombreVehiculo = "";
    this.precioVehiculo = 0;
    this.imagenVehiculo = "";
    this.capacidadVehiculo = 0;
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
