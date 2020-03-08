import { TestBed } from "@angular/core/testing";

import { EventsLogService } from "../services/events-log.service";
import {SocketClientService} from "../services/socket-client.service";

describe("EventsLogService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: EventsLogService = TestBed.get(EventsLogService);
    expect(service).toBeTruthy();
  });

  it("should call getEventMessage on init", () => {
    const service: EventsLogService = TestBed.get(EventsLogService);
    spyOn(service, "getEventMessage");
    service.ngOnInit();
    expect(service.getEventMessage).toHaveBeenCalled();
  });

  it("should add message in soloGameEvents when getPersonalMessage is called", () => {
    const service: EventsLogService = TestBed.get(EventsLogService);
    service.getPersonalMessage("TestMessage");
    expect(service.soloGameEvents.length).toEqual(1);
  });

  it("should call socketService.send when sendMessageToAll is called", () => {
    const service: EventsLogService = TestBed.get(EventsLogService);
    const socketService: SocketClientService = TestBed.get(SocketClientService);
    spyOn(socketService, "send").and.stub();
    service.sendMessageToAll("TestMessage");
    expect(socketService.send).toHaveBeenCalled();
  });

  it("should call socketService.initSocket when getEventMessage is called", () => {
    const service: EventsLogService = TestBed.get(EventsLogService);
    const socketService: SocketClientService = TestBed.get(SocketClientService);
    spyOn(socketService, "initSocket").and.stub();
    service.getEventMessage();
    expect(socketService.initSocket).toHaveBeenCalled();
  });
});
