import {Directive, ElementRef, EventEmitter, HostListener, Output} from "@angular/core";
import {ClickEvent} from "../../../../common/ClickEvent";

@Directive({
  selector: "[appMouseClick]",
})
export class MouseClickDirective {

  public readonly SECONDS_IN_MS: number = 1000;

  public click: ClickEvent;
  public lastClickTimeStamp: number;

  @Output() public messageEvent: EventEmitter<ClickEvent> = new EventEmitter<ClickEvent>();

  public constructor(private el: ElementRef) {

    this.lastClickTimeStamp = 0;
    this.click = new class implements ClickEvent {
      public timeStamp: number;
      public offsetX: number;
      public offsetY: number;
      public clientX: number;
      public clientY: number;
    };
  }

  /**
   *
   * @param event: MouseEvent
   * capture the click position and send-it to simple-Game
   */
  @HostListener("click", ["$event"])
  public getMouseClickCoords(event: MouseEvent): void {
    if (this.el.nativeElement.contains(event.target)) {

      this.click.timeStamp = ((event.timeStamp - this.lastClickTimeStamp) / this.SECONDS_IN_MS);
      this.lastClickTimeStamp = event.timeStamp;
      this.click.offsetX = event.offsetX;
      this.click.offsetY = event.offsetY;
      this.click.clientX = event.clientX;
      this.click.clientY = event.clientY;

      this.messageEvent.emit(this.click);
    }
  }

}
