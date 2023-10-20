import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './AppComponent';
import { FormsModule } from '@angular/forms';
import { QuestioningComponent } from './questioning/questioning.component';
import { main } from './main/main.component';

@NgModule({
  declarations: [AppComponent, QuestioningComponent, main],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
