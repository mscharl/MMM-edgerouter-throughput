/*! MMM-edgerouter-throughput
 *  The Module Core File
 *
 * By Michael Scharl https://michael.scharl.me
 * MIT Licensed.
 */

const DOM_INSTANCES: { [key: string]: DomTree } = {};

interface DomTree {
    root: HTMLDivElement,
    title: HTMLSpanElement,
    interfaceName: HTMLSpanElement,
    up: HTMLSpanElement,
    down: HTMLSpanElement,
}

Module.register('MMM-edgerouter-throughput', {
    /**
     * Define the default instance config
     */
    defaults: {
        // Data Configuration.
        gateway: '192.168.0.1',
        username: 'ubnt',
        password: 'ubnt',
        interface: 'eth0',

        // Appearance Configuration.
        title: null,
        showInterfaceName: true,
    },

    /**
     * Core-Function to return the modules DOM-Tree.
     */
    getDom(): HTMLElement {
        const { down, interfaceName, root, title, up } = this._getDomInstance();

        title.innerText = this.config.title;
        interfaceName.innerText = this.config.interface;
        up.innerText = '';
        down.innerText = '';

        return root;
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
});
