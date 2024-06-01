import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Hero } from '../hero.interface';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-form',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  templateUrl: './hero-form.component.html',
  styleUrl: './hero-form.component.css'
})
export class HeroFormComponent implements OnInit {

  public receiveData: boolean = false;
  public editHero: Hero | null = null;
  public heroForm: FormGroup;

  constructor(private route: ActivatedRoute,private router: Router, private formBuilder: FormBuilder, private heroService: HeroService) {
    this.heroForm = this.formBuilder.group({
      id: { value: 0, disabled: true },
      name: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      race: ['', [Validators.required]],
      alignment: [''],
      publisher: [''],
      img: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const heroId = params['id'];
      if (heroId) {
        this.receiveData = true;
        this.editHero = {
          id: params['id'],
          name: decodeURIComponent(params['name']),
          gender: decodeURIComponent(params['gender']),
          race: decodeURIComponent(params['race']),
          alignment: decodeURIComponent(params['alignment']),
          publisher: decodeURIComponent(params['publisher']),
          img:decodeURIComponent(params['img'])
        };
        this.heroForm.patchValue(this.editHero);
      } else {
        this.receiveData = false;
        this.obtainLastIdHero();
      }
    });
  }
    obtainLastIdHero() :void {
      this.heroService.obtainLastId().subscribe(
        ultimoID => {
          this.heroForm.get('id')?.setValue(ultimoID + 1);
        },
        error => {
          console.error('Error getting last ID:', error);
        }
      );
    }

  onSubmit() {
    if (!this.heroForm.valid) {
      console.error('Invalid form. Check the fields.', this.heroForm.value);
    }
  }

  createHero(){
    if (this.heroForm.valid) {
      const newHero = { ...this.heroForm.value, id: this.heroForm.get('id')?.value };
      this.heroService.addHero(newHero);
      const respuesta = confirm(`The hero :  ${ this.heroForm.get('name')?.value}  was created :)`);
      this.heroForm.reset();
      this.obtainLastIdHero();
    } else {
      console.error('Invalid form. Check the fields.');
    }
  }

  updateHero(){
    if (this.heroForm.valid) {
      const updatedHero = { ...this.heroForm.value, id: this.heroForm.get('id')?.value };
      this.heroService.updateHero(updatedHero);
      const respuesta = confirm(`The hero :  ${ this.heroForm.get('name')?.value}  was update :)`);
      this.router.navigate(['/hero-list']);
    } else {
      console.error('Invalid form. Check the fields.');
    }

  }

}
