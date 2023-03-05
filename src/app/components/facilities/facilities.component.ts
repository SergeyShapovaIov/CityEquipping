import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-facilities',
  templateUrl: './facilities.component.html',
  styleUrls: ['./facilities.component.scss']
})
export class FacilitiesComponent implements OnInit{

  @Input() facilitiesNumber :number; 
  
  constructor () {
    
  }
  ngOnInit() : void{

  }
}
