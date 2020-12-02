import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainViewModule } from './pages/main-view/main-view.module';
import { CoreModule } from './core/core.module';
import { NewColumnModule } from './pages/new-column/new-column.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, MainViewModule, CoreModule, NewColumnModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
