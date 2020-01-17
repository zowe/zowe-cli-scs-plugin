/*
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright Contributors to the Zowe Project.
 */

// __mocks__/keytar.js
"use strict";

const keytar = jest.genMockFromModule("keytar");

let mockKeyring = {};

function getPassword(service, account) {
  if (mockKeyring.hasOwnProperty(service)) {
    return mockKeyring[service][account];
  }
  return null;
}

function setPassword(service, account, password) {
  if (!mockKeyring.hasOwnProperty(service)) {
    mockKeyring[service] = {};
  }
  mockKeyring[service][account] = password;
}

function deletePassword(service, account) {
  if (!mockKeyring.hasOwnProperty(service)) {
    return false;
  }
  if (Object.keys(mockKeyring[service]).indexOf(account) === -1) {
    return false;
  }
  delete mockKeyring[service][account];
  return true;
}

function __setMockKeyring(keyring) {
  mockKeyring = JSON.parse(JSON.stringify(keyring));
}

function __getMockKeyring() {
  return mockKeyring;
}

// Mock implementations
keytar.__setMockKeyring = __setMockKeyring;
keytar.__getMockKeyring = __getMockKeyring;
keytar.getPassword = getPassword;
keytar.setPassword = setPassword;
keytar.deletePassword = deletePassword;

module.exports = keytar;
