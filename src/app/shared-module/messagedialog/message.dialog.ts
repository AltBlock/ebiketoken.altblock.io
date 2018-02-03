import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  templateUrl: './dialog-content.html'
})
export class MessageDialogComponent implements OnInit {
  message: string;
  label: string = 'Ok';
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<MessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data    
  ){
      console.log(this.data);
      //this.data = this.data;
      this.message = this.data.message;
  }

  close() {
    this.dialogRef.close();
  }

  ngOnInit(){
     //this.message = this.data.message;
     //alert('s');
  }
}
