import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SwingModule } from 'angular2-swing';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonComponent } from './components/button/button.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MaterialModule } from './material';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { UserPageComponent } from './pages/user-page/user-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { UserService } from './services';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MentorPageComponent } from './pages/mentor-page/mentor-page.component';
import { MenteePageComponent } from './pages/mentee-page/mentee-page.component';
import { ResumePipe, AvatarPipe, FiredocPipe } from './pipes';
import { ChatPageComponent } from './pages/chat-page/chat-page.component';
import { AllChatPageComponent } from './pages/allchat-page/allchat-page.component';
import { HttpClientModule } from '@angular/common/http';


export function initApp(userService: UserService) {
  return () => {
    return userService.init();
  };
}

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    RegisterPageComponent,
    ButtonComponent,
    UserPageComponent,
    NavbarComponent,
    LandingPageComponent,
    MentorPageComponent,
    MenteePageComponent,
    ChatPageComponent,
    AllChatPageComponent,
    AvatarPipe,
    ResumePipe,
    FiredocPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFirestoreModule,
    MaterialModule,
    SwingModule,
    FontAwesomeModule,
    ModalModule.forRoot()
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      multi: true,
      deps: [UserService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
