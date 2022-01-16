import { Component, OnInit } from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { MatButton } from '@angular/material/button';
import {MatChipsModule} from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SocialAuthService, GoogleLoginProvider, SocialUser, FacebookLoginProvider } from 'angularx-social-login';
import { Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'login-info-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  @Output() userEvent = new EventEmitter<Object>();

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<LoginPageComponent>, 
    private authService: SocialAuthService,
    private _snackBar: MatSnackBar,
    ) {}
  
  // angularx plugin variables
  socialUser!: SocialUser;
  isLoggedin: boolean = false;

  // local variable
  localUser = {
    isLoggedIn : false,
    username : "Guest",
    userType : "Guest",
    userAvatar : "https://dare.webjuice.ro/starred.png",
    dareCount: 0,
    dareTypeCount: 0
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      verticalPosition: 'top',});
  }

  ngOnInit(): void {

    try{
      this.refreshToken()
    }
    catch(error){
      console.error("No google account previously signed in.");
    }

    this.authService.authState.subscribe((user) => {
      this.socialUser = user; // init plugin vars
      this.isLoggedin = (user != null);

      if (user != null){ // init locals
        this.localUser.isLoggedIn = true;
        this.localUser.username = this.socialUser.name;
        this.localUser.userType = this.socialUser.provider;
        this.localUser.userAvatar = this.socialUser.photoUrl;
        // push id to backend and check if already existing + get data
      }
      else{
        this.localUser = {
          isLoggedIn : false,
          username : "Guest",
          userType : "Guest",
          userAvatar : "https://dare.webjuice.ro/starred.png",
          dareCount: 0,
          dareTypeCount: 0
        }
      }
      this.userEvent.emit(this.localUser);
      console.log(this.socialUser);
    });
  }
  

 //bottom sheet
  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

  dismiss(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }



  //google login stuff
  async signInWithGoogle(): Promise<void> {
    await this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    if (this.localUser.isLoggedIn){
      this.openSnackBar("Successfully logged in!", "ok")
    }
  }


  //facebook login
  async signInWithFB(): Promise<void> {
    await this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    if (this.localUser.isLoggedIn) {
      this.openSnackBar("Successfully logged in!", "ok")
    }
  }


  //global signout
  async signOut(): Promise<void> {
    await this.authService.signOut();
    console.log(this.localUser.isLoggedIn);
    if (!this.localUser.isLoggedIn) {
      this.openSnackBar("Successfully logged out!", "ok")
    }
  }
  
  //google refresh token
  refreshToken(): void {
    this.authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  }




}
