import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';

import {Directive, ElementRef, HostListener, Input, OnChanges} from '@angular/core';

@Directive({
    selector: '[numbersOnly]'
})
export class NumbersOnlyDirective implements OnChanges {

    @Input() numbersOnly: any;

    constructor(private el: ElementRef) {}

    @HostListener('keydown', ['$event'])
    keyDownEvent(event: KeyboardEvent) {
        // Add other conditions if need to allow ctr+c || ctr+v
        if (event.key.length === 1 && (event.which < 48 || event.which > 57)) {
            event.preventDefault();
        }
    }

    ngOnChanges(changes) {
        if (changes.numbersOnly) {
            this.el.nativeElement.value = this.el.nativeElement.value.replace(/[^0-9]/g, '');
        }
    }

}

@Component({
  template: `
    <form [formGroup]="form" (ngSubmit)="submit(form)">
      <h1 mat-dialog-title>Buy STC Token</h1>
      <mat-dialog-content>
        <mat-form-field>
          <input matInput formControlName="amount" type="number"  placeholder="Enter Eth Amount">
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions>
        <button mat-raised-button  color="primary" type="submit">Buy STC</button>
        <button mat-button type="button" (click)="dialogRef.close()">Cancel</button>
      </mat-dialog-actions>
    </form>
  `
})
export class AirDropDialogComponent implements OnInit {

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AirDropDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      amount: this.data.amount ? this.data.amount : ''
    })
  }

  submit(form) {
    this.dialogRef.close(`${form.value.amount}`);
  }
}
