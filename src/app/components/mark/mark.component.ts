import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-mark',
  templateUrl: './mark.component.html',
  styleUrls: ['./mark.component.scss']
})
export class MarkComponent implements OnInit{

  @Input() points: number;

  markText: string;

  ngOnChanges(): void {
    this.markText =  this.getTextByMark(this.points);
  }

  ngOnInit(): void {
   
  }

  getTextByMark(mark :number) : string {

    if(mark >= 0 && mark <= 3) {
      return "Infrastructure can provide only a very small part of the residents, immediate action is required";
    };
    if(mark > 3 && mark <= 5) {
      return "Infrastructure has some development, local governments are taking the necessary measures, but still not enough";
    };
    if(mark > 5 && mark <= 7.5) {
      return "The infrastructure is quite developed, most of the population has no problems with their needs in sports";
    };
    if(mark > 7.5 && mark <= 10) {
      return "The infrastructure is well developed, the population feels no problem in finding a place to play sports";
    };
    if(mark > 10) {
      return "The infrastructure is very well developed, the authorities are actively engaged in the issue of development, the population does not feel the problems of lack of places for sports recreation";
    }

    return "Incorrect assessment";

  } 
}
