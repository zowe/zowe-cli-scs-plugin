/*
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright Contributors to the Zowe Project.
 */

import { ITestEnvironment } from "../../../__src__/environment/doc/response/ITestEnvironment";
import { TestEnvironment } from "../../../__src__/environment/TestEnvironment";
import { runCliScript } from "../../../__src__/TestUtils";

let TEST_ENV: ITestEnvironment;

describe("secure-credential-store revert command", () => {
    beforeAll(async () => {
    // Create test environment without installing the plugin
        TEST_ENV = await TestEnvironment.setUp({testName: "revert_command"});

        // Install the plugin
        await TestEnvironment.installPlugin(TEST_ENV);
    });

    afterAll(async () => {
        await TestEnvironment.cleanUp(TEST_ENV);
    });

    it("should display the help", async () => {
        const response = await runCliScript(__dirname + "/__scripts__/revert_help.sh", TEST_ENV);
        expect(response.stderr.toString()).toBe("");
        expect(response.stdout.toString()).toMatchSnapshot();
        expect(response.status).toBe(0);
    });

    it("should fail without for-sure option", async () => {
        const response = await runCliScript(__dirname + "/__scripts__/invalid_command.sh", TEST_ENV);
        expect(response.stdout.toString()).toBe("");
        expect(response.stderr.toString()).toMatchSnapshot();
        expect(response.status).toBe(1);
    });

    it("should fail if secure credential manager not enabled", async () => {
        const response = await runCliScript(__dirname + "/__scripts__/invalid_credmgr.sh", TEST_ENV);
        expect(response.stdout.toString()).toBe("");
        expect(response.stderr.toString()).toMatchSnapshot();
        expect(response.status).toBe(0);
    });
});
