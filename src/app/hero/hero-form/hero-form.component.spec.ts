import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { HeroService } from '../hero.service';
import { HeroFormComponent } from '../hero-form/hero-form.component';

describe('HeroFormComponent', () => {
  let component: HeroFormComponent;
  let fixture: ComponentFixture<HeroFormComponent>;
  let mockHeroService: jasmine.SpyObj<HeroService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockHeroService = jasmine.createSpyObj('HeroService', ['addHero', 'updateHero', 'obtainLastId']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = {
      params: of({
        id: 1,
        name: 'Superman',
        gender: 'Male',
        race: 'Kryptonian',
        alignment: 'Good',
        publisher: 'DC',
        img: 'superman.jpg'
      })
    };

    await TestBed.configureTestingModule({
      imports: [
        HeroFormComponent,
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: HeroService, useValue: mockHeroService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call addHero when creating a new hero', () => {
    component.receiveData = false;
    component.heroForm.patchValue({
      id: 2, 
      name: 'Batman',
      gender: 'Male',
      race: 'Human',
      alignment: 'Good',
      publisher: 'DC',
      img: 'batman.jpg'
    });

    mockHeroService.obtainLastId.and.returnValue(of(2));
    component.onSubmit();

    expect(mockHeroService.addHero).toHaveBeenCalledWith({
      id: 2,
      name: 'Batman',
      gender: 'Male',
      race: 'Human',
      alignment: 'Good',
      publisher: 'DC',
      img: 'batman.jpg'
    });
  });

  it('should obtain the last hero ID when creating a new hero', () => {
    component.receiveData = false;

    mockHeroService.obtainLastId.and.returnValue(of(1));
    component.ngOnInit();

    expect(component.heroForm.get('id')?.value).toBe(1);
  });
});
