import '@testing-library/jest-dom'
//setupTests.tsx
const nodeCrypto = require('crypto')
// @ts-expect-error
window.crypto = {
  getRandomValues: function (buffer) {
    return nodeCrypto.randomFillSync(buffer)
  },
}
const { TextEncoder, TextDecoder } = require('web-encoding')
if (!global.TextEncoder) {
  global.TextEncoder = TextEncoder
}
if (!global.TextDecoder) {
  global.TextDecoder = TextDecoder
}
