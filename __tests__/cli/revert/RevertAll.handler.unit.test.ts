/*
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright Contributors to the Zowe Project.
 */

import RevertAllHandler from "../../../src/cli/revert/RevertAll.handler";

describe("RevertAll Behavior", () => {
    it("should load", async () => {
        const handler = new RevertAllHandler();

        // await handler.process({});

        expect(true).toBe(true);
    });
});
