import { Injectable } from "@angular/core";
import { User } from "../../models/user.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import "rxjs/add/operator/map";

import swal from "sweetalert";
import { Router } from "@angular/router";

@Injectable()
export class UserService {
  user: User;
  token: string;

  constructor(public http: HttpClient, public router:Router) {
    this.loadStorage();
  }

  saveStorage(id: string, token: string, user: User) {
    localStorage.setItem("id", id);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    this.user = user;
    this.token = token;
  }

  loadStorage(){
    if(localStorage.getItem('token')){
      this.token = localStorage.getItem('token');
      this.user = JSON.parse(localStorage.getItem('user'));
    }else{
      this.token = '';
      this.user = null;
    }
  }

  loginGoogle(token: string) {
    let url = `${environment.backend}/login/google`;

    return this.http.post(url, { token }).map((response: any) => {
      this.saveStorage(response.id, response.token, response.user);
      return true;
    });
  }

  login(user: User, remember: boolean = false) {
    if (remember) localStorage.setItem("email", user.email);
    else localStorage.removeItem("email");

    let url = `${environment.backend}/login`;

    return this.http.post(url, user).map((response: any) => {
      this.saveStorage(response.id, response.token, response.user);

      return true;
    });
  }

  createUser(user: User) {
    let url = `${environment.backend}/user`;

    return this.http.post(url, user).map((response: any) => {
      swal("User created", user.email, "success");
      return response.user;
    });
  }

  isLogued(){
    return (this.token.length > 5) ? true : false;
  }

  logout(){
    this.user = null;
    this.token = '';

    localStorage.removeItem('token');
    localStorage.removeItem('user');

    this.router.navigate(['/login']);
  }
}
