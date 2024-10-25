import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  {path: 'menu', component: MenuComponent},

];
