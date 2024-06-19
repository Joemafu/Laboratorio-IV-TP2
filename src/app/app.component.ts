import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Subscription } from 'rxjs';
import { MatSlideToggleModule  } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatSlideToggleModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Mahafud Joel - Clinica TP2 Labo IV';
  authService : AuthService = inject(AuthService);
  usuario: string = '';
  public subscription: Subscription = new Subscription();

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

  buttonLogOut() {
    this.authService.logout();
  }  
}
