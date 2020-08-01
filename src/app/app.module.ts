import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Routes, RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { SignupComponent } from './signup/signup.component'
import {TextFieldModule} from '@angular/cdk/text-field';
import {MatTabsModule} from '@angular/material/tabs';
import { FriendsComponent } from './friends/friends.component';
import {MatTableModule} from '@angular/material/table';
import {MatBadgeModule} from '@angular/material/badge';
import { ChatServiceService } from './chat-service.service';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatIconModule} from '@angular/material/icon';
import { AuthGuard } from './auth.guard';
import {MatSortModule} from '@angular/material/sort';




const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'friends', component: FriendsComponent, canActivate: [AuthGuard] },
  
]

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    SignupComponent,
    FriendsComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(
      appRoutes,
      {  } // <-- debugging purposes only
    ),
    BrowserAnimationsModule,
    MatToolbarModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    HttpClientModule,
    PickerModule,
    TextFieldModule,
    MatTabsModule,
    MatTableModule,
    MatBadgeModule,
    MatSnackBarModule, 
    MatIconModule,
    MatSortModule
  ],
  providers: [ChatServiceService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
