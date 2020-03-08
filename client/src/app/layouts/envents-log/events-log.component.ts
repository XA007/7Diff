import {Component, Input} from "@angular/core";

@Component({
  selector: "app-events-log",
  templateUrl: "./events-log.component.html",
  styleUrls: ["./events-log.component.css"],
})
export class EventsLogComponent {

  @Input() public eventsLog: string[];
}
