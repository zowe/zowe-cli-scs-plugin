/*
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright Contributors to the Zowe Project.
 */

const fs = require("fs");
const path = require("path");

// Check if local prebuilds folder exists
const localDir = path.join(__dirname, "..", "prebuilds");
if (!fs.existsSync(localDir)) {
    process.exit(0);
}

// Function copied from prebuild-install
function npmCache() {
    const env = process.env;
    const home = require('os').homedir;
    return env.npm_config_cache ||
        (env.APPDATA ? path.join(env.APPDATA, 'npm-cache') : path.join(home(), '.npm'));
}

// Ensure that folder to store prebuilds exists in NPM cache
const cacheDir = path.join(npmCache(), "_prebuilds");
if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir);
}

// Move prebuilt .tar.gz files from local folder to NPM cache
fs.readdirSync(localDir).forEach((filename) => {
    if (filename.match(/.*-keytar-.*-node-.*\.tar\.gz/)) {
        fs.renameSync(path.join(localDir, filename), path.join(cacheDir, filename));
    }
});
