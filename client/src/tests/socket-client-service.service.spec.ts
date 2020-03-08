import { TestBed } from "@angular/core/testing";

import { SocketClientService } from "../services/socket-client.service";

describe("SocketClientService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: SocketClientService = TestBed.get(SocketClientService);
    expect(service).toBeTruthy();
  });

  it("should call socket.emit when send is called", () => {
    const service: SocketClientService = TestBed.get(SocketClientService);
    spyOn(service["socket"], "emit").and.callThrough();
    service.send("testMessage");
    expect(service["socket"].emit).toBeTruthy();
  });
});
