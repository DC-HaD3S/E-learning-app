import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms'; // Needed for ngModel
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { authReducer } from './state/auth.reducer';
import { courseReducer } from './state/course.reducer';
import { CourseEffects } from './state/course.effects';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { HomeComponent } from './components/home/home.component';
import { CourseListComponent } from './components/course-list/course-list.component';
import { AuthGuard } from './guards/auth.guards';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CourseDetailsDialogComponent } from './components/course-details-dialog/course-details-dialog.component';
import { RegisteredUsersComponent } from './components/registered-users/registered-users.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    SignupComponent,
    ForgotPasswordComponent,
    HomeComponent,
    CourseListComponent,
    
    
    CourseDetailsDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    FormsModule, 
    
    HttpClientModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatDialogModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    StoreModule.forRoot({ auth: authReducer, courses: courseReducer }),
    EffectsModule.forRoot([CourseEffects])
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }