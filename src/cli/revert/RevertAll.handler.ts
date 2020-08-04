/*
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright Contributors to the Zowe Project.
 */

import { ICommandHandler, IHandlerParameters } from "@zowe/imperative";
import BaseScsHandler from "../scs.shared.handler";


export default class RevertAllHandler implements ICommandHandler {
  public async process(params: IHandlerParameters): Promise<void> {
    const success = await BaseScsHandler.updateProfiles(params, false);

    if (success) {
      params.response.console.log("\nSecure credential manager is still enabled for new profiles. To disable it, " +
        "uninstall this plugin or run \"zowe config reset CredentialManager\".");
    }
  }
}
