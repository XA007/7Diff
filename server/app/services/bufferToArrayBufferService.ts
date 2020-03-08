export class BufferToArrayBufferService {

public bufferToArrayBuffer(buffer: Buffer): ArrayBuffer {
    const arrayBuffer: ArrayBuffer = new ArrayBuffer(buffer.length);
    const uint8Array: Uint8Array = new Uint8Array(arrayBuffer);
    for (let i: number = 0; i < buffer.length; ++i) {
        uint8Array[i] = buffer[i];
    }

    return arrayBuffer;
  }
}
