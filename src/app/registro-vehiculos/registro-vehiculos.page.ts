import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoadingController, ToastController } from '@ionic/angular';
import { Usuario } from '../usuario';

@Component({
  selector: 'app-registro-vehiculos',
  templateUrl: './registro-vehiculos.page.html',
  styleUrls: ['./registro-vehiculos.page.scss'],
})
export class RegistroVehiculosPage implements OnInit {

  sw : boolean = false;

  
  user: Usuario[] = [];
  fecha: string;
  //Variables del CONDUCTOR/USUARIO
  comuna = "";
  nombre = "";
  email = "";
  clave = "";

  constructor(
    private toast: ToastController,
    private http: HttpClient,
    private loadingCtrl: LoadingController
  ) { 
    this.fecha = this.getCurrentDate();
  }

  ngOnInit() {
    this.loadData()
    //,this.eliminarDuplicados()
  }

  //funcion para llamar los datos y manejar errores
  async loadData() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando datos...',
    });
    await loading.present();
  
    try {
      await this.getUsuarios();
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
      console.log(this.user)
    })
  }
  
  
  //LOCAL STORAGE
  ionViewWillEnter(){
    
  }
  
  
  //REGISTRO CON POST
  async registrarConductor() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando...',
    });
    loading.present()
    let body = {
      "producto": this.nombre,
      "detalle": this.email,
      "precio": this.clave,
      "imagen": this.comuna,
      "categoria": this.fecha,
      "grupo": "USER"
  }
    const userExist = this.user.find((u: Usuario) => u.detalle === this.email);
    const dupName = this.user.find((u:Usuario) => u.nombre === this.nombre)
    if(!this.nombre || !this.email || !this.clave || !this.comuna){
      this.showToastError(`Debe completar todos los campos`)
      this.loadData();
      loading.dismiss();
    }
    else if(userExist){
      this.showToastError(`El usuario ya esta registrado`)
      loading.dismiss();
    }else if(dupName){
      this.showToastError(`El nombre de usuario ya esta registrado`)
      loading.dismiss();
    }else{
      this.http.post("https://myths.cl/api/productos.php", body).subscribe({
        next: (data) => {
          console.log(data);
        },
        error: (error) => {
          console.error("Error en la petición:", error);
          this.showToastError(`Hubo un problema con el registro`);
        },
        complete: () => {
          loading.dismiss();  // Cerrar el loading al completar
        }
      });
      this.loadData();
    }
  
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

  //FUNCION PARA ELIMINAR CUENTAS DUPLICADAS
  eliminarDuplicados(){
    let lista = [178];

    for (let i = 0; i < lista.length; i++) {
      let idDuplicado = lista[i];

      let body = {
        "id": idDuplicado,
        "grupo": "USER"
      };
      this.http.delete("https://myths.cl/api/productos.php", {body})
      .subscribe(async (data)=>{
      console.log(data)
    })
    }
  }
}
