import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { HttpModule, JsonpModule } from '@angular/http';
import { AppComponent } from './app.component';
import {GridViewComponent} from "./components/gridview.component";
import {sentSet} from "./classes/sentSet";
@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    JsonpModule
  ],
  declarations: [
    AppComponent,
    GridViewComponent,
    // sentSet
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }

