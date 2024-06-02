import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HeroService } from './hero.service';
import { Hero } from './hero.interface';

describe('HeroService', () => {
  let service: HeroService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HeroService]
    });
    service = TestBed.inject(HeroService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch heroes from API via GET', () => {
    const mockHeroes: Hero[] = [
      { id: 1, name: 'Hero1', gender: 'Male', race: 'Human', alignment: 'Good', publisher: 'Marvel', img: 'hero1.jpg' },
      { id: 2, name: 'Hero2', gender: 'Female', race: 'Mutant', alignment: 'Neutral', publisher: 'DC', img: 'hero2.jpg' }
    ];

    service.getHeroes().subscribe(heroes => {
      expect(heroes.length).toBe(2);
      expect(heroes).toEqual(mockHeroes);
    });

    const req = httpMock.expectOne('https://www.superheroapi.com/api.php/2fc632c162f048c834371300191524ac/search/all');
    expect(req.request.method).toBe('GET');
    req.flush({ results: mockHeroes });
  });

  it('should handle HTTP errors when fetching heroes', () => {
    const errorMessage = '404 Not Found';

    service.getHeroes().subscribe(
      () => fail('expected an error'),
      error => {
        expect(error).toEqual('An error occurred while fetching data from the SuperHero API');
      }
    );

    const req = httpMock.expectOne('https://www.superheroapi.com/api.php/2fc632c162f048c834371300191524ac/search/all');
    req.error(new ErrorEvent(errorMessage), { status: 404 });
  });

});
