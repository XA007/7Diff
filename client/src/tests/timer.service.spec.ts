import { TestBed } from "@angular/core/testing";
import {Observable} from "rxjs";
import {TimeModel} from "../Models/Time-Model";
import { TimerService } from "../services/timer.service";

describe("TimerService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: TimerService = TestBed.get(TimerService);
    expect(service).toBeTruthy();
  });
});

describe("startTimer function", () => {
  let timer: TimerService;
  let obs: Observable<TimeModel>;
  let chronometer: string;
  const testTime: number = 2000;
  beforeEach(() => {
    timer = new TimerService();
    obs = timer.startTimer();
  });

  it("should return the right time '00 : 02'",  (done) => {
    obs.subscribe((chrono) => {
      chronometer = chrono.timerMMSS;
    });

    setTimeout(() => {
      expect(chronometer).toEqual("00 : 02");
      done();
    },         testTime);
  });

  it("should return the right time '01 : 01'",  (done) => {
    const lastSecondBeforeMinutes: number = 59;
    timer.watch.seconds = lastSecondBeforeMinutes;
    obs.subscribe((chrono) => {
      chronometer = chrono.timerMMSS;
    });

    setTimeout(() => {
      expect(chronometer).toEqual("01 : 01");
      done();
    },         testTime);
  });

  it("should return the right time '00 : 12'",  (done) => {
    const twoDigitsSecondValue: number = 10;
    timer.watch.seconds = twoDigitsSecondValue;
    obs.subscribe((chrono) => {
      chronometer = chrono.timerMMSS;
    });

    setTimeout(() => {
      expect(chronometer).toEqual("00 : 12");
      done();
    },         testTime);
  });
});
