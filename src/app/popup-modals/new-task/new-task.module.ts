import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewTaskComponent } from './new-task.component';
import { NewTaskRoutingModule } from './new-task-routing.module';

@NgModule({
  declarations: [NewTaskComponent],
  imports: [
    CommonModule,
    NewTaskRoutingModule
  ],
  exports: [NewTaskComponent]
})
export class NewTaskModule { }
