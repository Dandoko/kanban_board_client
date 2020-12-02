import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'board'},
  { path: 'new-column', pathMatch: 'full', redirectTo: 'new-column'},
  { path: '**', redirectTo: 'board'} // Handles invalid inputs
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
