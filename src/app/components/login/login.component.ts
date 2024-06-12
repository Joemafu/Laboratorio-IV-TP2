import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../interfaces/usuario';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ FormsModule, CommonModule, ReactiveFormsModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
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

  constructor() {
    const minLength = Validators.minLength(6);
    const required = Validators.required;
    const mailPattern = Validators.email;

    this.loginForm = this.fb.group({
      mail: ['', [required, minLength, mailPattern]],
      pass: ['', [required, minLength]],
    });
  }

  ngOnInit(): void {}

  buttonDemoDr()
  {
    this.mail="Bruma@correo.com";
    this.pass="brumita";
    this.loginForm.setValue({mail: this.mail, pass: this.pass});
  }

  buttonDemoAdmin()
  {
    this.mail="Admin@correo.com";
    this.pass="3l4dm1n";
    this.loginForm.setValue({mail: this.mail, pass: this.pass});
  }

  buttonDemoPaciente()
  {
    this.mail="Ramirez@correo.com";
    this.pass="mister.ramirez";
    this.loginForm.setValue({mail: this.mail, pass: this.pass});
  }

  buttonEntrar()
  {
    if (this.loginForm.valid) {
      const usuario: Usuario = this.loginForm.value;
      this.authService.login(usuario.mail, usuario.pass)
    .then(alert => {
      this.alert = alert;
      this.mail = "";
      this.pass = "";
      this.router.navigateByUrl('/bienvenida');
    }).catch(error => {
      console.error('login.component - login()', error);
    });
    }
    else {
      this.loginForm.markAllAsTouched();
    }    
  }
}
