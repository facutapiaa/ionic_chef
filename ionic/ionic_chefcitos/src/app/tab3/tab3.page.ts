import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  email: string = '';
  password: string = '';

  constructor(private navControler: NavController) {}

  onSubmit() {
    // Obtener usuarios almacenados
    const users = JSON.parse(localStorage.getItem('users') || '[]');
  
    // Verificar si el usuario y la contraseña coinciden
    const validUser = users.find((user: any) => user.email === this.email && user.password === this.password);
  
    if (validUser) {
      console.log('Inicio de sesión exitoso');
      alert('Se ha iniciado sesión correctamente.');
      // Navega al home u otra página después del inicio de sesión
      this.navControler.navigateForward('/tabs/tab1'); 
    } else {
      console.log('Correo o contraseña incorrectos');
      alert('Correo o contraseña incorrectos.');
    }
  }

  goToRegister() {
    this.navControler.navigateForward('/register'); // Asegúrate de que la ruta esté configurada en tu enrutador
  }

}
