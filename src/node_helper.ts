// @ts-ignore
import SSH from 'ssh2-promise';
import { ModuleNotification } from './constants/ModuleNotification';
import { DataConfig } from './types/Config';

const NodeHelper = require('node_helper');

module.exports = NodeHelper.create({
    /**
     * Holds the interval for fetching the throughput data.
     */
    fetchInterval: null,

    /**
     * Holds all SSH-connections keyed by gateway.
     */
    sshClients: {} as { [gateway: string]: SSH | false },

    /**
     * Start the helper
     */
    start() {
        setInterval(() => {
            this._fetchData();
        }, 1000);
    },

    /**
     * Stop the interval and close the connections.
     */
    stop() {
        clearInterval(this.fetchInterval);

        Object
            .entries(this.sshClients)
            .filter((item): item is [string, SSH] => !!item[1])
            .forEach(([gateway, client]) => client.close().then(() => {
                console.log('MMM-edgerouter-throughput: Closed connection to %o', gateway);
            }));
    },

    /**
     * Handle socket notifications.
     *
     * @param {ModuleNotification} notification
     * @param {*} payload
     */
    socketNotificationReceived(notification: ModuleNotification, payload: any) {
        switch (notification) {
            case ModuleNotification.CONFIG:
                this._setupSSHClient(payload);
                break;
        }
    },

    /**
     * Fetch data from the connected clients.
     *
     * @private
     */
    _fetchData() {
        const sshClients: { [gateway: string]: SSH | false } = this.sshClients;
        const promises = Object
            .entries(sshClients)
            // Filter out failed connections.
            .filter((item): item is [string, SSH] => !!item[1])
            // Fetch the current throughput.
            .map(([gateway, client]) => client.exec('/sbin/ifstat --json').then((result) => ({
                gateway,
                result,
            })))
            // Parse and normalize the result.
            .map((promise) => promise.then(({ gateway, result }) => {
                const output = JSON.parse(result);
                const data = output[Object.keys(output)[0]];

                return {
                    gateway,
                    data,
                };
            }));

        // Wait for all the data.
        Promise.all(promises)
               // Reduce all results into a single payload.
               .then((results) => results.reduce((payload, { gateway, data }) => {
                   return {
                       ...payload,
                       [gateway]: data,
                   }
               }, {}))
               // Send the payload via socket notifications.
               .then((payload) => {
                   this.sendSocketNotification(ModuleNotification.THROUGHPUT, payload);
               });
    },

    /**
     * Setup a new SSH-connection.
     *
     * @param {DataConfig} config
     * @private
     */
    async _setupSSHClient(config: DataConfig) {
        const { gateway, username, password } = config;

        if (!this.sshClients[gateway]) {
            try {
                this.sshClients[gateway] = await new SSH({
                    host: gateway,
                    username,
                    password,
                });
                console.log('MMM-edgerouter-throughput: Connected to %o', gateway);
            } catch(error) {
                console.error('Failed to connect', error);
                this.sshClients[gateway] = false;
            }
        }
    },
});
