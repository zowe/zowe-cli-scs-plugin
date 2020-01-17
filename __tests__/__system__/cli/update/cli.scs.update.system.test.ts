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
const PROFILE_NAME = "cmtest";


describe("secure-credential-store update command", () => {
  beforeAll(async () => {
    // Create test environment without installing the plugin
    TEST_ENV = await TestEnvironment.setUp({testName: "update_command"});

    // create profile
    const response = await runCliScript(__dirname + "/__scripts__/cm_create.sh", TEST_ENV, [PROFILE_NAME]);
    expect(response.stdout.toString()).toContain("Profile created successfully");
    expect(response.stdout.toString()).toContain("PLAINTEXT");

    // Install the plugin
    await TestEnvironment.installPlugin(TEST_ENV);
  });

  afterAll(async () => {
    await TestEnvironment.cleanUp(TEST_ENV);
  });

  it("should update plain text profiles successfully", async () => {
    let response;
    // Install plugin
    response = await runCliScript(__dirname + "/__scripts__/install_plugin.sh", TEST_ENV, ["../../../../"]);
    // expect(response.stderr.toString()).toBe(""); // Do not check for stderr since there might be warnings
    expect(response.stdout.toString()).toContain("Installed");

    response = await runCliScript(__dirname + "/__scripts__/update_success.sh", TEST_ENV);
    expect(response.stderr.toString()).toBe("");
    expect(response.stdout.toString()).toContain(`Profile ("${PROFILE_NAME}" of type "zosmf") successfully written`);
    expect(response.status).toBe(0);
  });

  it("should display the help", async () => {
    const response = await runCliScript(__dirname + "/__scripts__/update_help.sh", TEST_ENV);
    expect(response.stderr.toString()).toBe("");
    expect(response.stdout.toString()).toMatchSnapshot();
    expect(response.status).toBe(0);
  });

  it("should fail with invalid command", async () => {
    const response = await runCliScript(__dirname + "/__scripts__/invalid_command.sh", TEST_ENV);
    expect(response.stdout.toString()).toBe("");
    expect(response.stderr.toString()).toMatchSnapshot();
    expect(response.status).toBe(1);
  });
});
