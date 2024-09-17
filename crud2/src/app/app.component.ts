import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatabaseService } from './database.service';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators,  ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  connectionStatus = '';
  usuarioForm: FormGroup;
  usuarios: any[] = [];  // Variable para almacenar los usuarios

  constructor(private databaseService: DatabaseService, private fb: FormBuilder) {
    // Inicializar el formulario
    this.usuarioForm = this.fb.group({
      NombreUsuario: ['', Validators.required],
      Mail: ['', [Validators.required, Validators.email]],
      Clave: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.recuperarUsuarios();  // Llamar a la función para cargar los usuarios al iniciar
  }

  // Probar la conexión con el backend
  testConnection() {
    this.databaseService.testConnection().subscribe({
      next: (response) => {
        this.connectionStatus = response;
      },
      error: (error) => {
        this.connectionStatus = 'Error al conectar con la base de datos';
        console.error('Error:', error);
      },
    });
  }

  // Método para enviar el formulario al servicio
  submitForm() {
    if (this.usuarioForm.valid) {
      const usuarioData = this.usuarioForm.value;
      this.databaseService.alta(usuarioData).subscribe({
        next: (response) => {
          if (response && response['resultado'] === 'OK') {
            alert('Usuario creado con éxito');
            this.usuarioForm.reset();
            this.recuperarUsuarios();
          } else {
            alert('Error al crear usuario: ' + (response['mensaje'] || 'Error desconocido'));
          }
        },
        error: (error) => {
          alert('Error al crear usuario');
          console.error('Error:', error);
        },
      });
    } else {
      alert('Por favor, completa todos los campos correctamente');
    }
  }

  // Método para recuperar los usuarios
  recuperarUsuarios() {
    this.databaseService.recuperar().subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          this.usuarios = response;  // Si es un array, asigna los usuarios
        } else {
          console.error('La respuesta del servidor no es un array:', response);
          this.usuarios = [];  // Si no es un array, establece un array vacío
        }
      },
      error: (error) => {
        console.error('Error al recuperar usuarios:', error);
      }
    });
  }
}
