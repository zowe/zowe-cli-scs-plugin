/*
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright Contributors to the Zowe Project.
 */

import { IImperativeConfig } from "@zowe/imperative";
import { Constants } from "./Constants";
import { UpdateAllDefinition } from "../cli/update/UpdateAll.definition";

const config: IImperativeConfig = {
  pluginSummary: Constants.PLUGIN_SUMMARY,
  pluginHealthCheck: "./lib/imperative/healthCheckHandler",
  pluginAliases: [Constants.ALIAS],
  rootCommandDescription: Constants.PLUGIN_DESCRIPTION,
  productDisplayName: Constants.DISPLAY_NAME,
  name: Constants.NAME,
  definitions: [
    UpdateAllDefinition
  ],
  overrides: {
    CredentialManager: "./credentials/KeytarCredentialManager"
  },
};

export = config;
