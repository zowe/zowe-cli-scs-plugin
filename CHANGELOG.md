# Changelog

## [2018-02-20] SecureCredentialManagement

### Changes 
- Created a credential manager that overrides the default provided by Imperative.
- Created a profile to show off the secure credential manager

### Demoing

This section explains a bit about how to show off the new stuff.

#### Overriding the Default
The profile created was a `ship` profile, so to see the manager in action just issue the following commands:

```
sample-cli profiles create ship ShipName --user SomeUser --pass SomePass
```

executing

```
sample-cli access ship
```

should yield this message

```
Welcome to the ShipName, Captain username-goes-here
Here is your access code: password-goes-here
```

#### Using the Default

To use the default manager just comment out this section of code in [configuration.ts](./src/imperative/configuration.ts) and rebuild.

```TypeScript
overrides: {
  CredentialManager: "./credentials/CustomCredentialManager"
}
```

This will trigger Imperative to use the default manager. Executing the same sequence of commands above should now read:

```
Welcome to the ShipName, Captain SomeUser
Here is your access code: SomePass
```
