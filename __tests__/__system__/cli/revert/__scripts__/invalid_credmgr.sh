#!/bin/bash

credMgr=`zowe config get CredentialManager`
zowe config reset CredentialManager

zowe scs revert -f

zowe config set CredentialManager $credMgr

exit $?
