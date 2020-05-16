import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { UserPageComponent } from './pages/user-page/user-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { MenteePageComponent } from './pages/mentee-page/mentee-page.component';
import { MentorPageComponent } from './pages/mentor-page/mentor-page.component';
import { ChatPageComponent } from './pages/chat-page/chat-page.component';
import { AllChatPageComponent } from './pages/allchat-page/allchat-page.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'register',
    component: RegisterPageComponent
  },
  {
    path: 'user',
    component: UserPageComponent
  },
  {
    path: 'mentor',
    component: MentorPageComponent
  },
  {
    path: 'mentee',
    component: MenteePageComponent
  },
  {
    path: 'landing',
    component: LandingPageComponent
  },
  {
    path: 'allchat',
    component: AllChatPageComponent
  },
  {
    path: 'chat/:id',
    component: ChatPageComponent
  },
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
