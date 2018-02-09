import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material';

@Component({
  template: `
    <div> {{ content }}</div>
  `
})
export class SnackBarTemplateComponent  {
  content:any;

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) private data
  ) {
      this.content = this.data.message;
  }
}
