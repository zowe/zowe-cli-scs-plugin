/*
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright Contributors to the Zowe Project.
 */

import * as fs from "fs";
import * as path from "path";
import { ITestEnvironment } from "../../../__src__/environment/doc/response/ITestEnvironment";
import { TestEnvironment } from "../../../__src__/environment/TestEnvironment";
import { runCliScript } from "../../../__src__/TestUtils";

let TEST_ENV: ITestEnvironment;
let PROFILE_PATH: string;
const PROFILE_NAME = "cmtest";

describe("secure-credential-store update and revert commands", () => {
  beforeAll(async () => {
    // Create test environment without installing the plugin
    TEST_ENV = await TestEnvironment.setUp({testName: "update_revert_commands"});
    PROFILE_PATH = path.join(TEST_ENV.env.ZOWE_CLI_HOME, "profiles", "zosmf", `${PROFILE_NAME}.yaml`);

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
    const response = await runCliScript(__dirname + "/__scripts__/update_success.sh", TEST_ENV);
    expect(response.stderr.toString()).toBe("");
    expect(response.stdout.toString()).toContain(`Profile ("${PROFILE_NAME}" of type "zosmf") successfully written`);
    expect(response.status).toBe(0);

    const profileContents = fs.readFileSync(PROFILE_PATH, "utf8");
    expect(profileContents).toContain("managed by");
  });

  it("should revert secure profiles successfully", async () => {
    const response = await runCliScript(__dirname + "/__scripts__/revert_success.sh", TEST_ENV);
    expect(response.stderr.toString()).toBe("");
    expect(response.stdout.toString()).toContain(`Profile ("${PROFILE_NAME}" of type "zosmf") successfully written`);
    expect(response.status).toBe(0);

    const profileContents = fs.readFileSync(PROFILE_PATH, "utf8");
    expect(profileContents).not.toContain("managed by");
  });
});
