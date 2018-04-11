import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Drizzle, generateStore } from 'drizzle';

import {
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatFormFieldModule,
  MatToolbarModule,
  MatInputModule,
  MatCardModule,
  MatDividerModule,
  MatSnackBarModule
} from '@angular/material';

import { AppComponent } from './app.component';

import { MessageDialogComponent } from './shared-module/messagedialog/message.dialog';
import { AirDropDialogComponent } from './shared-module/airdrop-dialog-component';
import { SnackBarTemplateComponent } from './shared-module/snackbar-template-component';

@NgModule({
  declarations: [
    AppComponent,
    MessageDialogComponent,
    SnackBarTemplateComponent,
    AirDropDialogComponent
  ],
  imports: [
    BrowserModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDividerModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule
  ],
  exports: [
    MatButtonModule,
    MatCheckboxModule
  ],
  providers: [

  ],
  entryComponents: [
    MessageDialogComponent,
    AirDropDialogComponent,
    SnackBarTemplateComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
