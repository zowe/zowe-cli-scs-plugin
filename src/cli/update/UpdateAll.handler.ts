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
  ICommandHandler,
  IHandlerParameters,
  ImperativeConfig,
  ProfileUtils,
  ProfileIO,
  CliProfileManager,
  ProfilesConstants
} from "@zowe/imperative";
import * as path from "path";


export default class UpdateAllHandler implements ICommandHandler {
  public async process(params: IHandlerParameters): Promise<void> {
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
        const profile = ProfileIO.readProfileFile(path.join(profileTypeDir, `${profileName}.yaml`), profileType);
        try {
          // Indicator of whether a profile is already secured
          let alreadySecured = false;
          for (const profileProperty in profile) {

            // Does this property start with the words 'managed by'?
            if (profile[profileProperty].toString().indexOf(ProfilesConstants.PROFILES_OPTION_SECURELY_STORED) === 0) {

              // If so, Is this property secure?
              if (profileMetaFile.configuration.schema.properties[profileProperty].secure) {
                alreadySecured = true;
              }
            }
          }
          if (alreadySecured) {
            // Do not overwrite a profile seems to be already secured
            params.response.console.log(`Profile ("${profileName} of type "${profileType}") was already secured`);
          } else {
            // Overwrite this plain text profiles
            const res = await new CliProfileManager(profileConfig).save({
              name: profileName,
              type: profileType,
              profile,
              updateDefault: false,
              overwrite: true
            });
            params.response.console.log(res.message);
          }
        } catch (err) {
          params.response.console.errorHeader("Error");
          params.response.console.error(err.message);
        }
      }
    }

    if (noProfiles) {
      params.response.console.log("There are no profiles to update");
    }
  }
}
