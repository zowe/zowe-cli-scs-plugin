/*
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright Contributors to the Zowe Project.
 */

/**
 * Interface representing the values in the custom_properties.yaml file
 * see example_properties.yaml for descriptions and more details
 */
export interface ITestPropertiesSchema {

    /**
     * Properties related to the Db2 connection
     */
    zosmf: {
        /**
         * The server host name
         */
        host: string,

        /**
         * The server port number
         */
        port: number,

        /**
         * The user ID
         */
        user: string,

        /**
         * The password
         */
        pass: string,
    };
}
