/*
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright Contributors to the Zowe Project.
 */

import { IImperativeConfig } from "@zowe/imperative";

describe("Imperative config", () => {
  // Will fail if imperative configuration object is changed.
  // This is a sanity/protection check to ensure that any changes to the
  // configuration document are intended (and the snapshot must be updated).
  it("should match the snapshot", () => {
    const config: IImperativeConfig = require("../src/imperative/configuration");
    if (config.definitions) {
      for (const tConfig of config.definitions) {
        tConfig.handler = "user/specific/path";
      }
    }
    expect(config).toMatchSnapshot();
  });
});
