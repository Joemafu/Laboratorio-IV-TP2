import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./environments/environment.development";

const app = initializeApp(firebaseConfig);

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
