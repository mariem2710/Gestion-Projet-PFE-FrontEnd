import { Component, NgModule, OnInit } from '@angular/core';
import { UserService, User, Role } from '../../services/user.service';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-users',
  imports:[NgFor,NgIf,FormsModule],
  templateUrl: './admin-users.component.html',
  styleUrl:'./admin-users.component.css'
})
export class AdminUsersComponent implements OnInit {

  users: User[] = [];

  selectedUser: User = {
    nom: '',
    prenom: '',
    email: '',
    password: '',
    role: Role.METIER
  };

  isEdit = false;

  roles = Object.values(Role);

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe(data => {
      this.users = data;
    });
  }

  saveUser() {
    if (this.isEdit && this.selectedUser.id) {
      this.userService.updateUser(this.selectedUser.id, this.selectedUser)
        .subscribe(() => {
          this.resetForm();
          this.loadUsers();
        });
    } else {
      this.userService.createUser(this.selectedUser)
        .subscribe(() => {
          this.resetForm();
          this.loadUsers();
        });
    }
  }

  editUser(user: User) {
    this.selectedUser = { ...user };
    this.isEdit = true;
  }

  deleteUser(id?: number) {
    if (!id) return;
    this.userService.deleteUser(id).subscribe(() => {
      this.loadUsers();
    });
  }

  resetForm() {
    this.selectedUser = {
      nom: '',
      prenom: '',
      email: '',
      password: '',
      role: Role.METIER
    };
    this.isEdit = false;
  }
}