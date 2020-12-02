import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { MainViewComponent } from './main-view.component';
import { MainViewRoutingModule } from './main-view-routing.module';

@NgModule({
  declarations: [
    MainViewComponent
  ],
  imports: [
    CommonModule, DragDropModule,
    MainViewRoutingModule
  ]
})
export class MainViewModule { }
