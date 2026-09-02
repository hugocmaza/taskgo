import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonApp, IonSplitPane, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonRouterOutlet, MenuController,
} from '@ionic/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterLink, IonApp, IonSplitPane, IonMenu, IonHeader, IonToolbar, IonTitle,
    IonContent, IonList, IonItem, IonRouterOutlet,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  private menu = inject(MenuController);

  async filtrar(tipo: string) {
    console.log('Filtrar por:', tipo);
    await this.menu.close();
  }
}
