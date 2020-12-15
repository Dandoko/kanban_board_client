import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainViewModule } from './pages/main-view/main-view.module';
import { CoreModule } from './core/core.module';
import { NewColumnModule } from './pages/new-column/new-column.module';
import { NewTaskModule } from './pages/new-task/new-task.module';
import { LoginModule } from './pages/login/login.module';
import { SignupModule } from './pages/signup/signup.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, RouterModule,
    AppRoutingModule, MainViewModule, CoreModule, NewColumnModule, NewTaskModule, LoginModule, SignupModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
