import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CardContainerComponent } from './components/card-container/card-container.component';
import { MapComponentComponent } from './components/map-component/map-component.component';
import {AngularYandexMapsModule, YaConfig} from "angular8-yandex-maps";

const config: YaConfig = {
  apikey: 'b2832005-a1cc-47d0-a9eb-84c9d8e80205',
  lang: 'ru_RU'
}

@NgModule({
  declarations: [
    AppComponent,
    CardContainerComponent,
    MapComponentComponent,
  ],
  imports: [
    BrowserModule,
    AngularYandexMapsModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
