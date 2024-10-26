import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { AdminComponent } from './admin/admin.component';
import { ClienteComponent } from './cliente/cliente.component';
import { AgenciaComponent } from './agencia/agencia.component';
import { EmpleadoComponent } from './empleado/empleado.component';
import { VehiculoComponent } from './vehiculo/vehiculo.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  {path: 'menu', component: MenuComponent},
  {path: 'admin', component: AdminComponent},
  {path: 'admin/cliente', component: ClienteComponent},
  {path: 'admin/empleado', component: ClienteComponent},
  {path: 'admin/vehiculo', component: ClienteComponent},
  {path: 'admin/agencia', component: AgenciaComponent}

];
