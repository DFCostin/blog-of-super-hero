import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HeroListComponent } from './hero-list.component';
import { HeroService } from '../hero.service';

describe('HeroListComponent', () => {
  let component: HeroListComponent;
  let fixture: ComponentFixture<HeroListComponent>;
  let mockHeroService: jasmine.SpyObj<HeroService>;

  beforeEach(async () => {
    mockHeroService = jasmine.createSpyObj('HeroService', ['getHeroes', 'deleteHero', 'clearLocalStorage']);

    await TestBed.configureTestingModule({
      imports: [
        HeroListComponent,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        BrowserAnimationsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: HeroService, useValue: mockHeroService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadHeroes on init', () => {
    spyOn(component, 'loadHeroes');
    component.ngOnInit();
    expect(component.loadHeroes).toHaveBeenCalled();
  });

  it('should display loading spinner when isLoading is true', () => {
    component.isLoading = true;
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('mat-spinner')).toBeTruthy();
  });

  it('should hide loading spinner when isLoading is false', () => {
    component.isLoading = false;
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('mat-spinner')).toBeFalsy();
  });

  it('should set heroes data correctly', () => {
    const heroes = [
      { id: 1, name: 'Batman', gender: 'Male', race: 'Human', alignment: 'Good', publisher: 'DC', img: 'batman.jpg' }
    ];
    component.setHeroesData(heroes);
    expect(component.dataSource.data).toEqual(heroes);
    expect(component.isLoading).toBeFalse();
  });

  it('should apply filter to the table data', () => {
    component.dataSource.data = [
      { id: 1, name: 'Batman', gender: 'Male', race: 'Human', alignment: 'Good', publisher: 'DC', img: 'batman.jpg' }
    ];
    component.applyFilter({ target: { value: 'bat' } } as unknown as Event);
    expect(component.dataSource.filter).toBe('bat');
  });

  it('should navigate to edit hero', () => {
    const hero = { id: 1, name: 'Batman', gender: 'Male', race: 'Human', alignment: 'Good', publisher: 'DC', img: 'batman.jpg' };
    const routerSpy = spyOn(component['router'], 'navigate');
    component.editHero(hero);
    expect(routerSpy).toHaveBeenCalledWith(['../hero-form', jasmine.any(Object)], { relativeTo: component['route'] });
  });

  it('should clear date and reload heroes', () => {
    spyOn(component, 'loadHeroes');
    component.clearDate();
    expect(mockHeroService.clearLocalStorage).toHaveBeenCalled();
    expect(component.loadHeroes).toHaveBeenCalled();
  });
});
