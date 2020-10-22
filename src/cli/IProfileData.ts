/*
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright Contributors to the Zowe Project.
 */

import { IMetaProfile, IProfile, IProfileTypeConfiguration } from "@zowe/imperative";

export interface IProfileData {
    /**
     * Profile object
     * @type {IProfile}
     * @memberof IProfileData
     */
    profile: IProfile;

    /**
     * Name of profile
     * @type {string}
     * @memberof IProfileData
     */
    profileName: string;

    /**
     * Type of profile
     * @type {string}
     * @memberof IProfileData
     */
    profileType: string;

    /**
     * Generic profile configuration
     * @type {{ [key: string]: string }}
     * @memberof IProfileData
     */
    profileConfig: { profileRootDirectory: string, type: string };

    /**
     * Profile type meta file
     * @type {IMetaProfile<IProfileTypeConfiguration>}
     * @memberof IProfileData
     */
    profileMetaFile: IMetaProfile<IProfileTypeConfiguration>;

    /**
     * Base directory for the given type of profile
     * @type {string}
     * @memberof IProfileData
     */
    profileTypeDir: string;
}
