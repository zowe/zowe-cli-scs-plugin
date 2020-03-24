# Changelog

All notable changes to the Secure Credential Store Plug-in for Zowe CLI will be documented in this file.

## `4.0.3`

- Bundle Keytar binaries in NPM package so that plugin can be installed offline. Thanks @tjohnsonBCM

## `4.0.2`

- Fix error when loading optional secure fields (e.g., "keyPassphrase" in SSH profile). Thanks @tjohnsonBCM
- Support installing the plugin offline if prebuilt Keytar binaries are bundled. Thanks @tjohnsonBCM
- Fix error when deleting secure profile that has no values stored in credential vault. Thanks @tjohnsonBCM

## `4.0.1`

- Set up Jenkins Pipelines
- Tagged package @zowe-v1-lts

## `4.0.0`

- The Secure Credential Store was contributed to Zowe
