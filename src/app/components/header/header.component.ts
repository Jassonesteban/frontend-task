import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthModalService } from '../../service/auth-modal.service';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  isLoggedIn = false;
  userName:string | null = null;
  userData:any = null;

  constructor(private authModalService: AuthModalService, private authService:AuthService){}

  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe(status => {
      this.isLoggedIn = status;
    });

   this.authService.getUser().subscribe(user => {
    this.userData = user;
    this.userName = user ? user.username : "No logueado"
   });

  }

  logout(){
    this.authService.logout();
  }


}
