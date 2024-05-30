import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconRegistryService } from './icon-registry.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class IconsModule {
  constructor(private iconRegistry: IconRegistryService) {
    this.iconRegistry.registerIcons();
  }
}
