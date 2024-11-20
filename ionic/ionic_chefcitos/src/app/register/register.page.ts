import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  email: string = '';
  username: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private navCtrl: NavController) {}

  ngOnInit(): void {
  }

  
  passwordsMatch(): boolean {
    return this.password === this.confirmPassword;
  }

  onRegister() {
    if (this.passwordsMatch()) {
      const newUser = {
        email: this.email,
        username: this.username,
        password: this.password,
      };
  
      // Obtener usuarios existentes del LocalStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
  
      // Verificar que el correo no esté ya registrado
      if (users.some((user: any) => user.email === this.email)) {
        console.log('El correo ya está registrado.');
        alert('El correo ya está registrado.');
        return;
      }
  
      // Agregar el nuevo usuario
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
  
      console.log('Registro exitoso', newUser);
      alert('Usuario registrado correctamente.');
      this.navCtrl.navigateForward('/tabs/tab3'); // Navegar a la página de inicio de sesión
    } else {
      console.log('Las contraseñas no coinciden');
      alert('Las contraseñas no coinciden.');
    }
  }

}
