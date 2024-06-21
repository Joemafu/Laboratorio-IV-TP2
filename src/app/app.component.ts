import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Mahafud Joel - Clinica TP2 Labo IV';
  authService : AuthService = inject(AuthService);
  usuario: string = '';
  public subscription: Subscription = new Subscription();
  public router = inject(Router);

  constructor(){

  }

  ngOnInit(): void {
    this.subscription = this.authService.user$.subscribe((user) => {
      if (user) {
        this.authService.currentUserSig.set({
          mail: user.email!,
          pass: "",
        });
        this.usuario = user.email!;
      } else {
        this.usuario="";
        this.authService.currentUserSig.set(null);    
      }
    });

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  } 

  buttonHome() {
    this.router.navigate(['bienvenida']);
  }

  buttonAdministrarUsuarios() {
    this.router.navigate(['administrar-usuarios']);
  }

  buttonLogin() {
    this.router.navigate(['login']);
  }

  buttonRegistrar() {
    this.router.navigate(['registrar']);
  }

  buttonLogOut() {
    this.authService.logout();
  } 
}
