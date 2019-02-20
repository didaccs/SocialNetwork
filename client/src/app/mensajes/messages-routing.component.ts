import { UserGuard } from './../services/user.guard';
import { ReceivedComponent } from './components/received/received.component';
import { AddComponent } from './components/add/add.component';
import { MainComponent } from './components/main/main.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { SendedComponent } from './components/sended/sended.component';


const messagesRoutes: Routes = [
  { path: 'mensajes',
    component: MainComponent,
    children: [
      { path: '', redirectTo: 'recibidos', pathMatch: 'full'},
      { path: 'enviar', component: AddComponent, canActivate: [ UserGuard] },
      { path: 'recibidos', component: ReceivedComponent, canActivate: [ UserGuard] },
      { path: 'recibidos/:page', component: ReceivedComponent, canActivate: [ UserGuard] },
      { path: 'enviados', component: SendedComponent, canActivate: [ UserGuard] },
      { path: 'enviados/:page', component: SendedComponent, canActivate: [ UserGuard] },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(messagesRoutes)],
  exports: [RouterModule]
})
export class MessagesRoutingModule {}

