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
const join = require("path").join;

try {
    // Add keytar to bundledDependencies in package.json
    let packageJsonPath = join(__dirname, "..", "package.json");
    let packageJson = require(packageJsonPath);
    packageJson.bundledDependencies = Object.keys(packageJson.dependencies);
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    // Patch keytar package.json to add build folder and remove custom install script
    packageJsonPath = join(__dirname, "..", "node_modules", "keytar", "package.json");
    packageJson = require(packageJsonPath);
    delete packageJson.scripts.install;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
} catch (err) {
    console.error(err);
}
