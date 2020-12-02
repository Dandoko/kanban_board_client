import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewColumnComponent } from './new-column.component';

const routes: Routes = [
    { path: 'new-column', component: NewColumnComponent },
];

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ]
})
export class NewColumnRoutingModule {

}
