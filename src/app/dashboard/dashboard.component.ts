import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { template } from '@angular/core/src/render3';
import { HostListener } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { ChatServiceService } from '../chat-service.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  //string to hold the message
  message: any
  socket;
  msg: String;
  type: string;
  myName: String;
  friendName: String;
  array1: String[] = []
  array2: String[] = []
  str: String;
  i = 0
  subs: Subscription;

  constructor( private snackbar: MatSnackBar, private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry, private chatService: ChatServiceService) {

   

    this.matIconRegistry.addSvgIcon(
      `add`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(`assets/person_add-24px.svg`)
    );

    this.subs = this.chatService.getClickEvent().subscribe(() => {

      this.openform();
    })

    this.subs = this.chatService.getClickEvent().subscribe(() => {

    //  this.createConnection();
    })
   
   console.log('In constructor')

   this.chatService.setupsocket();
   this.chatService.listenMessages()
 
  }

  ngOnInit() {
    
   

  }




  //setupSocketConnection() {
   //part moved to service
  // this.chatService.setupConnection();
   // from here i have copied
  
  

  //}

  @HostListener('document:keyup', ['$event'])
  handleDeleteKeyboardEvent(event: KeyboardEvent) {
    if (event.key !== 'Enter') {

      var typingMessage = localStorage.getItem('name') + " " + "typing....";

  //    this.socket.emit("typing", typingMessage);

    }
  }

  
 // createConnection(){

   // this.myName = localStorage.getItem('name');
    //this.friendName = localStorage.getItem('friendname');
    //this.array1 = Array.from(this.myName);
    //this.array2 = Array.from(this.friendName);
    //this.array1 = this.array1.concat(this.array2)
    //this.array1.sort();
    //this.str = this.array1.join('')

    //console.log(this.str)

 //   this.setupSocketConnection();
  //}

  sendMessage() {

    var temp_msg = localStorage.getItem('name')+ " "+ localStorage.getItem('friendname')

    this.chatService.wanttoChat(temp_msg)

    var name = localStorage.getItem('name')

    this.message = name + " : " + this.message

   this.chatService.sendMessage( this.message)


   this.message="";


  }

  close() {
    document.getElementById('form').style.display = 'none';
  }

  openform() {
    (<HTMLInputElement>document.getElementById("textarea")).value = ""
    document.getElementById('form').style.display = 'block';
  }



  
}