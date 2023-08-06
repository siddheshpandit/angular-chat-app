import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginData={
    email:'',
    password:''
  }

  constructor(private toastr:ToastrService, private authService:AuthService,private router:Router){}
  loginFormSubmitted(event:SubmitEvent){
    event.preventDefault();
    console.log(this.loginData);
    if(this.loginData.email.trim()==''){
      this.toastr.warning('Email Required');
      return;
    }
    if(this.loginData.password.trim()==''){
      this.toastr.warning('Password Required');
      return;
    }

    //login
    this.authService.login(this.loginData.email,this.loginData.password).then((result) => {
      console.log(result);
      this.toastr.success('Logged In Successfully')
      this.authService.getUserByUserId(result.user!.uid).subscribe(user=>{
        console.log(user);
        this.authService.saveUserDataToLocalStorage(user);
        this.router.navigate(['/dashboard']);
      })
    })
    .catch((error) => {
      console.log(error);
      this.toastr.error('Error Logging in', error);
    });;
  }

  
}
