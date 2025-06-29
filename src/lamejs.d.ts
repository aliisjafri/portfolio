declare module '@breezystack/lamejs' {
  export class Mp3Encoder {
    constructor(channels: number, sampleRate: number, kbps: number)
    encodeBuffer(left: Int16Array, right?: Int16Array): Uint8Array
    flush(): Uint8Array
  }

  export const MPEGMode: {
    STEREO: number
    JOINT_STEREO: number
    DUAL_CHANNEL: number
    MONO: number
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const Lame: any
}
