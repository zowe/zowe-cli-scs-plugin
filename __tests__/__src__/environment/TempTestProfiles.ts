/*
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright Contributors to the Zowe Project.
 */

/**
 * Test utility for creating and deleting
 */
import * as fs from "fs";
import { ImperativeError, IO } from "@zowe/imperative";


import { TemporaryScripts } from "./TemporaryScripts";
import { runCliScript } from "../TestUtils";
import { ITestEnvironment } from "./doc/response/ITestEnvironment";
import uuidv4 = require("uuid");

/**
 * Utilities for creating and cleaning up temporary profiles for tests
 */
export class TempTestProfiles {
    /**
     * Note reminding the user that failed profile creation may be the result of not installing Zowe CLI
     * globally
     */
    public static GLOBAL_INSTALL_NOTE: string = "\n\nNote: Make sure you have the current version of Zowe CLI " +
    " installed or linked globally so that " +
    "'" + TemporaryScripts.ZOWE_BIN +
    "' can be issued to create profiles and issue other commands.";

    /**
     * Create profiles for tests from data in the properties yaml file
     * @param testEnvironment - with working directory and test properties loaded
     * @param  profileTypes - array of types of profiles to create
     *                                  from test properties
     * @returns  promise that resolves when profiles are created to
     *                          an array of profile names. Resolves to a key:value object that can be used
     *                          later to clean up profiles
     * @throws errors if any of the profile creations fail or if requested to create an unknown profile type
     */
    public static async createProfiles(testEnvironment: ITestEnvironment, profileTypes: string[] = []) {
        const profileNames: { [key: string]: string[] } = {
            zosmf: [],
        };
        this.log(testEnvironment, "Creating the following profileTypes: " + profileTypes);
        for (const type of profileTypes) {
            if (type === "zosmf") {
                profileNames.zosmf.push(await TempTestProfiles.createTestProfile(testEnvironment));
            } else {
                throw new ImperativeError({msg: "asked to create unknown profile type '" + type + "'"});
            }
        }
        return profileNames;
    }

    /**
     *  Delete temporary profiles that were create earlier
     * @param  testEnvironment -  with working directory and test properties loaded
     * @throws errors if any of the profile deletions fail
     */
    public static async deleteProfiles(testEnvironment: ITestEnvironment) {
        // the temporary profiles created earlier.
        const profiles = testEnvironment.tempProfiles;
        this.log(testEnvironment, "Deleting the following profiles:\n" + JSON.stringify(profiles));
        for (const profileType of Object.keys(profiles)) {
            for (const profileName of profiles[profileType]) {
                await this.deleteProfile(testEnvironment, profileType, profileName);
            }
        }
    }

    /**
     * Helper to create a test profile from properties
     * @param  testEnvironment - the test environment with env and working directory to use for output
     * @returns promise that resolves to the string name of the created profile on success
     * @throws errors if the profile creation fails
     */
    private static async createTestProfile(testEnvironment: ITestEnvironment) {
        const profileName: string = "tmp_" + uuidv4();
        const testProperties = testEnvironment.systemTestProperties.zosmf;
        const createProfileScript = TemporaryScripts.SHEBANG +
            `${TemporaryScripts.ZOWE_BIN} profiles create zosmf ${profileName} ` +
            `--host ${testProperties.host} ` +
            `--port ${testProperties.port} ` +
            `--user ${testProperties.user} ` +
            `--pass ${testProperties.pass} ` +
            `--ru false`;

        const scriptPath = testEnvironment.workingDir + "_create_profile_" + profileName;
        await IO.writeFileAsync(scriptPath, createProfileScript);
        const output = runCliScript(scriptPath, testEnvironment, []);
        if (output.status !== 0 || output.stderr.toString().trim().length > 0) {
            throw new ImperativeError({
                msg: "Creation of test profile '" + profileName + "' failed! You should delete the script: \n'" + scriptPath + "' " +
                    "after reviewing it to check for possible errors.\n Output of the profile create command:\n" + output.stderr.toString() +
                    output.stdout.toString() +
                    TempTestProfiles.GLOBAL_INSTALL_NOTE
            });
        }
        IO.deleteFile(scriptPath);
        this.log(testEnvironment, `Created test profile '${profileName}'. Stdout from creation:\n${output.stdout.toString()}`);
        return profileName;
    }

    /**
     * Helper to delete a temporary profile
     * @param testEnvironment - the test environment with env and working directory to use for output
     * @param profileType - the type of profile e.g. zos-ftp to delete
     * @param  profileName - the name of the profile to delete
     * @returns  promise that resolves to the name of the created profile on success
     * @throws errors if the profile delete fails
     */
    private static async deleteProfile(testEnvironment: ITestEnvironment, profileType: string, profileName: string) {
        this.log(testEnvironment, "Deleting profile " + profileName + " of type " + profileType);
        const deleteProfileScript = TemporaryScripts.SHEBANG +
            `${TemporaryScripts.ZOWE_BIN} profiles delete ${profileType} ${profileName} --force`;
        const scriptPath = testEnvironment.workingDir + "_delete_profile_" + profileName;
        await IO.writeFileAsync(scriptPath, deleteProfileScript);
        const output = runCliScript(scriptPath, testEnvironment, []);
        if (output.status !== 0 || output.stderr.toString().trim().length > 0) {
            throw new ImperativeError({
                msg: "Deletion of " + profileType + " profile '" + profileName + "' failed! You should delete the script: '" +
                    scriptPath + "' " + "after reviewing it to check for possible errors. Stderr of the profile create command:\n" +
                    output.stderr.toString() + TempTestProfiles.GLOBAL_INSTALL_NOTE
            });
        }
        this.log(testEnvironment, `Deleted ${profileType} profile '${profileName}'. Stdout from deletion:\n${output.stdout.toString()}`);
        IO.deleteFile(scriptPath);
        return profileName;
    }

    /**
     * log a message to a file in the working directory
     */
    private static log(testEnvironment: ITestEnvironment, message: string) {
        fs.appendFileSync(testEnvironment.workingDir + "/TempTestProfiles.log", message + "\n");
    }
}
