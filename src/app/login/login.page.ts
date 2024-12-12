import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationController, LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { Usuario } from '../usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  sw : boolean = false
  user: Usuario[] = [];

  isModalOpen = false;
  email = "";
  clave = 0;
  NuevaClave = 0;

  constructor(
    private toast: ToastController,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private anim: AnimationController,
    private loadingCtrl: LoadingController
    ) {}
  

  ngOnInit() {
    this.loadData()
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
    })
  }
  

  login() {
    for (let u of this.user) {
      if (u.detalle == this.email && u.precio == this.clave) {
        this.authService.login(u); // Almacena el usuario en el servicio
          this.showToast(`Bienvenido/a ${u.nombre}!.`);
          this.router.navigate(['/home']); // Navega a la página deseada
          return;
      }
    }
    this.animarError(0)
    this.animarError(1)
    this.showToastError('Usuario o contraseña incorrectos.')
  }
  //funcion para enviar email y cambiar contraseña
  async resetPass() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando...',
    });
  
    await loading.present();
  
    for (let u of this.user) {
      if (u.detalle === this.email) {
        if (!/^\d{4}$/.test(this.NuevaClave.toString())) {
          loading.dismiss();
          return this.showToastError('La nueva clave debe ser un número de 4 dígitos.');
        }
  
        let url = "https://myths.cl/api/reset_password.php";
        let body = {
          "nombre": u.nombre,
          "app": "TE_LLEVO_APP",
          "clave": this.NuevaClave,
          "email": u.detalle,
        };
        
        this.http.post(url, body).subscribe((data) => {
          console.log(data);
          this.editarUsuario(u.id,u.nombre,u.detalle,this.NuevaClave,u.imagen,u.categoria);
          loading.dismiss();
          this.setOpen(false);
          this.showToast('Contraseña actualizada, revise su email.');
        });
        return;
      }
    }
  
    loading.dismiss();
    return this.showToastError('Usuario no encontrado.');
  }
  
  async editarUsuario(id:number,producto:string,detalle:string,precio:number,imagen:string,categoria:string) {
    
      let bodyUser = {
        "id": id,
        "producto": producto,
        "detalle": detalle,
        "precio": precio,
        "imagen": imagen,
        "categoria": categoria,
        "grupo": "USER"
      }
      
    this.http.put("https://myths.cl/api/productos.php", bodyUser)
      .subscribe( async (data)=>{
      console.log(data);
    });
    this.loadData()
  };

  //funcion para abrir/cerrar modal
  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }
  animarError(index:number){
    this.anim.create()
    .addElement(document.querySelectorAll("input")[index]!)
    .duration(100)
    .iterations(3)
    .keyframes([
      {offset: 0, border: "1px transparent solid", transform: "translateX(0px)"},
      {offset: 0.25, border: "1px red solid", transform: "translateX(-5px)"},
      {offset: 0.50, border: "1px transparent solid", transform: "translateX(0px)"},
      {offset: 0.75, border: "1px red solid", transform: "translateX(5px)"},
      {offset: 1, border: "1px transparent solid", transform: "translateX(0px)"},
      
    ]).play()
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

  //FUNCION PARA ELIMINAR CUENTAS DUPLICADAS
  eliminarDuplicados(){
    let lista = [200, 187, 188, 189, 179, 180, 183, 184, 186]
    ;

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
