import {Injectable, OnInit} from "@angular/core";
import {Subscription} from "rxjs";
import {SocketClientService} from "./socket-client.service";

@Injectable({
  providedIn: "root",
})
export class EventsLogService implements OnInit {

  public soloGameEvents: string[];
  public ioConnection: Subscription;

  public constructor(private socketService: SocketClientService) {
    this.soloGameEvents = [];
  }

  public ngOnInit(): void {
    this.getEventMessage();
  }

  public getEventMessage(): string[] {
    this.socketService.initSocket();
    this.ioConnection = this.socketService.onMessage()
      .subscribe((message: string) => {
        this.soloGameEvents.push(message);
      });

    return this.soloGameEvents;
  }

  public getPersonalMessage(message: string): void {
    const date: Date = new Date();
    const dateText: string = date.toTimeString().split(" ")[0];
    const datedMessage: string = dateText + " " + message;
    this.soloGameEvents.push(datedMessage);
  }

  public sendMessageToAll(message: string): void {
    const date: Date = new Date();
    const dateText: string = date.toTimeString().split(" ")[0];
    const datedMessage: string = dateText + " " + message;
    this.socketService.send(datedMessage);
  }
}
