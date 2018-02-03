import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  template: `
    <form [formGroup]="form" (ngSubmit)="submit(form)">
      <h1 mat-dialog-title>Add file</h1>
      <mat-dialog-content>
        <mat-form-field>
          <input matInput formControlName="filename" placeholder="Enter filename">
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions>
        <button mat-button type="submit">{{Add}}</button>
        <button mat-button type="button" (click)="dialogRef.close()">Cancel</button>
      </mat-dialog-actions>
    </form>
  `
})
export class FileNameDialogComponent implements OnInit {

  form: FormGroup;
  Add: string = 'ADDD';
  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<FileNameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      filename: this.data.filename ? this.data.filename : ''
    })
  }

  submit(form) {
    this.dialogRef.close(`${form.value.filename}`);
  }
}