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

export const UpdateAllDefinition: ICommandDefinition = {
  name: Constants.UPDATE_CMD_NAME,
  aliases: Constants.UPDATE_CMD_ALIAS,
  summary: Constants.UPDATE_CMD_DESCRIPTION,
  description: Constants.UPDATE_CMD_DESCRIPTION,
  type: "command",
  handler: __dirname + "/UpdateAll.handler"
};
