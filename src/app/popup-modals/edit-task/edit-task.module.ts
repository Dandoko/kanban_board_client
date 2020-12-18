import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditTaskRoutingModule } from './edit-task-routing.module';
import { EditTaskComponent } from './edit-task.component';

@NgModule({
  declarations: [EditTaskComponent],
  imports: [
    CommonModule,
    EditTaskRoutingModule
  ],
  exports: [EditTaskComponent]
})
export class EditTaskModule { }
