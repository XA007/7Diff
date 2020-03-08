import {Component, Input} from "@angular/core";
import {HomeComponent} from "../home.component";

@Component({
  selector: "app-navigation-bar",
  templateUrl: "./navigation-bar.component.html",
  styleUrls: ["./navigation-bar.component.css"],
})
export class NavigationBarComponent {

  @Input() public username: string;
  public home: HomeComponent;
}
