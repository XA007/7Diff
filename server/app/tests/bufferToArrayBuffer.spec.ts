import { assert } from "chai";
import {BufferToArrayBufferService} from "../services/bufferToArrayBufferService";

describe("bufferToArrayBuffer function", async () => {

  const bufferToArrayBuffer: BufferToArrayBufferService = new BufferToArrayBufferService();
  const buffer: Buffer = new Buffer("");

  it("Should return an array buffer when bufferToArrayBuffer is passed a buffer", () => {
    assert.instanceOf(bufferToArrayBuffer.bufferToArrayBuffer(buffer), ArrayBuffer);
  });
});
