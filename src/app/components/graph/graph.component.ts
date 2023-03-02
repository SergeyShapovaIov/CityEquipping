import { Component, Input, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import type { EChartsOption } from 'echarts';
import { CityService } from 'src/app/services/city.service';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit{

  @Input() options: any;
  @Input() updateOptions: any;

  
  constructor(private cityService: CityService) {
    console.log("render!")
    console.log(this.options);
    this.cityService.options.subscribe();
  }

  ngOnInit(): void {
    
  }
};

