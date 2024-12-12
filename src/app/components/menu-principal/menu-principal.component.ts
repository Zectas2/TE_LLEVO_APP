import { Component, OnInit } from '@angular/core';
import { AnimationController } from '@ionic/angular';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-menu-principal',
  templateUrl: './menu-principal.component.html',
  styleUrls: ['./menu-principal.component.scss'],
})
export class MenuPrincipalComponent  implements OnInit {

  icono = "Claro"
  colorFondo = true
  isAuthenticated = false;
  user: any = null;
  
  constructor(
    private anim: AnimationController,
    public authService: AuthService,
    private router: Router
  ) { 
    this.user = this.authService.getCurrentUser();
  }

  ngOnInit() {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.user = this.authService.getCurrentUser();

    this.cambiarTema();
    
    this.anim.create()
    .addElement(document.querySelector("#logo")!)
    .duration(1000)
    .iterations(Infinity)
    .fromTo("color","red","blue")
    .direction("alternate")
    .play()
    
  }
  //LOGIN
  isLoggedIn(): boolean {
    return this.authService.isAuthenticated(); 
  }
  logout() {
    this.authService.logout();
    this.isAuthenticated = false;
    this.user = null;
    this.router.navigate(['/login']);
  }
  
  cambiarTema(){
    if(this.icono == "Oscuro"){
      document.documentElement.style.setProperty("--fondo", "#0f0f0fde");
      document.documentElement.style.setProperty("--fondo-content", "#00ff1c5e");
      document.documentElement.style.setProperty("--fondo-input", "#ffffff");
      document.documentElement.style.setProperty("--texto-input", "#ffffff");
      document.documentElement.style.setProperty("--texto-inputT", "#000000");
      document.documentElement.style.setProperty("--border", "2px solid #ffffff");
      document.documentElement.style.setProperty("--fondo-imagen", "normal");
      document.documentElement.style.setProperty("--link" , "#8fffc7")
      document.documentElement.style.setProperty("--boton" , "#2e5946 ")
      this.icono = "Claro"
    }else{
      document.documentElement.style.setProperty("--fondo", "#7fff94dc");
      document.documentElement.style.setProperty("--fondo-content", "rgb(216, 250, 216)");
      document.documentElement.style.setProperty("--fondo-input", "#ffffff");
      document.documentElement.style.setProperty("--texto-input", "#000000");
      document.documentElement.style.setProperty("--texto-inputT", "#000000");
      document.documentElement.style.setProperty("--border", "2px solid #000000");
      document.documentElement.style.setProperty("--fondo-imagen", "darken");
      document.documentElement.style.setProperty("--link" , "#0054e9")
      document.documentElement.style.setProperty("--boton" , "#81c8e5 ")
      this.icono = "Oscuro"
    }
  }

  animarTema(){
    this.anim.create()
    .addElement(document.querySelector("#logo")!)
    .duration(500)
    .fromTo("transform","rotate(180deg)","rotate(360deg)")
    .onFinish(()=>{
      this.cambiarTema()
    }).play()
    console.log("Tema cambiado")
  }

  
  
}
