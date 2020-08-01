import { Component, OnInit } from '@angular/core';
import { userModel } from '../models/usermodel'
import { ChatServiceService } from '../chat-service.service';
import { Signup } from '../models/SignupModel';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { interval, Subscription} from 'rxjs';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username : string;
  password : string; 
  user: userModel
  signup : Signup[]=[]
  x : Number;
  sub : Subscription;

  constructor( private chatService : ChatServiceService, 
    private router : Router, private snackbar: MatSnackBar ) { 

    }

  ngOnInit() {
  localStorage.removeItem('name')
  
  // this.chatService.setupsocket();
   //this.sub= interval(100).subscribe((x =>{
    //this.chatService.showstatus(localStorage.getItem('name'))
//}));
  
  }

  login(){


    this.user = new userModel;

    this.user.userName = this.username;

    this.user.password = this.password

    this.chatService.getUsers(this.user.userName).subscribe(response => this.handleSuccessfulResponse(response))

    localStorage.setItem('name', this.username)


  }

  handleSuccessfulResponse( response ){

    this.x =0;
    this.signup=response
    for( var i=0; i<this.signup.length; i++){
      if(this.signup[i].userName == this.username)
      {
        this.x=1;
        this.snackbar.open('Logged In successfully!', '', {
          duration: 2000
        });
        this.router.navigate(['friends'])
      }
    }

    if(this.x==0){
      this.snackbar.open(' Incorrect username or password', '', {
        duration: 3000
      });
    }
  }

 signupbutton(){
   this.router.navigate(['signup'])
 }

}
