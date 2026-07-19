import axios from "axios";
import lodash from "lodash";

export default class Axios {
    /**
     * Call API endpoint
     *
     * @param endpoint
     * @param method
     * @param data
     * @param config
     * @return mixed
     */
    static async noAuth(endpoint, method, data = {}, config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }) {
        lodash.merge(config, {
            method,
            data,
        });

        return axios(endpoint, config);
    }

    /**
     * Use basic authentication on endpoint
     *
     * @param endpoint
     * @param method
     * @param username
     * @param password
     * @param data
     * @param config
     * @return mixed
     */
    static async basic(endpoint, method, username, password, data = {}, config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }) {
        lodash.merge(config, {
            data,
            params: {
                grant_type: 'client_credentials'
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            auth: {
                username: username,
                password: password
            }
        });

        return axios(endpoint, config);
    }

    /**
     * Use bearer authentication on endpoint
     *
     * @param endpoint
     * @param method
     * @param token
     * @param data
     * @param config
     * @return mixed
     */
    static async bearer(endpoint, method, token, data = {}, config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }) {
        lodash.merge(config, {
            method,
            data,
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        });

        Logger.info(`Axios call endpoint ${endpoint}`);

        return axios(endpoint, config);
    }

    /**
     * Use bearer authentication on endpoint
     *
     * @param endpoint
     * @param method
     * @param token
     * @param data
     * @param config
     * @return mixed
     */
    static async token(endpoint, method, token, data = {}, config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }) {
        lodash.merge(config, {
            method,
            data,
            headers: {
                "Authorization": token,
            }
        });

        return axios(endpoint, config);
    }
}
