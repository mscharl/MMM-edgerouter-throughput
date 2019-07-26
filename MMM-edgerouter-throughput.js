(function () {
    'use strict';

    /*! MMM-edgerouter-throughput
     *  The Module Core File
     *
     * By Michael Scharl https://michael.scharl.me
     * MIT Licensed.
     */
    var DOM_INSTANCES = {};
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
        getDom: function () {
            var _a = this._getDomInstance(), down = _a.down, interfaceName = _a.interfaceName, root = _a.root, title = _a.title, up = _a.up;
            title.innerText = this.config.title;
            interfaceName.innerText = this.config.interface;
            up.innerText = '';
            down.innerText = '';
            return root;
        },
        _getDomInstance: function () {
            var identifier = this.identifier;
            // Create DOM Elements only if not created before.
            if (!DOM_INSTANCES[identifier]) {
                var root = document.createElement('div');
                var titleWrapper = document.createElement('div');
                var title = document.createElement('span');
                var interfaceName = document.createElement('span');
                var throughput = document.createElement('div');
                var upIcon = document.createElement('span');
                var up = document.createElement('span');
                var downIcon = document.createElement('span');
                var down = document.createElement('span');
                // Helper functions.
                var space = function () { return document.createTextNode(' '); };
                var br = function () { return document.createElement('br'); };
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
                    interfaceName: interfaceName,
                    root: root,
                    title: title,
                    up: up,
                    down: down,
                };
            }
            return DOM_INSTANCES[identifier];
        },
    });

}());
