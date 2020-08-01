import { Component, OnInit } from '@angular/core';
import { Signup } from '../models/SignupModel';
import { ChatServiceService } from '../chat-service.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signup : Signup;
  firstName : String;
  lastName : String;
  userName : String;
  password : String;
  signup_users : Signup[]=[];
  count : Number;
 

  constructor(  private chatService : ChatServiceService,
    private router: Router, private snackbar: MatSnackBar ) { }

  ngOnInit() {
    localStorage.removeItem('name')
  }

  submit(){

    this.signup = new Signup();
    this.signup.firstName = this.firstName;
    this.signup.lastName = this.lastName;
    this.signup.userName = this.userName;
    this.signup.password = this.password;

    this.chatService.getAllUsers().subscribe(response => this.handleSuccessfulResponse(response))

  


  }

  handleSuccessfulResponse(response){

    this.count = 0;
    this.signup_users = (response);
    for(let i =0; i < this.signup_users.length; i++){
      if(this.signup_users[i].userName==this.userName && this.signup_users[i].password==this.password){

        this.snackbar.open('   Username and Password already exists', '', {
          duration: 3000
        });

        this.count = 1;
      }
    }
    console.log(this.count)
    if(this.count==0){

      console.log(this.count)

      this.chatService.signup(this.signup).subscribe( data =>{
        console.log(data);
      });

      this.router.navigate(['login'])
    }

  }

  login(){
    this.router.navigate(['login'])
  }
}
