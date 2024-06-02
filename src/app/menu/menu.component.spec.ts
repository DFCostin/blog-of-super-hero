import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatListModule } from '@angular/material/list';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { MenuComponent } from './menu.component';
import { ICONS } from '../../assets/icons/icons';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let iconRegistry: MatIconRegistry;
  let domSanitizer: DomSanitizer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuComponent],
      imports: [MatListModule, MatIconModule, RouterTestingModule],
      providers: [MatIconRegistry, DomSanitizer]    }).compileComponents();

    iconRegistry = TestBed.inject(MatIconRegistry);
    domSanitizer = TestBed.inject(DomSanitizer);

    Object.entries(ICONS).forEach(([key, value]) => {
      if (domSanitizer.bypassSecurityTrustHtml) {
        iconRegistry.addSvgIconLiteral(key, domSanitizer.bypassSecurityTrustHtml(value) as string);
      } else {
        console.error('bypassSecurityTrustHtml is not available in DomSanitizer instance.');
      }
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct initial values', () => {
    expect(component.navItems).toBeTruthy();
    expect(component.navItems.length).toBe(2);
  });

  it('should toggle menu when toggleMenu() is called', () => {
    const initialValue = component.showMenu;
    component.toggleMenu();
    expect(component.showMenu).toBe(!initialValue);
  });
});
