import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatFormFieldModule,
  MatToolbarModule,
  MatInputModule,
  MatCardModule,
  MatDividerModule
} from '@angular/material';

import { AppComponent } from './app.component';

import { MessageDialogComponent } from './shared-module/messagedialog/message.dialog';
import { AirDropDialogComponent } from './shared-module/airdrop-dialog-component';

@NgModule({
  declarations: [
    AppComponent,
    MessageDialogComponent,

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
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule
  ],
  exports: [
    MatButtonModule,
    MatCheckboxModule,

  ],
  providers: [

  ],
  entryComponents: [
    MessageDialogComponent,
    AirDropDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
