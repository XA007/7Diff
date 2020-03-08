import { Injectable } from "@angular/core";
import {Observable} from "rxjs";
import {TimeModel} from "../Models/Time-Model";

@Injectable({
  providedIn: "root",
})
export class TimerService {

  public watch: TimeModel;
  public interval: number;

  public constructor() {
    this.watch = { seconds: 0, minutes: 0, timerMMSS: "00:00"};

  }

  /**
   * @toTwoDigitsString()
   * return value : A string in format MM Or SS
   **/
  private static toTwoDigitsString(digit: number): string {

    const minTwoDigitNumber: number = 10;

    return (digit < minTwoDigitNumber ? "0" : "") + digit;

  }

  /**
   * @formatTimeMMSS()
   * take two string parameters respectively in format MM, SS;
   * return value : A string in format MM:SS
   **/
  private static formatTimeMMSS(minutes: string, seconds: string): string {

    return minutes + " : " + seconds;

  }

  public resetTimer(): void {
    this.watch = { seconds: 0, minutes: 0, timerMMSS: "00:00"};
  }

  /**
   * @StartTimer()
   * return value : An Observable<TimeModel> indicating the seconds and minutes passed from initialisation
   * TimeModel structure : { minutes: number, seconds: number, timerMMSS: string}
   **/
  public startTimer(): Observable<TimeModel> {

    return new Observable((timer) => {

      const maxUnitTimeValue: number = 60;
      const oneSecondIntervalInMlSeconds: number = 1000;
      if (this.interval) {
        clearInterval(this.interval);
      }
      this.interval = window.setInterval(() => {
        const futureValueOfSeconds: number = this.watch.seconds + 1;

        this.watch.minutes = (futureValueOfSeconds === maxUnitTimeValue) ? this.watch.minutes + 1 : this.watch.minutes;
        this.watch.seconds = (futureValueOfSeconds === maxUnitTimeValue) ? this.watch.seconds = 0 : this.watch.seconds + 1;

        const twoDigitsMinutes: string = TimerService.toTwoDigitsString(this.watch.minutes);
        const twoDigitsSeconds: string = TimerService.toTwoDigitsString(this.watch.seconds);

        this.watch.timerMMSS = TimerService.formatTimeMMSS(twoDigitsMinutes, twoDigitsSeconds);

        timer.next(this.watch);
      },                                 oneSecondIntervalInMlSeconds);

    });

  }

}
