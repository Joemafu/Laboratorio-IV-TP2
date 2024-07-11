import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../models/usuario';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { slideOutInAnimation } from '../../animations/slideOutInAnimation';
import { fadeInAnimation } from '../../animations/fadeInAnimation';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ FormsModule, CommonModule, ReactiveFormsModule, MatIconModule, MatButtonModule, MatMenuModule, SpinnerComponent ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  animations: [slideOutInAnimation, fadeInAnimation]
})

export class LoginComponent implements OnInit {

  protected mail: string = "";
  protected pass: string ="";
  protected title: string="INICIAR SESIÓN";
  protected alert: string = "";
  fb: FormBuilder = inject(FormBuilder);
  loginForm: FormGroup;
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  fabAbierto: boolean = false;
  spinner: boolean = false;
  


  constructor() {
    const minLength = Validators.minLength(6);
    const required = Validators.required;
    const correo = Validators.pattern('^[a-zA-Z0-9_.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$');

    this.loginForm = this.fb.group({
      mail: ['', [required, minLength, correo]],
      pass: ['', [required, minLength]],
    });
  }

  ngOnInit(): void {}

  accesoUno()
  {
    this.mail="hkskjlhwo@mozmail.com";
    this.pass="harveydent";
    this.loginForm.setValue({mail: this.mail, pass: this.pass});
  }

  accesoDos()
  {
    this.mail="dq2r7xp88@mozmail.com";
    this.pass="bobesponja";
    this.loginForm.setValue({mail: this.mail, pass: this.pass});
  }

  accesoTres()
  {
    this.mail="w12papab7@mozmail.com";
    this.pass="randymarsh";
    this.loginForm.setValue({mail: this.mail, pass: this.pass});
  }

  accesoCuatro()
  {
    this.mail="alvpqz8u0@mozmail.com";
    this.pass="nickriviera";
    this.loginForm.setValue({mail: this.mail, pass: this.pass});
  }

  accesoCinco()
  {
    this.mail="xhzays0dj@mozmail.com";
    this.pass="juliushibbert";
    this.loginForm.setValue({mail: this.mail, pass: this.pass});
  }

  accesoSeis()
  {
    this.mail="joe_mafu@hotmail.com";
    this.pass="3l4dm1n";
    this.loginForm.setValue({mail: this.mail, pass: this.pass});
  }

  async buttonEntrar()
  {
    this.spinner = true;
    if (this.loginForm.valid) {
      const usuario: Usuario = this.loginForm.value;
      this.authService.login(usuario.mail, usuario.pass)
    .then(alert => {
      this.alert = alert;
      this.mail = "";
      this.pass = "";
      if (alert === '') {
        this.router.navigateByUrl('/bienvenida');
      }
    }).catch(error => {
      console.error('login.component - login()', error);
    });
    }
    else {
      this.loginForm.markAllAsTouched();
    }    
  }

  switchFab()
  {
    this.fabAbierto = !this.fabAbierto;
  }
}