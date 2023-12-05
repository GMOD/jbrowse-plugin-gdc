import '@testing-library/jest-dom'
//setupTests.tsx
const nodeCrypto = require('crypto')
// @ts-expect-error
window.crypto = {
  getRandomValues: function (buffer) {
    return nodeCrypto.randomFillSync(buffer)
  },
}
