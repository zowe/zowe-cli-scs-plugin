# Changelog

All notable changes to the Secure Credential Store Plug-in for Zowe CLI will be documented in this file.

## `4.1.10`

- BugFix: Updated minimist transitive dependency to resolve a potential vulnerability.

## `4.1.9`

- BugFix: Fixed local prebuilds of Keytar binaries not found at install time.

## `4.1.8`

- BugFix: Added prebuilt Keytar binaries to the package for installation from registry. [#53](https://github.com/zowe/zowe-cli-scs-plugin/issues/53)
- BugFix: Pruned dev dependencies from npm-shrinkwrap file.

## `4.1.7`

- BugFix: Included an npm-shrinkwrap file to lock-down all transitive dependencies.

## `4.1.6`

- BugFix: Updated the Readme

## `4.1.5`

- BugFix: Updated the Keytar dependency to v7.7 to be compatible with Node.js v16.

## `4.1.4`

- BugFix: Updated the Keytar and prebuild-install dependencies to make offline install possible for npm@7 users.

## `4.1.3`

- BugFix: Updated the Keytar dependency to v7 to be compatible with Node.js v15.

## `4.1.2`

- BugFix: Provided additional instruction in readme for npm@7 users.

## `4.1.1`

- BugFix: Updated the Keytar dependency to v6 to support Node.js v14. [#28](https://github.com/zowe/zowe-cli-scs-plugin/issues/28)

## `4.1.0`

- Enhancement: Added the `scs revert` command. Use the command to revert securely-stored credentials in your user profiles to be stored in plain text. [#22](https://github.com/zowe/zowe-cli-scs-plugin/issues/22)
- Enhancement: Changed the `scs update` and `scs revert` commands so that they fail if Secure Credential Manager is not enabled. [#23](https://github.com/zowe/zowe-cli-scs-plugin/pull/23)

## `4.0.4`

- Update Keytar dependency to support offline installation for Node.js 13. Thanks @tjohnsonBCM

## `4.0.3`

- Bundle Keytar binaries in NPM package so that plugin can be installed offline. Thanks @awharn, @tjohnsonBCM

## `4.0.2`

- Fix error when loading optional secure fields (e.g., "keyPassphrase" in SSH profile). Thanks @tjohnsonBCM
- Support installing the plugin offline if prebuilt Keytar binaries are bundled. Thanks @tjohnsonBCM
- Fix error when deleting secure profile that has no values stored in credential vault. Thanks @tjohnsonBCM

## `4.0.1`

- Set up Jenkins Pipelines
- Tagged package @zowe-v1-lts

## `4.0.0`

- The Secure Credential Store was contributed to Zowe
