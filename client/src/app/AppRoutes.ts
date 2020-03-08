import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AboutComponent} from "./about/about.component";
import {AdminComponent} from "./admin/admin.component";
import {AppComponent} from "./app.component";
import {FreeGameViewComponent} from "./free-game-view/free-game-view.component";
import {FreeMultiPlayerComponent} from "./free-multi-player/free-multi-player.component";
import {HomeComponent} from "./home/home.component";
import {WaitingComponent} from "./layouts/waiting/waiting.component";
import {SignInComponent} from "./sign-in/sign-in.component";
import {SimpleGameViewComponent} from "./simple-game-view/simple-game-view.component";
import {SimpleMultiPlayerComponent} from "./simple-multi-player/simple-multi-player.component";

const routes: Routes = [
  {path: "", redirectTo: "/signin", pathMatch: "full"},
  {path: "signin", component: SignInComponent},
  {path: "SimpleView/:gameName/:username", component: SimpleGameViewComponent},
  {path: "home/:username", component: HomeComponent},
  {path: "home", redirectTo: "/signin"},
  {path: "admin", component: AdminComponent},
  {path: "SimpleView/multiPlayer/:gamename/:player/:opponent", component: SimpleMultiPlayerComponent},
  {path: "", component: AppComponent},
  {path: "FreeView/:gameName/:username", component: FreeGameViewComponent},
  {path: "FreeView/multiPlayer/:gamename/:player/:opponent", component: FreeMultiPlayerComponent},
  {path: "FreeView", component: FreeGameViewComponent},
  {path: "waiting/:gameName/:username", component: WaitingComponent},
  {path: "about", component: AboutComponent},
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
  ],
  exports: [ RouterModule ],
  declarations: [],
})

export class AppRoutes {}
