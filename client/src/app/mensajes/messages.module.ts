import { MomentModule } from 'angular2-moment';
import { SendedComponent } from './components/sended/sended.component';
import { AddComponent } from './components/add/add.component';
import { MainComponent } from './components/main/main.component';
import { NgModule } from '@angular/core';
import { ReceivedComponent } from './components/received/received.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessagesRoutingModule } from './messages-routing.component';
import { UserService } from '../services/user.service';
import { UserGuard } from '../services/user.guard';

@NgModule({
  declarations: [
    MainComponent,
    AddComponent,
    ReceivedComponent,
    SendedComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MessagesRoutingModule,
    MomentModule
  ],
  exports: [
    MainComponent,
    AddComponent,
    ReceivedComponent,
    SendedComponent
  ],
  providers: [
    UserService,
    UserGuard
  ]
})
export class MessagesModule {}
