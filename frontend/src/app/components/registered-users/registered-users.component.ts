import { Component, OnInit } from '@angular/core';

interface User {
  name: string;
  email: string;
  username: string;
  password: string; // Hashed password (simulated bcrypt hash)
}

@Component({
  selector: 'app-registered-users',
  templateUrl: './registered-users.component.html',
  styleUrls: ['./registered-users.component.css']
})
export class RegisteredUsersComponent implements OnInit {
  users: User[] = [];

  ngOnInit(): void {
    this.users = [
      {
        name: 'Raj',
        email: 'Raj@gmail.com',
        username: 'rajendra',
        password: '$2b$10$XURPShQNCsLjp1ESc2laoObo9QZD0zG6ZISZ5TjG1fT5eYb8Z.x2G' 
      },
      {
        name: 'Raje',
        email: 'Rajes@gmail.com',
        username: 'rajendra',
        password: '$2b$10$XURPShQNCsLjp1ESc2laoObo9QZD0zG6ZISZ5TjG1fT5eYb8Z.x2G' 
      },
      {
        name: 'Raja',
        email: 'Raja@gmail.com',
        username: 'rajendra',
        password: '$2b$10$XURPShQNCsLjp1ESc2laoObo9QZD0zG6ZISZ5TjG1fT5eYb8Z.x2G' 
      }
    ];
  }
}