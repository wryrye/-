import {Component, ElementRef} from '@angular/core';
import {DataService} from './services/data.service'
import '../../public/css/styles.css';
import * as Papa from 'papaparse';
import ParseConfig = PapaParse.ParseConfig;
import ParseResult = PapaParse.ParseResult;
import * as $ from 'jquery';
import random = require("core-js/fn/number/random");
import {GridViewComponent} from "./components/gridview.component";
import {sentSet} from './classes/sentSet'
import {tryCatch} from "rxjs/util/tryCatch";
import {ViewChild} from "@angular/core/src/metadata/di";

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ DataService ],
  entryComponents:[GridViewComponent]
})
export class AppComponent {
  engSent:string;
  prevEngSent:string;

  config:ParseConfig;
  simpJSON: string;
  errorMessage: string;

  allSets: Map<string,sentSet>;
  currentSet: sentSet;
  currentSearch:string;
  masterSet: sentSet;
  index:number = -1;

  alreadyDone:Array<number>;
  showRepeats:boolean = false;
  closingList:boolean = false;
  closingSearch:boolean = false;

  settings: Array<string>;
  stall: boolean = false;
  noNew:string;
  noSent: string;

  showGridView:boolean;

  constructor (private dataService: DataService) {}

  ngOnInit(){ //happens on component intialization
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      console.log('hello mobile user!');
      $("#title").css("font-size", "4em");
      $("#engSent").css("font-size", "2em");
      $("#prevEngSent").css("font-size", "2em");
      $("#chinSent").css("font-size", "2em");
    }

    this.allSets = new Map<string,sentSet>(); //initialize
    this.alreadyDone = [];
    this.settings = ['Show repeats', 'Grid view'];
    this.noNew = 'No new examples. Turn on \"Show repeats\" in settings!';
    this.noSent = 'No sentences containing your search terms!'
    this.showRepeats = false;
    this.showGridView = false;


    this.getCookie(); //gets already guessed sentences from cookie
    this.getData(); //gets csv from server

