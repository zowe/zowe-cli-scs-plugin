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
