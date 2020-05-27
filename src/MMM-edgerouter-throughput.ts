import prettyBytes from 'pretty-bytes';
import { ModuleNotification } from './constants/ModuleNotification';
import Config, { DataConfig } from './types/Config';

const DOM_INSTANCES: { [key: string]: DomTree } = {};

interface DomTree {
    root: HTMLDivElement,
    title: HTMLSpanElement,
    interfaceName: HTMLSpanElement,
    up: HTMLSpanElement,
    down: HTMLSpanElement,
}

Module.register<Config>('MMM-edgerouter-throughput', {
    /**
     * Define the default instance config
     */
    defaults: {
        title: undefined,
        showInterfaceName: true,
        port: 22
    },

    _throughputData: {},
    _lastThroughputData: {},

    start() {
        this.sendSocketNotification(ModuleNotification.CONFIG, this.config);
    },

    /**
     * Core-Function to return the modules DOM-Tree.
     */
    getDom(): HTMLElement {
        const { down, interfaceName, root, title, up } = this._getDomInstance();
        const { config } = this;

        title.innerText = config.title;
        interfaceName.innerText = config.interface;

        if (this._lastThroughputData[config.gateway] &&
            this._lastThroughputData[config.gateway][config.interface] &&
            this._throughputData[config.gateway] &&
            this._throughputData[config.gateway][config.interface]
        ) {
            const lastTxBytes = this._lastThroughputData[config.gateway][config.interface].tx_bytes;
            const currentTxBytes = this._throughputData[config.gateway][config.interface].tx_bytes;
            const lastRxBytes = this._lastThroughputData[config.gateway][config.interface].rx_bytes;
            const currentRxBytes = this._throughputData[config.gateway][config.interface].rx_bytes;

            const txRate = currentTxBytes - lastTxBytes;
            const rxRate = currentRxBytes - lastRxBytes;

            up.innerText = prettyBytes(txRate) + '/s';
            down.innerText = prettyBytes(rxRate) + '/s';
        }

        return root;
    },

    socketNotificationReceived(notifiction, payload) {
        switch (notifiction) {
            case ModuleNotification.THROUGHPUT:
                this._setThroughputData(payload);
                break;
        }
    },

    _getDomInstance(): DomTree {
        const { identifier } = this;

        // Create DOM Elements only if not created before.
        if (!DOM_INSTANCES[identifier]) {
            const root = document.createElement<'div'>('div');

            const titleWrapper = document.createElement<'div'>('div');
            const title = document.createElement<'span'>('span');
            const interfaceName = document.createElement<'span'>('span');

            const throughput = document.createElement<'div'>('div');
            const upIcon = document.createElement<'span'>('span');
            const up = document.createElement<'span'>('span');
            const downIcon = document.createElement<'span'>('span');
            const down = document.createElement<'span'>('span');

            // Helper functions.
            const space = () => document.createTextNode(' ');
            const br = () => document.createElement<'br'>('br');

            titleWrapper.classList.add('xsmall');

            // Append title only when interface name is hidden and title is available.
            if (this.config.title && !this.config.showInterfaceName) {
                root.append(titleWrapper);

                titleWrapper.append(title);
                titleWrapper.classList.add('bold');
            }
            // Append interface Name when no title is given and interface should be shown.
            else if (!this.config.title && this.config.showInterfaceName) {
                root.append(titleWrapper);

                titleWrapper.append(interfaceName);
                titleWrapper.classList.add('bold');
            }
            // Append title and interface name when both should be shown
            else if (this.config.title && this.config.showInterfaceName) {
                root.append(titleWrapper);

                titleWrapper.classList.add('normal');
                interfaceName.classList.add('bold');
                titleWrapper.append(title, space(), interfaceName);
            }

            root.append(throughput);
            throughput.append(downIcon, space(), down, br(), upIcon, space(), up);
            throughput.classList.add('bright');
            throughput.classList.add('small');
            throughput.classList.add('light');

            upIcon.classList.add('normal');
            upIcon.classList.add('bold');
            upIcon.innerText = '↑';
            downIcon.classList.add('normal');
            downIcon.classList.add('bold');
            downIcon.innerText = '↓';

            DOM_INSTANCES[identifier] = {
                interfaceName,
                root,
                title,
                up,
                down,
            };
        }

        return DOM_INSTANCES[identifier];
    },

    _setThroughputData(data: object) {
        this._lastThroughputData = this._throughputData;
        this._throughputData = data;
        this.updateDom();
    },
});
