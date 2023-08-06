import { AuthService } from './../../services/auth.service';
import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  user:User=new User();

  constructor(private toastService:ToastrService,private authService:AuthService){}
  formSubmit(event:SubmitEvent){
    event.preventDefault();
    if(this.user.name.trim()==''){
      this.toastService.error('Name is Required');
      return;
    }
    if(this.user.email.trim()==''){
      this.toastService.error('Email is Required');
      return;
    }
    if(this.user.password.trim()==''){
      this.toastService.error('Password is Required');
      return;
    }
    if(this.user.about.trim()==''){
      this.toastService.error('About is Required');
      return;
    }

    this.authService.register(this.user);
  }
}
