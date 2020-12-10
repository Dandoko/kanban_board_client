import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'board'},
  { path: 'login', pathMatch: 'full', redirectTo: 'login'},
  { path: 'signup', pathMatch: 'full', redirectTo: 'signup'},
  { path: 'new-column', pathMatch: 'full', redirectTo: 'new-column'},
  { path: ':columnId/new-task', pathMatch: 'full', redirectTo: ':columnId/new-task'},
  { path: '**', redirectTo: 'board'} // Handles invalid inputs
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
