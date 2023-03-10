import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CardContainerComponent } from './components/card-container/card-container.component';
import { MapComponentComponent } from './components/map-component/map-component.component';
import {AngularYandexMapsModule, YaConfig} from "angular8-yandex-maps";
import { GraphComponent } from './components/graph/graph.component';
import { PopulationComponent } from './components/population/population.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxEchartsModule } from 'ngx-echarts';
import { SearchComponent } from './components/search/search.component';
import { FacilitiesComponent } from './components/facilities/facilities.component';
import { MarkComponent } from './components/mark/mark.component';


const config: YaConfig = {
  apikey: 'b2832005-a1cc-47d0-a9eb-84c9d8e80205',
  lang: 'ru_RU'
}

@NgModule({
  declarations: [
    AppComponent,
    CardContainerComponent,
    MapComponentComponent,
    PopulationComponent,
    GraphComponent,
    SearchComponent,
    FacilitiesComponent,
    MarkComponent,
  ],
  imports: [
    BrowserModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    AngularYandexMapsModule.forRoot(config),
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
