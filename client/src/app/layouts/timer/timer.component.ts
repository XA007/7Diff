import {Component, Input} from "@angular/core";

@Component({
  selector: "app-timer",
  templateUrl: "./timer.component.html",
  styleUrls: ["./timer.component.css"],
})
export class TimerComponent {

  @Input() public gameName: string;
  @Input() public timer: string;

}
