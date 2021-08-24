/*
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright Contributors to the Zowe Project.
 */

import {
    IHandlerParameters,
    ImperativeConfig,
    ProfileUtils,
    ProfileIO,
    CliProfileManager,
    ProfilesConstants,
    CredentialManagerFactory
} from "@zowe/imperative";
import * as path from "path";
import { IProfileData } from "./IProfileData";


export default class BaseScsHandler {
    /**
     * Update profiles to be secure, or revert them to plain text
     * @param params Command handler parameters
     * @param shouldBeSecure Specifies whether credentials should be secure
     * @returns False if secure credential manager is not enabled
     */
    public static async updateProfiles(params: IHandlerParameters, shouldBeSecure: boolean): Promise<boolean> {
        try {
            this.ensureCredMgrIsEnabled();
        } catch (err) {
            params.response.console.errorHeader("Error");
            params.response.console.error(err.message);
            params.response.data.setExitCode(1);
            return false;
        }

        // Boolean to check if user has profiles or not
        let noProfiles = true;
        // profiles folder
        const profilesRootDir = ProfileUtils.constructProfilesRootDirectory(ImperativeConfig.instance.cliHome);
        const listOfProfileTypes = ProfileIO.getAllProfileDirectories(profilesRootDir);
        for (const profileType of listOfProfileTypes) {
            // Generic profile configuration
            const profileConfig = {profileRootDirectory: profilesRootDir, type: profileType};

            // Base directory for the given type of profile
            const profileTypeDir = path.join(profilesRootDir, profileType);

            // Names of the profiles of this type
            const profileNames = await ProfileIO.getAllProfileNames(profileTypeDir, ".yaml", `${profileType}_meta`);

            // Profile type meta file
            const profileMetaFile = ProfileIO.readMetaFile(path.join(profileTypeDir, `${profileType}_meta.yaml`));

            // Check to see if there are no profiles to be updated
            if (profileNames.length > 0) {
                noProfiles = false;
            }

            for (const profileName of profileNames) {
                const profileData: IProfileData = {
                    profile: ProfileIO.readProfileFile(path.join(profileTypeDir, `${profileName}.yaml`), profileType),
                    profileName, profileType, profileConfig, profileMetaFile, profileTypeDir
                };

                try {
                    let result: string;

                    if (shouldBeSecure) {
                        result = await this.makeProfileSecure(profileData);
                    } else {
                        result = await this.makeProfileInsecure(profileData);
                    }

                    params.response.console.log(result);
                } catch (err) {
                    params.response.console.errorHeader("Error");
                    params.response.console.error(err.message);
                }
            }
        }

        if (noProfiles) {
            params.response.console.log("There are no profiles to update");
        }

        return true;
    }

    /**
     * Check that CredentialManager is set in Imperative settings. If it is not,
     * throw an error.
     * @throws {Error}
     */
    private static ensureCredMgrIsEnabled() {
        const credMgrSetting = ImperativeConfig.instance.loadedConfig.overrides?.CredentialManager;
        if (credMgrSetting == null) {
            const pluginName = require(path.join(__dirname, "../../package.json")).name;
            throw new Error(`Invalid credential manager setting\n\n` +
                "Possible Causes:\n" +
                `  Expected secure credential manager to be enabled\n\n` +
                "Resolutions:\n" +
                `  Run "zowe config set CredentialManager ${pluginName}"\n`
            );
        }
    }

    /**
     * Check if a profile is already secure. We assume it is secure, if it
     * contains a property whose value starts with the string "managed by" and
     * is marked as secure in the profile schema.
     * @param pd Profile data object
     * @returns True if the profile is already secure
     */
    private static isProfileSecure(pd: IProfileData): boolean {
        for (const profileProperty in pd.profile) {

            // Does this property start with the words 'managed by'?
            if (pd.profile[profileProperty].toString().indexOf(ProfilesConstants.PROFILES_OPTION_SECURELY_STORED) === 0) {

                // If so, Is this property secure?
                if (pd.profileMetaFile.configuration.schema.properties[profileProperty].secure) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Revert a secure profile to be stored in plain text.
     * @param pd Profile data object
     * @returns String to be logged to the console
     */
    private static async makeProfileInsecure(pd: IProfileData): Promise<string> {
        // Indicator of whether a profile is already secured
        const alreadySecured = this.isProfileSecure(pd);
        if (!alreadySecured) {
            // Do not overwrite a profile seems to be already plain text
            return `Profile ("${pd.profileName} of type "${pd.profileType}") was already plain text`;
        } else {
            // Load profile with secure fields
            const profileLoaded = await new CliProfileManager(pd.profileConfig).load({
                name: pd.profileName,
                type: pd.profileType
            });

            // Simple save profile with plain text fields
            const profileFilePath = path.join(pd.profileTypeDir, `${pd.profileName}.yaml`);
            ProfileIO.writeProfile(profileFilePath, profileLoaded.profile);

            // Clean up secure fields
            for (const profileProperty in pd.profile) {

                // Does this property start with the words 'managed by'?
                if (pd.profile[profileProperty].toString().indexOf(ProfilesConstants.PROFILES_OPTION_SECURELY_STORED) === 0) {

                    // If so, Is this property secure?
                    if (pd.profileMetaFile.configuration.schema.properties[profileProperty].secure) {
                        await CredentialManagerFactory.manager.delete(
                            ProfileUtils.getProfilePropertyKey(pd.profileType, pd.profileName, profileProperty)
                        );
                    }
                }
            }

            return `Profile ("${pd.profileName}" of type "${pd.profileType}") successfully written: ${profileFilePath}`;
        }
    }

    /**
     * Update a plain text profile to be stored securely.
     * @param pd Profile data object
     * @returns String to be logged to the console
     */
    private static async makeProfileSecure(pd: IProfileData): Promise<string> {
        // Indicator of whether a profile is already secured
        const alreadySecured = this.isProfileSecure(pd);
        if (alreadySecured) {
            // Do not overwrite a profile seems to be already secure
            return `Profile ("${pd.profileName} of type "${pd.profileType}") was already secure`;
        } else {
            // Overwrite this plain text profiles
            const res = await new CliProfileManager(pd.profileConfig).save({
                name: pd.profileName,
                type: pd.profileType,
                profile: pd.profile,
                updateDefault: false,
                overwrite: true
            });
            return res.message;
        }
    }
}
