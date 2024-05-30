import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeroFormComponent } from './hero/hero-form/hero-form.component';
import { HeroListComponent } from './hero/hero-list/hero-list.component';

const routes: Routes = [
  { path: 'hero-list', component: HeroListComponent },
  { path: 'hero-form', component: HeroFormComponent },
  { path: '', redirectTo: '/hero-list', pathMatch: 'full' },
  { path: '**', redirectTo: '/hero-list' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
