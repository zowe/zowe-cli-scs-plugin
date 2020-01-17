/*
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright Contributors to the Zowe Project.
 */

jest.mock("keytar");
const keytar = require("keytar"); // tslint:disable-line
import KeytarCredentialManager = require("../../src/credentials/KeytarCredentialManager");

import { AbstractCredentialManager } from "@zowe/imperative";
import * as C from "../__src__/KeytarConstants";

describe("KeytarCredentialManager", () => {
  describe("Test Service", () => {
    let manager: any = null;
    beforeAll(async () => {
      manager = new KeytarCredentialManager(C.SERVICE, C.DISPLAY_NAME);
      await manager.initialize();
    });

    beforeEach(async () => {
      keytar.__setMockKeyring(C.TEST_CREDENTIALS);
    });

    it("should be an instance of AbrstractCredentialManager", () => {
      expect(manager instanceof AbstractCredentialManager).toBe(true);
    });

    it("should remove credentials from the storage, along with all matching conflicts", async () => {
      let err;
      const expected = {
        [C.SERVICE]: {
          [C.ACC2]: Buffer.from(C.PASS2).toString("base64")
        },
        [C.SERVICE2]: {
          [C.ACC2]: Buffer.from(C.SERVICE2PASS2).toString("base64"),
          [C.ACC3]: Buffer.from(C.SERVICE2PASS3).toString("base64")
        },
        [C.SERVICE3]: {
          [C.ACC2]: Buffer.from(C.SERVICE3PASS2).toString("base64"),
          [C.ACC3]: Buffer.from(C.SERVICE3PASS3).toString("base64")
        }
     };

      try {
        await manager.delete(C.ACC1);
      }
      catch (e) {
        err = e;
      }
      expect(err).toBeUndefined();
      expect(keytar.__getMockKeyring()).toEqual(expected);
    });

    it("should fail removing non-existing credentials", async () => {
      let err;

      try {
        await manager.delete(C.ACC4);
      }
      catch (e) {
        err = e;
      }
      expect(err).toBeDefined();
      expect(err).toMatchSnapshot();
    });

    it("should retrieve credentials from the storage from the provided test service", async () => {
      let err;
      let result;
      try {
        result = await manager.load(C.ACC2);
      }
      catch (e) {
        err = e;
      }
      expect(err).toBeUndefined();
      expect(result).toEqual(C.PASS2);
    });

    it("should fail load credentials that was not stored before", async () => {
      let err;
      let result;
      try {
        result = await manager.load(C.ACC4);
      }
      catch (e) {
        err = e;
      }
      expect(err).toBeDefined();
      expect(result).toBeUndefined();
      expect(err).toMatchSnapshot();
    });

    it("should securely store credentials to the plugin service without any conflicts", async () => {
      let err;
      const expected = Buffer.from(C.PASS4).toString("base64");
      try {
        await manager.save(C.ACC4, C.PASS4);
      }
      catch (e) {
        err = e;
      }
      expect(err).toBeUndefined();
      const keyring = keytar.__getMockKeyring();
      expect(keyring[C.PLUGIN_SERVICE]).toBeDefined();
      expect(keyring[C.PLUGIN_SERVICE][C.ACC4]).toBeDefined();
      expect(keyring[C.PLUGIN_SERVICE][C.ACC4]).toEqual(expected);
    });

    it("should securely store credentials to the plugin service and remove any conflicts from other services", async () => {
      let err;
      const expected = {
        [C.SERVICE]: {
          [C.ACC1]: Buffer.from(C.PASS1).toString("base64"),
          [C.ACC2]: Buffer.from(C.PASS2).toString("base64")
        },
        [C.SERVICE2]: {
          [C.ACC1]: Buffer.from(C.SERVICE2PASS1).toString("base64"),
          [C.ACC2]: Buffer.from(C.SERVICE2PASS2).toString("base64")
        },
        [C.SERVICE3]: {
          [C.ACC1]: Buffer.from(C.SERVICE3PASS1).toString("base64"),
          [C.ACC2]: Buffer.from(C.SERVICE3PASS2).toString("base64")
        },
        [C.PLUGIN_SERVICE]: {
          [C.ACC3]: Buffer.from(C.PASS3).toString("base64")
        }
      };
      try {
        await manager.save(C.ACC3, C.PASS3);
      }
      catch (e) {
        err = e;
      }
      expect(err).toBeUndefined();
      expect(keytar.__getMockKeyring()).toEqual(expected);
    });
  });

  describe("Handling breaking changes", () => {
    let manager: KeytarCredentialManager = null;
    beforeAll(async () => {
      manager = new KeytarCredentialManager(C.SERVICE2, C.DISPLAY_NAME2);
      await manager.initialize();
    });

    beforeEach(async () => {
      keytar.__setMockKeyring(C.CREDENTIALS_WITH_BREAKING_CHANGES);
    });

    it("should handle user vs username breaking change", async () => {
      let err;
      let result;
      try {
        result = await manager.load(C.ACCT_USERNAME);
      }
      catch (e) {
        err = e;
      }
      expect(err).toBeUndefined();
      expect(result).toEqual(C.TEST_USERNAME);
    });

    it("should handle pass vs password breaking change", async () => {
      let err;
      let result;
      try {
        result = await manager.load(C.ACCT_PASS);
      }
      catch (e) {
        err = e;
      }
      expect(err).toBeUndefined();
      expect(result).toEqual(C.TEST_PASS);
    });
  });

  describe("Known services", () => {
    let manager: KeytarCredentialManager = null;
    beforeAll(async () => {
      manager = new KeytarCredentialManager(C.SERVICE2, C.DISPLAY_NAME2);
      await manager.initialize();
    });

    beforeEach(async () => {
      keytar.__setMockKeyring(C.TEST_CREDENTIALS_TO_SHOWCASE_CONFLICTS);
    });

    it("should retrieve credentials the plugin service", async () => {
      let err;
      let result;
      try {
        result = await manager.load(C.ACC4);
      }
      catch (e) {
        err = e;
      }
      expect(err).toBeUndefined();
      expect(result).toEqual(C.PASS4);
    });

    it("should retrieve matching credentials from another known service regardless the provided service", async () => {
      let err;
      let result;
      // We only have @brightside/core for ACC2
      try {
        result = await manager.load(C.ACC2);
      }
      catch (e) {
        err = e;
      }
      expect(err).toBeUndefined();
      expect(result).toEqual(C.SERVICE2PASS2);

      // We only have @zowe/cli for ACC3
      try {
        result = await manager.load(C.ACC3);
      }
      catch (e) {
        err = e;
      }
      expect(err).toBeUndefined();
      expect(result).toEqual(C.SERVICE3PASS3);
    });
  });

  describe("Conflicting credentials", () => {
    beforeEach(async () => {
      keytar.__setMockKeyring(C.TEST_CREDENTIALS_TO_SHOWCASE_CONFLICTS);
    });

    it("should retrieve credentials from the brightside-core service, even when the cli service is zowe-cli", async () => {
      let err;
      let result;

      const manager: KeytarCredentialManager = new KeytarCredentialManager(C.SERVICE3, C.DISPLAY_NAME3);
      // Assume we are on the lts-incremental branch of the plugin (@lts-incremental)
      (manager as any).PLUGIN_CREDENTIAL_PREFERENCE = "lts-incremental";
      await manager.initialize();
      try {
        result = await manager.load(C.ACC1);
      }
      catch (e) {
        err = e;
      }
      expect(err).toBeUndefined();
      expect(result).toEqual(C.SERVICE2PASS1);
    });

    it("should retrieve credentials from the brightside-core service, even when the cli service is brightside-core", async () => {
      let err;
      let result;

      const manager: KeytarCredentialManager = new KeytarCredentialManager(C.SERVICE2, C.DISPLAY_NAME2);
      // Assume we are on the master branch of the plugin (@latest)
      (manager as any).PLUGIN_CREDENTIAL_PREFERENCE = "latest"; // Anything different than `lts-incremental`
      await manager.initialize();
      try {
        result = await manager.load(C.ACC1);
      }
      catch (e) {
        err = e;
      }
      expect(err).toBeUndefined();
      expect(result).toEqual(C.SERVICE3PASS1);
    });
  });
});