    $("#welcome2") //hide welcome screen when animation is done
      .on("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd",
        $.proxy(function(e){
          $('#welcome2').css('visibility','hidden');
        },this));
  }

  getData() { //waits for response from http request for csv
    this.dataService.getData()
      .subscribe(
        response => {
          this.simpJSON = response;
          this.loadData()
        },
        error => {
          this.errorMessage = <any>error
        });
  }

  loadData(){ //loads csv into local variables
    this.config = { //config settings for pasrser
      delimiter: ",",
      newline: "",
    };
    var simpcsv = Papa.parse(this.simpJSON, this.config); //load simplified characters csv
    simpcsv.data.pop(); //pop off last empty entry

    this.masterSet = new sentSet('masterset', simpcsv.data ); //create master set of sentences
    this.allSets.set('master',this.masterSet); //add to map of sets
    this.currentSet = this.masterSet; //set current set to master

    this.index = Math.round(Math.random() * this.masterSet.data.length) //start set at random index
    this.nextSent(); //and show 1st sentence
  }

  nextSent(){ //shows next sentence
    if(this.showRepeats == false){ //if no repeats allowed
      var checked = 0; //keep track of # of indices checked
      do {
        checked++; //increment checked count
        this.index++; // increment sentence index
        if(this.index >= this.currentSet.data.length) // loop to beginning if at end
          this.index=0;
      }//keep checking while sentence at index has already been seen and have not checked every index
      while(this.alreadyDone.indexOf(+this.currentSet.data[this.index][0]) > -1 && this.currentSet.data.length >= checked); //checks if indexed element's id is in array of already read id's

      if(this.currentSet.data.length < checked){ //if every index checked (thus every sentence seen)
        this.engSent = this.noNew;
        this.stall = true;
      }
      else{
        this.prevEngSent = this.engSent == this.noNew ||this.engSent ==  this.noSent? '': this.engSent;//show previous answer
        this.engSent = this.currentSet.data[this.index][3];//and set new sentence
      }
      console.log(this.index+" index")
    }
    else{ //if repeats allowed
      this.index = this.index+1 >= this.currentSet.data.length? 0: this.index+1;
      this.prevEngSent = this.engSent == this.noNew ||this.engSent ==  this.noSent? '': this.engSent;//show previous answer
      this.engSent = this.currentSet.data[this.index][3];//and set new sentence
    }

  }

  testGuess(){
    if(!this.stall) {
      var guess: string = (<HTMLInputElement>document.getElementById('textfield')).value; //get guess
      var actual: string = JSON.stringify(this.currentSet.data[this.index][2]).slice(1, -1); //get acual
      var punct: string = "“”！。？，\\\""; //punctuation string to check against
      var resultString: string = ''; //resulting string
      for (let i of actual) { //create correctness-colored string for answer
        if (punct.indexOf(i) > -1) {//if a char is punctuation
          resultString += '<span style = "color:#000000;">' + i + '</span>'; //black
          continue;
        }
        if (guess.indexOf(i) > -1) {//if char is right
          guess = guess.replace(i, '');
          resultString += '<span style = "color:#7cfc00;">' + i + '</span>'; //green
        } else {//if char is wrong
          resultString += '<span style = "color:#000000;">' + i + '</span>'; //black
        }

      }
      this.alreadyDone.push(+this.currentSet.data[this.index][0]); //record already done sentences
      this.writeCookie(); //record already done in cookie
      this.nextSent();//and move to next sentence


      (<HTMLInputElement>document.getElementById('textfield')).value = ''; //clear guess
      (<HTMLElement>document.getElementById('chinSent')).innerHTML = resultString; //display correctness-colored-answer
    }
    // (<HTMLElement>document.getElementById('points')).innerHTML = "+" + score.toString(); //show some points!
    // $('#points').css('animation-name','fade'); //fade animation for points
    // $("#points")
    //   .on("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd",
    //     $.proxy(function(e){
    //       $('#points').html('');
    //       $('#points').css('animation-name','toggle-reset');
    //     },this));
  }

  doSearch(){ //create dataset based on search input
    this.currentSearch = (<HTMLInputElement>document.getElementById('search-bar')).value; //get value of search

    if(this.allSets.has(this.currentSearch)){ //check to see if already been searched
      this.currentSet = this.allSets.get(this.currentSearch);
      this.index = -1;
      this.clearHTML();
      this.nextSent();
    }
    else{ //otherwise make new sentence set including searched input
      let newSet:sentSet = new sentSet(this.currentSearch, [] );
      var count = 0;
      for(let i of this.masterSet.data){
        if(i[2].indexOf(this.currentSearch) > -1){
          newSet.data.push(i);
          count++;
        }
      }
      if(count == 0){
        this.clearHTML();
        console.log('empty set')
        this.engSent = this.noSent;
      }
      else{
        this.allSets.set(this.currentSearch,newSet);
        this.currentSet = newSet;
        this.index = -1;
        this.clearHTML();
        this.nextSent();
      }
      }
  }

  keypressHandler(event:any, action:string){ //handles keystrokes
    if(event == 13){
      if(action =='guess'){
        this.testGuess();
      }
      else{
        this.doSearch();
        this.toggleSearchbar()
      }
    }

  }

  toggleSearchbar(){ //shows/closes searchbar
    if($("#search-bar").css('visibility') == 'hidden'){
      $("#search-bar").css('visibility','visible')
      $("#search-bar").css('width','5em')
      this.closingSearch = false;
    }
    else{
      $("#search-bar").css('width','0em')
      this.closingSearch = true;
    }
    $("#search-bar")
      .on("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
        $.proxy(function(e){
          if(this.closingSearch){
            $("#search-bar").css('visibility','hidden');
          }

        },this));

  }

  showSettingsList(){ //shows/closes searchbar
    if($("#settings-list").css('visibility') == 'hidden'){
      $("#settings-list").css('visibility','visible')
      $("#settings-list").css('max-height','10em')
      this.closingList = false;
    }
    else{
      $("#settings-list").css('max-height','0em');
      this.closingList = true;
    }
    $("#settings-list")
      .on("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
        $.proxy(function(e){
          if(this.closingList){
            $("#settings-list").css('visibility','hidden');
          }

        },this));

  }

  getCookie(){
    if(document.cookie != ''){
      var cookieString = document.cookie.split('=');
      var data = $.parseJSON(cookieString[1]);
      this.alreadyDone = data;
    }

  }

  writeCookie(){
    //set expiration
    var now = new Date();
    now.setMonth( now.getMonth() + 6 );
    var expdate:string = "expires=" + now.toUTCString();

    //stringify already read
    var cookieValue:string =JSON.stringify(this.alreadyDone)+"; ";

    //set cookies
    document.cookie="name=" + cookieValue + ";"+"expires="+expdate+";";
  }

  clearHTML(){ //clear existing html
    (<HTMLInputElement>document.getElementById('search-bar')).value = '';

    try {
      (<HTMLInputElement>document.getElementById('textfield')).value = '';
      (<HTMLInputElement>document.getElementById('chinSent')).innerHTML = '';
    }
    catch (e){}

    this.engSent = '';
    this.prevEngSent = '';
  }

  clearSearch(){
    this.currentSet = this.masterSet
    this.nextSent()
    this.stall=false;
  }

  toggleSettings(setting:string, element:any){
    if(setting == this.settings[0]){
      this.showRepeats = element.checked;
      this.stall = false;
      this.nextSent()
    }
    if(setting == this.settings[1]){
      this.showGridView = element.checked;
      // this.stall = false;
      // this.nextSent()
    }

  }

  funWithWS(){ //to be implemented later
    var host = window.document.location.host.replace(/:.*/, '');
    var ws = new WebSocket('ws://' + host + ':4080');
    ws.onmessage = function (event) {
      console.log(event);
    };
  }


}



