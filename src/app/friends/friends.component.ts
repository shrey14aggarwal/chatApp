import { Component, OnInit, ViewChild } from '@angular/core';
import { ChatServiceService } from '../chat-service.service';
import { Signup } from '../models/SignupModel';
import * as io from 'socket.io-client'
import { friendRequest } from '../models/friend-request';
import { userModel } from '../models/usermodel';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { friendModel } from '../models/friend';
import { interval, Subscription} from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatSort} from '@angular/material/sort';





@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {

  signup: Signup[] = []
  dataSource;
  dataSource2;
  dataSource3;
  socket;
  friendrequestModel: friendRequest;
  newFriendRequests: Signup[] = [];
  incomingRequests: String[] = [];
  sentRequests: String[] = [];
  buttonMessage: String;
  disable = false;
  friends: String[] = [];
  show = false;
  dataSource3_length: number[] = [];
  id: string;
  message: any;
  array: String[] = [];
  str: String;
  myName: String;
  friendName: String;
  array1: String[] = []
  array2: String[] = []
  messagearray: String[] = [];
  status:String;

  friend_model : friendModel[]=[];

  

  constructor(private chatService: ChatServiceService,
    private router: Router, private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry, private snackbar: MatSnackBar) {

      this.matIconRegistry.addSvgIcon(
      `add`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(`assets/person_add-24px.svg`)
    );

    this.matIconRegistry.addSvgIcon(
      `done`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(`assets/done-24px.svg`)
    );

    this.matIconRegistry.addSvgIcon(
      `chat`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(`assets/chat-24px.svg`)
    );

    this.matIconRegistry.addSvgIcon(
      `online`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(`assets/online.svg`)
    );


    this.chatService.setupsocket();
    //this.chatService.handleRequest();
   
    

    this.chatService.pageRefreshed(localStorage.getItem('name'));

     
    this.socket = io('localhost:3000')

   
    this.socket.on('fromrequest', (msg) => {

      var from = msg.substr(0, msg.indexOf(' '));
      var to = msg.substr(msg.indexOf(' ') + 1);

      if (to == localStorage.getItem('name')) {
        this.messagearray.push(from)
        this.chatService.getIncomingRequests(localStorage.getItem('name')).subscribe(response => this.handleSuccessfulResponse1(response))

      }
    })

    this.socket.on('requestconfirmed', (msg)=>{
      var from = msg.substr(0, msg.indexOf(' '));
      var to = msg.substr(msg.indexOf(' ') + 1);
      if (to == localStorage.getItem('name')) {
        console.log('from is ', from)
        this.chatService.getUsers(localStorage.getItem('name')).subscribe(response => this.handleSuccessfulResponse2(response))

      this.checksentRequest(to)
      }
    })
   
  //status online from here
  this.socket.on('iamrefreshed',(msg)=>{
    this.chatService.showstatus(localStorage.getItem('name'))
    this.socket.on('statusonline',(msg)=>{

      if(!(msg==localStorage.getItem('name'))){
      this.status = msg;}
      console.log(this.status, "status")
    })
  })

  this.socket.on('statusoffline',(msg)=>{
    this.status='offline'
  })

  
  }
  

  ngOnInit() {

    

    this.chatService.setupsocket();

    
    this.chatService.showstatus(localStorage.getItem('name'))

    this.chatService.setupsocket();

    this.chatService.getAllUsers().subscribe(response => this.handleSuccessfulResponse(response))

    this.chatService.setupConnection();
    // this.socket = io('localhost:3000')

    //check if there is an incoming message

    this.chatService.getIncomingRequests(localStorage.getItem('name')).subscribe(response => this.handleSuccessfulResponse1(response))

    this.chatService.getUsers(localStorage.getItem('name')).subscribe(response => this.handleSuccessfulResponse2(response))

  }

  handleSuccessfulResponse1(response) {
    this.newFriendRequests = response;
    for (let i = 0; i < this.newFriendRequests.length; i++) {
      this.incomingRequests = (this.newFriendRequests[i].incomingRequests)
    }

    this.dataSource2 = this.incomingRequests;
  }

  handleSuccessfulResponse2(response) {

    this.newFriendRequests = response;
    for (let i = 0; i < this.newFriendRequests.length; i++) {
      this.sentRequests = (this.newFriendRequests[i].sentRequests)
      this.friends = this.newFriendRequests[i].friend;
     
    }

   

    for (let i = 0; i < this.friends.length; i++) {
      this.dataSource3_length.push(i)
    }
   
    this.dataSource3 = this.friends;


  }

  setupSocketConnection() {
    this.socket = io('localhost:3000')

  }

  handleSuccessfulResponse(response) {
    this.signup = response
    console.log(this.signup)

    for (let i = 0; i < this.signup.length; i++) {
      if (this.signup[i].userName == localStorage.getItem('name')) {
        this.signup.splice(i, 1)
      }
    }
    console.log(this.signup)
    this.dataSource = this.signup
  }

  displayedColumns: string[] = ['First Name', 'Last Name', 'User Name', 'Add Friend'];
  displayedColumns2: string[] = ['Friend Requests', 'Confirm'];
  displayedColumns3: string[] = ['Friends', 'Chat', 'Status'];



  addFriend(username) {
    this.friendrequestModel = new friendRequest();
    this.friendrequestModel.username = localStorage.getItem('name')
    this.friendrequestModel.friend = username

    this.chatService.addFriend(username)

    // at this point the request is added in the database
    this.chatService.addFriendRequest(this.friendrequestModel).subscribe(data => {
    })

    // it sends over the channel that a new request has arrived
    // this.socket.emit('to', username)
    var message = localStorage.getItem('name') + " " + username;
    this.socket.emit('fromto', message)


    window.location.reload();

  }

  checksentRequest(username) {

    if (this.sentRequests.indexOf(username) != -1) {
      this.buttonMessage = "Request Sent"
      return true;
    }

    if (this.friends.indexOf(username) != -1) {
      this.buttonMessage = "Friends"
      return true;
    }

    else {
      this.buttonMessage = "Send Request"
      return false;

    }
  }

  confirm(friend_name) {

    this.friendrequestModel = new friendRequest();
    this.friendrequestModel.username = localStorage.getItem('name');
    this.friendrequestModel.friend = friend_name;

    this.chatService.confirmRequest(this.friendrequestModel).subscribe(data => {
      console.log('friend confirmed');
    })

    var confirmed_message = localStorage.getItem('name') + " " + friend_name;
    this.socket.emit('confirmed', confirmed_message);

    window.location.reload();
  }

  chat(username, event) {

    this.chatService.disconnect();


    localStorage.setItem('friendname', username)
    this.show = true;

    var message_alert = localStorage.getItem('name') + localStorage.getItem('friendname');

    var name = localStorage.getItem('name')

    // shows that someone wants to connect
    this.chatService.newMessage(message_alert)


    //join a room 


    this.chatService.sendClickEvent();

    this.show = true;

    this.id = (event.target.id)

  }

  align() {
    document.getElementById("myForm").style.display = "none";

  }

  logout() {
    localStorage.removeItem('name')
    this.chatService.showoffline('offline')
    this.router.navigate(['login'])
  }

  

}
