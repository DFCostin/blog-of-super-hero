import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { ICONS } from '../../assets/icons/icons';

@Injectable({
  providedIn: 'root'
})
export class IconRegistryService {

  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {}

  registerIcons(): void {
    Object.keys(ICONS).forEach(key => {
      this.matIconRegistry.addSvgIconLiteral(
        key,
        this.domSanitizer.bypassSecurityTrustHtml(ICONS[key])
      );
    });
  }
}
