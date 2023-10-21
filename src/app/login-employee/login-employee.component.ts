import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { ServicesService } from '../services/services.service';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-login-employee',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './login-employee.component.html',
  styleUrls: ['./login-employee.component.scss']
})
export class LoginEmployeeComponent {

  loginForm!:FormGroup;
  data:any;

  constructor(private fb:FormBuilder,private service:ServicesService){}

  ngOnInit(){
    this.loginForm = this.fb.group({
      email:[''],
      password:['']
    })
  }

  onSubmit(){
    this.service.getVerifyEmployee(this.loginForm.value).subscribe((data)=>{
      this.data = data;
      const decodedToken = jwt_decode(this.data.token);
      console.log(decodedToken);

    },(error)=>{
      console.log('Error',error);
    });
  }

}
