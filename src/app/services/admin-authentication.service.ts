export class AdminAuthenticationService {

  admin: boolean = false;

  isAdmin(){
    this.admin = true;
  }

  isNotAdmin(){
    this.admin = false;
  }

  isAuthenticated(){
    return this.admin;
  }
}
