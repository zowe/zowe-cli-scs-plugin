/*
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright Contributors to the Zowe Project.
 */

import { ProfileIO, CliProfileManager, CredentialManagerFactory } from "@zowe/imperative";
import BaseScsHandler from "../../src/cli/scs.shared.handler";

jest.mock("@zowe/imperative");

const insecureProfileData = {
    profile: {
        myTestProperty: "password"
    },
    profileName: "test",
    profileType: "fake",
    profileConfig: {},
    profileMetaFile: {
        configuration: {
            schema: {
                properties: {
                    myTestProperty: {
                        secure: false
                    }
                }
            }
        }
    },
    profileTypeDir: "fakePath"
};

const secureProfileData = {
    profile: {
        myTestProperty: "managed by CredentialManager"
    },
    profileName: "test",
    profileType: "fake",
    profileConfig: {},
    profileMetaFile: {
        configuration: {
            schema: {
                properties: {
                    myTestProperty: {
                        secure: true
                    }
                }
            }
        }
    },
    profileTypeDir: "fakePath"
};

describe("Base SCS handler", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should update plain text profile to be secure", async () => {
        const saveProfileSpy = jest.spyOn(CliProfileManager.prototype, "save");
        saveProfileSpy.mockResolvedValueOnce({
            message: "success",
            overwritten: true,
            path: "fakePath"
        });

        await (BaseScsHandler as any).makeProfileSecure(insecureProfileData);
        expect(saveProfileSpy).toHaveBeenCalled();
    });

    it("should not update profile that is already secure", async () => {
        const saveProfileSpy = jest.spyOn(CliProfileManager.prototype, "save");

        await (BaseScsHandler as any).makeProfileSecure(secureProfileData);
        expect(saveProfileSpy).not.toHaveBeenCalled();
    });

    it("should revert secure profile to be plain text", async () => {
        jest.spyOn(CliProfileManager.prototype, "load")
            .mockResolvedValueOnce({} as any);
        Object.defineProperty(CredentialManagerFactory, "manager", {
            get: jest.fn(() => ({
                delete: jest.fn()
            }))
        });
        const writeProfileSpy = jest.spyOn(ProfileIO, "writeProfile");

        await (BaseScsHandler as any).makeProfileInsecure(secureProfileData);
        expect(writeProfileSpy).toHaveBeenCalled();
    });

    it("should not revert profile that is already plain text", async () => {
        const writeProfileSpy = jest.spyOn(ProfileIO, "writeProfile");

        await (BaseScsHandler as any).makeProfileInsecure(insecureProfileData);
        expect(writeProfileSpy).not.toHaveBeenCalled();
    });
});
