/*
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright Contributors to the Zowe Project.
 */

import { ITestEnvironment } from "../../__src__/environment/doc/response/ITestEnvironment";
import { TestEnvironment } from "../../__src__/environment/TestEnvironment";
import { runCliScript } from "../../__src__/TestUtils";

let TEST_ENV: ITestEnvironment;

describe("secure-credential-store command", () => {

    // Create the unique test environment
    beforeAll(async () => {
        TEST_ENV = await TestEnvironment.setUp({
            installPlugin: true,
            testName: "root_command"
        });
    });

    afterAll(async () => {
        await TestEnvironment.cleanUp(TEST_ENV);
    });

    it("should display the help", () => {
        const response = runCliScript(__dirname + "/__scripts__/root_help.sh", TEST_ENV);
        expect(response.stdout.toString()).toMatchSnapshot();
        expect(response.stderr.toString()).toBe("");
        expect(response.status).toBe(0);
    });

    it("should fail with invalid command", async () => {
        const response = runCliScript(__dirname + "/__scripts__/invalid_command.sh", TEST_ENV);
        expect(response.stderr.toString()).toMatchSnapshot();
        expect(response.stdout.toString()).toBe("");
        expect(response.status).toBe(1);
    });
});
