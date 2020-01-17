# Secure Credential Store Plug-in for Zowe CLI

<img src="imgs/Zowe_ConformanceBadge_cli.png" width=25% alt="Zowe Conformance Badge"/>

The Secure Credential Store Plug-in for Zowe CLI lets you store your credentials securely in the default credential manager in your computer's operating system.

As a systems programmer or application developer, you can store your credentials securely to help prevent your user name and password from being compromised as a result of a malware attack or unlawful actions by others.

-   [How the plug-in works](#how-the-plug-in-works)
-   [Software requirements](#software-requirements)
-   [Installing](#installing)
-   [Building from source](#building-from-source)
-   [Securing Zowe CLI profiles](#securing-zowe-cli-profiles)
-   [Running tests](#running-tests)
-   [Uninstalling](#uninstalling)
-   [Contributing](#contributing)


## How the plug-in works

The plug-in invokes a native Node module that manages user IDs and passwords in the default credential manager in your computer's operating system.

When you install Zowe CLI but do not install the plug-in, your Zowe CLI profiles display as plain text in your default credential manager. For example:

```
type: zosmf
host: test
port: 1234
user: USERNAME
pass: PASSWORD
rejectUnauthorized: false
```

With the plug-in installed and configured, the plug-in lets you store your Zowe CLI credentials securely. For example:

```
type: zosmf
host: test
port: 1234
user: 'managed by @zowe/secure-credential-store-for-zowe-cli'
pass: 'managed by @zowe/secure-credential-store-for-zowe-cli'
rejectUnauthorized: false
```
<!-- TODO: Verify that @zowe/secure-credential-store is correct -->

The initial behavior of the plug-in varies based on the method that you use to install the plug-in.

-   When you install the plug-in using the *Windows Installation Wizard*, the installation process starts the plug-in and updates all of your existing Zowe CLI profiles automatically. No further action on your part is required.
-   When you install the plug-in from *an online registry or a local package*, the plug-in starts, however, you must update your existing Zowe CLI profiles manually.

## Software requirements

Before you install and use the plug-in:

-   Install Zowe CLI on your computer.

    For more information, see [Installing Zowe CLI](https://docs.zowe.org/stable/user-guide/cli-installcli.html).

## Installing

Use one of the following methods to install the plug-in:

-   Install the plug-in to Zowe CLI from an online registry or a local package.

    Use this method when you want to install the plug-in quickly and start using it. With this method, you secure your user IDs and passwords manually.

    For more information, see [Install Plug-ins from an Online Registry](https://docs.zowe.org/stable/user-guide/cli-installplugins.html#installing-plug-ins-from-an-online-registry) or [Install Plug-ins from a Local Package](https://docs.zowe.org/stable/user-guide/cli-installplugins.html#installing-plug-ins-from-a-local-package).

-   Build the plug-in from source and install it into your Zowe CLI implementation.

    Use the build from source method when you want to install the plug-in to Zowe CLI using the most current binaries and modify the behavior of the plug-in. For example, you want to create a new command and use the plug-in with the command that you created.

    For more information, see [Building from source](#building-from-source).

## Building from source

**Follow these steps:**

1.  The first time that you clone the Secure Credential Store Plug-in for Zowe CLI from the GitHub repository, issue the following command against the local directory:
    ```
    npm install
    ```
    The command installs the required dependencies and several development tools. You can run the task at any time to update the tools as needed.

2.  To build your code changes, issue the following command:
    ```
    npm run build
    ```

    The first time you build your code changes, you will be prompted for the location of the Imperative CLI Framework package, which is located in the `node_modules/@zowe` folder in the Zowe CLI home directory.

    **Note:** When you update `package.json` to include new dependencies, or when you pull changes that affect `package.json`, issue the `npm update` command to download the dependencies.

3.  Issue one of the following commands to install the plug-in:
    ```
    zowe plugins install <local path your cloned repo>
    ```

    Or:

    ```
    zowe plugins install .
    ```

**Tip:** After the installation process completes, it validates that the plug-in was installed correct and the names of its commands, options, and arguments do not conflict with that of the other plug-ins that you installed into your Zowe CLI implementation.

When the validation process is successful, the following message displays:

```
Validation results for plugin 'secure-credential-store':
Successfully validated.
```

When an unsuccessful message displays, you can troubleshoot the installation by addressing the issues that the message describes. You can also review the information that is contained in the log file that is located in the Zowe CLI home directory.

## Securing Zowe CLI profiles

When you install the plug-in using the Windows Installation Wizard, the plug-in secures all of your existing (Zowe CLI) profiles. Conversely, when you do not use the wizard to install the plug-in (you installed the plug-in from an online registry or from a local package), you secure your profiles manually using the Set command. For more information, see [How the plug-in works](#how-the-plug-in-works).

Issue the following `Set` command to **secure** all of your Zowe CLI profiles:
```
zowe config set CredentialManager @zowe/secure-credential-store-for-zowe-cli
``` 

When you want to **unsecure** all of your Zowe CLI profiles, issue the following `Reset` command:
```
zowe config reset CredentialManager
```

Your profiles will need to be recreated after the CredentialManager is reset.

**Note:** For information about how you can customize the behavior of the plug-in, see [Overriding the Default Credential Manager with a Plugin](https://github.com/zowe/imperative/wiki/Overriding-the-Default-Credential-Manager-with-a-Plugin) in the [Imperative CLI Framework](https://github.com/zowe/imperative/wiki) documentation.

## Running tests

You can perform the following types of tests on the Secure Credential Store Plug-in:
- Unit
- Integration
- System

**Note:** For detailed information about conventions and best practices for running tests against Zowe CLI plug-ins, see see [Zowe CLI Plug-in Testing Guidelines](https://github.com/zowe/zowe-cli/blob/master/docs/PluginTESTINGGuidelines.md).

Before running the system and integration tests, you must have a server connection to run against. For more information, see [Software requirements](#software-requirements).

To define access credentials to the server, copy the file named `.../__tests__/__resources__/properties/example_properties.yaml` and create a file named `.../__tests__/__resources__/properties/custom_properties.yaml`.

**Note:** Information about how to customize the `custom_properties.yaml` file is provided in the yaml file itself.

Issue the following commands to run the tests:
1. `npm run test:unit`
2. `npm run test:integration`
3. `npm run test:system`

Any failures potentially indicate an issue with the set-up of the Rest API or configuration parameters that were passed in the `custom_properties.yaml` file.

## Uninstalling

**Follow these steps:**

1.  Issue the following command:
    ```
    zowe plugins uninstall @zowe/secure-credential-store-for-zowe-cli
    ```
After the uninstallation process completes successfully, the product no longer contains the plug-in.

## Contributing

For information about contributing to the plug-in, see the Zowe CLI [Contribution Guidelines](CONTRIBUTING.md). The guidelines contain standards and conventions for developing plug-ins for Zowe CLI. This includes information about running, writing, maintaining automated tests, developing consistent syntax in your plug-in, and ensuring that your plug-in integrates properly with Zowe CLI.

### Tutorials

To learn about building new commands or a new plug-in for Zowe CLI, see [Develop for Zowe CLI](https://docs.zowe.org/stable/extend/extend-cli/cli-devTutorials.html).

### Imperative CLU Framework documentation

[Imperative CLI Framework](https://github.com/zowe/imperative/wiki) documentation is a key source of information to learn about the features of Imperative CLI Framework (the code framework that you use to build plug-ins for Zowe CLI). Refer to the documentation as you develop your plug-in.
