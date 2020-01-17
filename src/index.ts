#!/usr/bin/env node
/*
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright Contributors to the Zowe Project.
 */


import {Imperative} from "@zowe/imperative";

/**
 * Initialize with imperative; init() will read package.json and load
 * our configurationModule, src/imperative/configuration.ts
 */
Imperative.init().then(() => {

  // if we initialize, we can use our app logging space for debug messages and other logging
  Imperative.api.appLogger.debug("Initialized successfully");
  Imperative.api.additionalLogger("another").debug("First additional logger configured");
  Imperative.api.additionalLogger("yetAnother").debug("Second additional logger configured");
  // Imperative.api.defaultConsole.debug(inspect(Imperative.api));

  // have imperative parse command arguments can give our handler control if everything is ok
  Imperative.parse();

// handle any potential errors
}).catch((e: Error) => {

  // since imperative had an initialization error, we cannot use API methods
  Imperative.console.fatal(require("util").inspect(e));
});

