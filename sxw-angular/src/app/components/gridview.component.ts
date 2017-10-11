import {Component, ElementRef, Input} from '@angular/core';
// import {DataService} from './services/data.service'
import '../../../public/css/styles.css';
import * as Papa from 'papaparse';
import ParseConfig = PapaParse.ParseConfig;
import ParseResult = PapaParse.ParseResult;
import * as $ from 'jquery';
import random = require("core-js/fn/number/random");
import {sentSet} from "../classes/sentSet";

@Component({
  selector: 'grid-view',
  templateUrl: './gridview.component.html',
  styleUrls: ['./gridview.component.css'],
  providers: [  ]
})
export class GridViewComponent {

  @Input()
  currentSet: sentSet;
  itemCount:number;
  index:number;



  constructor() {}

  ngOnInit() { //happens on component intialization
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      $("#grid").css('font-size',"2em")
      this.itemCount = 5;
    }
    else{
      this.itemCount = 10;
    }
    this.index = 0;
  }

  nextPage(){
    this.index = this.index + this.itemCount <this.currentSet.data.length? this.index + this.itemCount: this.index;
  }

  prevPage(){
    this.index = this.index - this.itemCount >=0? this.index - this.itemCount: 0;
  }
}
