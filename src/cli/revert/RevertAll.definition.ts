/*
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright Contributors to the Zowe Project.
 */

import { ICommandDefinition } from "@zowe/imperative";
import { Constants } from "../../imperative/Constants";

export const RevertAllDefinition: ICommandDefinition = {
  name: Constants.REVERT_CMD_NAME,
  aliases: Constants.REVERT_CMD_ALIAS,
  summary: Constants.REVERT_CMD_DESCRIPTION,
  description: Constants.REVERT_CMD_DESCRIPTION,
  type: "command",
  handler: __dirname + "/RevertAll.handler",
  options: [
    Constants.REVERT_CMD_OPTION_FOR_SURE
  ]
};
