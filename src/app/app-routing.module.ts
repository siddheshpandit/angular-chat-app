import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ChatDashboardComponent } from './pages/chat-dashboard/chat-dashboard.component';
import { VerifyEmailComponent } from './pages/verify-email/verify-email.component';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  {path:'',redirectTo:'login',pathMatch:'full'},
  {path:'login',component:LoginComponent},
  {path:'register',component:RegisterComponent},
  {path:'dashboard',component:ChatDashboardComponent,canActivate:[authGuard]},
  {path:'verfiy-email',component:VerifyEmailComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
