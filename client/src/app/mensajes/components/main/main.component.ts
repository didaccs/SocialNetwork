import { OnInit, Component } from '@angular/core';

@Component({
  selector: 'main',
  templateUrl: './main.component.html'
})
export class MainComponent implements OnInit {
  public title: String;

  constructor() {
    this.title = 'Mensajes privados';
  }

  ngOnInit() {
    console.log('main cargado');
  }
}
