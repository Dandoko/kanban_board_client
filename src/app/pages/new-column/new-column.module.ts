import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewColumnComponent } from './new-column.component';
import { NewColumnRoutingModule } from './new-column-routing.module';

@NgModule({
  declarations: [NewColumnComponent],
  imports: [
    CommonModule,
    NewColumnRoutingModule
  ]
})
export class NewColumnModule { }
