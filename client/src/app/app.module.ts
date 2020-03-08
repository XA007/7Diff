import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import {NgbActiveModal, NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {ImageProcessingService} from "../services/image-processing.service";
import { SignInService } from "../services/sign-in.service";
import {TimerService} from "../services/timer.service";
import { UserDBManagerService } from "../services/user-dbmanager.service";
import { AppRoutes } from "./AppRoutes";
import { AboutComponent } from "./about/about.component";
import { AdminComponent } from "./admin/admin.component";
import { AppComponent } from "./app.component";
import { MouseClickDirective } from "./directives/mouse-click.directive";
import {FreeGameViewComponent} from "./free-game-view/free-game-view.component";
import { FreeMultiPlayerComponent } from "./free-multi-player/free-multi-player.component";
import { FreeGameCreationComponent } from "./game-creation/free-game-creation/free-game-creation.component";
import { SimpleGameCreationComponent } from "./game-creation/simple-game-creation/simple-game-creation.component";
import { HomeComponent } from "./home/home.component";
import { NavigationBarComponent } from "./home/navigation-bar/navigation-bar.component";
import { ViewModeComponent } from "./home/view-mode/view-mode.component";
import { CardComponent } from "./layouts/card/card.component";
import { EndComponent } from "./layouts/end/end.component";
import { EventsLogComponent } from "./layouts/envents-log/events-log.component";
import { GameBarMultiPlayerComponent } from "./layouts/game-bar-multi-player/game-bar-multi-player.component";
import { GameBarComponent } from "./layouts/game-bar/game-bar.component";
import { GameLoaderComponent } from "./layouts/game-loader/game-loader.component";
import { LeaderBoardComponent } from "./layouts/leader-board/leader-board.component";
import {LoadingSpinnerComponent} from "./layouts/loading-spinner/loading-spinner.component";
import { ScoreSectionComponent } from "./layouts/score-section/score-section.component";
import {ScoreStatusComponent} from "./layouts/score-status/score-status.component";
import { TimerComponent } from "./layouts/timer/timer.component";
import {WaitingComponent} from "./layouts/waiting/waiting.component";
import { SignInComponent } from "./sign-in/sign-in.component";
import { SimpleGameViewComponent } from "./simple-game-view/simple-game-view.component";
import { SimpleMultiPlayerComponent } from "./simple-multi-player/simple-multi-player.component";

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    HomeComponent,
    NavigationBarComponent,
    CardComponent,
    HomeComponent,
    AdminComponent,
    SimpleGameCreationComponent,
    FreeGameCreationComponent,
    SimpleGameViewComponent,
    MouseClickDirective,
    EventsLogComponent,
    LeaderBoardComponent,
    GameBarComponent,
    ViewModeComponent,
    FreeGameViewComponent,
    WaitingComponent,
    ScoreStatusComponent,
    LoadingSpinnerComponent,
    GameLoaderComponent,
    EndComponent,
    SimpleMultiPlayerComponent,
    GameBarMultiPlayerComponent,
    ScoreSectionComponent,
    TimerComponent,
    FreeMultiPlayerComponent,
    AboutComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutes,
    NgbModule.forRoot(),
  ],
  providers: [
    SignInService,
    NgbActiveModal,
    UserDBManagerService,
    TimerService,
    ImageProcessingService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    SimpleGameCreationComponent,
    FreeGameCreationComponent,
  ],
})
export class AppModule { }
