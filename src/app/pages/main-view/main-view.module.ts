import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { MainViewComponent } from './main-view.component';
import { MainViewRoutingModule } from './main-view-routing.module';
import { NewColumnModule } from '../../popup-modals/new-column/new-column.module';
import { NewTaskModule } from '../../popup-modals/new-task/new-task.module';
import { EditTaskModule } from '../../popup-modals/edit-task/edit-task.module';

@NgModule({
  declarations: [MainViewComponent],
  imports: [
    CommonModule, DragDropModule,
    MainViewRoutingModule, NewColumnModule, NewTaskModule, EditTaskModule
  ]
})
export class MainViewModule { }
