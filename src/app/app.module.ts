import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import {
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule
} from '@angular/material';

import { AppComponent } from './app.component';
import { MessageDialogComponent } from './shared-module/messagedialog/message.dialog';

@NgModule({
  declarations: [
    AppComponent,
    MessageDialogComponent
  ],
  imports: [
    BrowserModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    BrowserAnimationsModule
  ],
  exports: [
    MatButtonModule,
    MatCheckboxModule
  ],
  providers: [

  ],
  entryComponents: [
    MessageDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
