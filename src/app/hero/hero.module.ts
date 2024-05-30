import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroFormComponent } from './hero-form/hero-form.component';
import { HeroListComponent } from './hero-list/hero-list.component';
import { HeroService } from './hero.service';



@NgModule({
  imports: [
    CommonModule,
    HeroListComponent,
    HeroFormComponent
  ],
  providers: [
    HeroService
  ],
  exports: [
    HeroListComponent,
    HeroFormComponent
  ]
})
export class HeroModule { }
