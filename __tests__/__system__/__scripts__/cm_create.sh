#!/bin/bash
set -e

zowe profiles create zosmf cmtest --host localhost --user USERNAME --pass PLAINTEXT --ru false

zowe profiles list zosmf --sc

zowe profiles delete zosmf cmtest --force

exit $?
