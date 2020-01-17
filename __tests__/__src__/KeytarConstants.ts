/*
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright Contributors to the Zowe Project.
 */

export const SERVICE: string = "TestService";
export const DISPLAY_NAME: string = "Test Service";

export const SERVICE2: string = "@brightside/core";
export const DISPLAY_NAME2: string = "@brightside/secure-credential-store";

export const SERVICE3: string = "@zowe/cli";
export const DISPLAY_NAME3: string = "@zowe/secure-credential-store-for-zowe-cli";

export const PLUGIN_SERVICE: string = "Zowe-Plugin";
export const FINAL_PLUGIN_NAME: string = "@zowe/secure-credential-store-for-zowe-cli";

export const ACC1: string = "AccountOne";
export const ACC2: string = "AccountTwo";
export const ACC3: string = "AccountThree";
export const ACC4: string = "AccountFour";

export const PASS1: string = "PasswordOne";
export const PASS2: string = "PasswordTwo";
export const PASS3: string = "PasswordThree";
export const PASS4: string = "PasswordFour";

export const SERVICE2PASS1: string = SERVICE2 + "=" + PASS1;
export const SERVICE2PASS2: string = SERVICE2 + "=" + PASS2;
export const SERVICE2PASS3: string = SERVICE2 + "=" + PASS3;

export const SERVICE3PASS1: string = SERVICE3 + "=" + PASS1;
export const SERVICE3PASS2: string = SERVICE3 + "=" + PASS2;
export const SERVICE3PASS3: string = SERVICE3 + "=" + PASS3;

export const TEST_CREDENTIALS = {
  [SERVICE]: {
    [ACC1]: Buffer.from(PASS1).toString("base64"),
    [ACC2]: Buffer.from(PASS2).toString("base64")
  },
  [SERVICE2]: {
    [ACC1]: Buffer.from(SERVICE2PASS1).toString("base64"),
    [ACC2]: Buffer.from(SERVICE2PASS2).toString("base64"),
    [ACC3]: Buffer.from(SERVICE2PASS3).toString("base64")
  },
  [SERVICE3]: {
    [ACC1]: Buffer.from(SERVICE3PASS1).toString("base64"),
    [ACC2]: Buffer.from(SERVICE3PASS2).toString("base64"),
    [ACC3]: Buffer.from(SERVICE3PASS3).toString("base64")
  }
};

export const TEST_CREDENTIALS_TO_SHOWCASE_CONFLICTS = {
  [SERVICE2]: {
    [ACC1]: Buffer.from(SERVICE2PASS1).toString("base64"),
    [ACC2]: Buffer.from(SERVICE2PASS2).toString("base64")
  },
  [SERVICE3]: {
    [ACC1]: Buffer.from(SERVICE3PASS1).toString("base64"),
    [ACC3]: Buffer.from(SERVICE3PASS3).toString("base64")
  },
  [PLUGIN_SERVICE]: {
    [ACC4]: Buffer.from(PASS4).toString("base64")
  },
};

export const ACCT_USERNAME: string = "zosmf_my-profile-name_username"; // Used on lts-incremental
export const TEST_USERNAME: string = "my-test-username";
export const ACCT_PASS: string = "zosmf_my-profile-name_pass"; // Used on lts-stable
export const TEST_PASS: string = "my-test-pass";

export const CREDENTIALS_WITH_BREAKING_CHANGES = {
  [SERVICE2]: {
    [ACCT_USERNAME]: Buffer.from(TEST_USERNAME).toString("base64"),
    [ACCT_PASS]: Buffer.from(TEST_PASS).toString("base64")
  }
};

export const SIGNATURE: string = "managed by @zowe/secure-credential-store-for-zowe-cli";
