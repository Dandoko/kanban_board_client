import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainViewModule } from './pages/main-view/main-view.module';
import { CoreModule } from './core/core.module';
import { NewColumnModule } from './popup-modals/new-column/new-column.module';
import { NewTaskModule } from './popup-modals/new-task/new-task.module';
import { LoginModule } from './pages/login/login.module';
import { SignupModule } from './pages/signup/signup.module';
import { EditTaskModule } from './popup-modals/edit-task/edit-task.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, RouterModule,
    AppRoutingModule, MainViewModule, CoreModule, NewColumnModule, NewTaskModule, LoginModule, SignupModule, EditTaskModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
