<template>
    <div id="app">
        <div id="header">
            <div id="header-cont">
                <h2>Memory Layout</h2>
                <div id="button-cont">
                    <vscode-button @click="onSave" :disabled="!(status.ramVerified && status.romVerified)">Save</vscode-button>
                    <vscode-button @click="onReset" :disabled="!status.canReset">Reset</vscode-button>
                </div>
            </div>
        </div>

        <div class="container">
            <div class="left">
                <div>
                    <h4>
                        <strong>Read/Write</strong> Memeory Areas
                    </h4>
                </div>
                <div id="RAM-Layout">
                    <div>
                        <table>
                            <caption>On-Chip</caption>
                            <thead>
                                <tr>
                                    <th>Default</th>
                                    <th>Start Address</th>
                                    <th>Size</th>
                                    <th>NoInit</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in data.ram['on-chip']" :key="index">
                                    <td>
                                        <vscode-checkbox :id="`iram-${item.id}-used`" :current-checked="item.isDef" @change="item.isDef = $event.target.checked">{{ 'IRAM' + item.id }}</vscode-checkbox>
                                    </td>
                                    <td>
                                        <vscode-text-field :id="`iram-${item.id}-addr`" :maxlength="style['addr_size-text-max-len']" :current-value="item.addr" @change="item.addr = $event.target.value"></vscode-text-field>
                                    </td>
                                    <td>
                                        <vscode-text-field :id="`iram-${item.id}-size`" :maxlength="style['addr_size-text-max-len']" :current-value="item.size" @change="item.size = $event.target.value"></vscode-text-field>
                                    </td>
                                    <td>
                                        <vscode-checkbox :current-checked="item.noInit" @change="item.noInit = $event.target.checked"></vscode-checkbox>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <table>
                            <caption>Off-Chip</caption>
                            <thead>
                                <tr>
                                    <th>Default</th>
                                    <th>Start Address</th>
                                    <th>Size</th>
                                    <th>NoInit</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in data.ram['off-chip']" :key="index">
                                    <td>
                                        <vscode-checkbox :id="`ram-${item.id}-used`" :current-checked="item.isDef" @change="item.isDef = $event.target.checked">{{ 'RAM' + item.id }}</vscode-checkbox>
                                    </td>
                                    <td>
                                        <vscode-text-field :id="`ram-${item.id}-addr`" :maxlength="style['addr_size-text-max-len']" :current-value="item.addr" @change="item.addr = $event.target.value"></vscode-text-field>
                                    </td>
                                    <td>
                                        <vscode-text-field :id="`ram-${item.id}-size`" :maxlength="style['addr_size-text-max-len']" :current-value="item.size" @change="item.size = $event.target.value"></vscode-text-field>
                                    </td>
                                    <td>
                                        <vscode-checkbox :current-checked="item.noInit" @change="item.noInit = $event.target.checked"></vscode-checkbox>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div>
                    <p class="code">RAM Total:</p>
                    <pre>{{ status.totalRamSize }}</pre>
                </div>
            </div>

            <div class="right">
                <div>
                    <h4>
                        <strong>Read/Only</strong> Memeory Areas
                    </h4>
                </div>
                <div id="ROM-Layout">
                    <div>
                        <table>
                            <caption>On-Chip</caption>
                            <thead>
                                <tr>
                                    <th>Default</th>
                                    <th>Start Address</th>
                                    <th>Size</th>
                                    <th>Startup</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in data.rom['on-chip']" :key="index">
                                    <td>
                                        <vscode-checkbox :id="`irom-${item.id}-used`" :current-checked="item.isDef" @change="item.isDef = $event.target.checked">{{ 'IROM' + item.id }}</vscode-checkbox>
                                    </td>
                                    <td>
                                        <vscode-text-field :id="`irom-${item.id}-addr`" :maxlength="style['addr_size-text-max-len']" :current-value="item.addr" @change="item.addr = $event.target.value"></vscode-text-field>
                                    </td>
                                    <td>
                                        <vscode-text-field :id="`irom-${item.id}-size`" :maxlength="style['addr_size-text-max-len']" :current-value="item.size" @change="item.size = $event.target.value"></vscode-text-field>
                                    </td>
                                    <td>
                                        <vscode-radio :current-checked="item.isStartup" @change="if ($event.target.currentChecked) onStartupRomRadioChecked('on-chip', index)"></vscode-radio>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <table>
                            <caption>Off-Chip</caption>
                            <thead>
                                <tr>
                                    <th>Default</th>
                                    <th>Start Address</th>
                                    <th>Size</th>
                                    <th>Startup</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in data.rom['off-chip']" :key="index">
                                    <td>
                                        <vscode-checkbox :id="`rom-${item.id}-used`" :current-checked="item.isDef" @change="item.isDef = $event.target.checked">{{ 'ROM' + item.id }}</vscode-checkbox>
                                    </td>
                                    <td>
                                        <vscode-text-field :id="`rom-${item.id}-addr`" :maxlength="style['addr_size-text-max-len']" :current-value="item.addr" @change="item.addr = $event.target.value"></vscode-text-field>
                                    </td>
                                    <td>
                                        <vscode-text-field :id="`rom-${item.id}-size`" :maxlength="style['addr_size-text-max-len']" :current-value="item.size" @change="item.size = $event.target.value"></vscode-text-field>
                                    </td>
                                    <td>
                                        <vscode-radio :current-checked="item.isStartup" @change="if ($event.target.currentChecked) onStartupRomRadioChecked('off-chip', index)"></vscode-radio>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div>
                    <p class="code">ROM Total:</p>
                    <pre>{{ status.totalRomSize }}</pre>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

let _instance;

/* init data */
let appData = {

    style: {
        'addr_size-text-max-len': 16,
    },

    status: {
        canReset: false,
        ramVerified: false,
        romVerified: false,
        totalRamSize: '',
        totalRomSize: '',
    },

    data: {
        ram: {
            'on-chip': [
                {
                    id: 1,
                    isDef: true,
                    addr: '',
                    size: '',
                    noInit: false
                },
                {
                    id: 2,
                    isDef: false,
                    addr: '',
                    size: '',
                    noInit: false
                }
            ],
            'off-chip': [
                {
                    id: 1,
                    isDef: false,
                    addr: '',
                    size: '',
                    noInit: false
                },
                {
                    id: 2,
                    isDef: false,
                    addr: '',
                    size: '',
                    noInit: false
                },
                {
                    id: 3,
                    isDef: false,
                    addr: '',
                    size: '',
                    noInit: false
                }
            ]
        },
        rom: {
            'on-chip': [
                {
                    id: 1,
                    isDef: false,
                    addr: '',
                    size: '',
                    isStartup: false
                },
                {
                    id: 2,
                    isDef: false,
                    addr: '',
                    size: '',
                    isStartup: false
                }
            ],
            'off-chip': [
                {
                    id: 1,
                    isDef: false,
                    addr: '',
                    size: '',
                    isStartup: false
                },
                {
                    id: 2,
                    isDef: false,
                    addr: '',
                    size: '',
                    isStartup: false
                },
                {
                    id: 3,
                    isDef: false,
                    addr: '',
                    size: '',
                    isStartup: false
                }
            ]
        }
    }
};

export default {

    name: "App",

    components: {},

    // data
    data() {
        return appData;
    },

    // mount object
    mounted() {
        _instance = this;
        this.status.ramVerified = this.verifyFormData('ram');
        this.status.romVerified = this.verifyFormData('rom');
    },

    watch: {
        'data.ram': {
            handler: function () {
                this.status.ramVerified = this.verifyFormData('ram');
            },
            deep: true
        },
        'data.rom': {
            handler: function () {
                this.status.romVerified = this.verifyFormData('rom');
            },
            deep: true
        }
    },

    methods: {

        // interface
        getInstance: function () {
            return _instance;
        },

        reInitData: function () {

            ['on-chip', 'off-chip'].forEach(memType => {
                this.data.ram[memType].forEach(item => {
                    item.isDef = false;
                    item.addr = '';
                    item.size = '';
                    item.noInit = false;
                });
            });

            ['on-chip', 'off-chip'].forEach(memType => {
                this.data.rom[memType].forEach(item => {
                    item.isDef = false;
                    item.addr = '';
                    item.size = '';
                    item.isStartup = false;
                });
            });
        },

        // method
        onSave: function () {
            _instance.$emit('save');
        },

        onReset: function () {
            _instance.$emit('reset');
        },

        onStartupRomRadioChecked: function (tag, idx) {

            const curTag = tag;
            for (const i in this.data.rom[curTag]) {
                const item = this.data.rom[curTag][i];
                if (i != idx && item.isStartup) item.isStartup = false;
            }

            this.data.rom[curTag][idx].isStartup = true;

            const negTag = tag == 'on-chip' ? 'off-chip' : 'on-chip';
            for (const item of this.data.rom[negTag]) {
                if (item.isStartup) item.isStartup = false;
            }
        },

        verifyFormData: function (memTag) {

            let mem_sum = 0;
            let mem_cnt = 0;
            let has_err = false;

            ['on-chip', 'off-chip'].forEach(memType => {

                this.data[memTag][memType].forEach(item => {

                    const tag = memType == 'on-chip' ? `i${memTag}` : memTag;

                    const eAddr = document.getElementById(`${tag}-${item.id}-addr`);
                    const eSize = document.getElementById(`${tag}-${item.id}-size`);

                    if (item.isStartup != undefined) { // is rom mem
                        const eUsed = document.getElementById(`${tag}-${item.id}-used`);
                        if (item.isStartup && !item.isDef) {
                            eUsed.style.borderColor = 'var(--vscode-inputValidation-errorBorder)';
                            eUsed.style.borderWidth = '1px';
                            eUsed.style.borderStyle = 'dashed';
                            has_err = true;
                        } else {
                            eUsed.style.borderStyle = 'none';
                        }
                    }

                    if (item.isDef || item.isStartup) { // mem is in used, verify its value

                        mem_cnt++;

                        if (/^\s*((?:0x)?[0-9a-f]+|\d+)\s*$/i.test(item.addr)) {
                            eAddr.style.borderStyle = 'none';
                        } else {
                            eAddr.style.borderColor = 'var(--vscode-inputValidation-errorBorder)';
                            eAddr.style.borderWidth = '1px';
                            eAddr.style.borderStyle = 'dashed';
                            has_err = true;
                        }

                        if (/^\s*(?:0x)?[0-9a-f]+\s*$/i.test(item.size)) {
                            eSize.style.borderStyle = 'none';
                            mem_sum += parseInt(item.size.trim(), 16);
                        } else if (/^\s*\d+\s*$/i.test(item.size)) {
                            eSize.style.borderStyle = 'none';
                            mem_sum += parseInt(item.size.trim());
                        } else {
                            eSize.style.borderColor = 'var(--vscode-inputValidation-errorBorder)';
                            eSize.style.borderWidth = '1px';
                            eSize.style.borderStyle = 'dashed';
                            has_err = true;
                        }
                    }

                    else { // mem is unused, not verify it
                        eAddr.style.borderStyle = 'none';
                        eSize.style.borderStyle = 'none';
                    }
                });
            });

            // update ram/rom size txt
            const txt = `    ${(mem_sum / 1024).toFixed(1)} KB (${mem_sum} Bytes)`;
            if (memTag == 'ram') {
                this.status.totalRamSize = txt;
            } else {
                this.status.totalRomSize = txt;
            }

            // update btn status
            return !has_err && mem_cnt > 0;
        },
    },
};
</script>

<style>
@font-face {
    font-family: Consolas;
    font-weight: normal;
    font-style: normal;
    src: url(assets/fonts/consola.ttf);
}

@font-face {
    font-family: Consolas;
    font-weight: bold;
    font-style: normal;
    src: url(assets/fonts/consolab.ttf);
}

/* @font-face {
    font-family: Consolas;
    font-weight: normal;
    font-style: italic;
    src: url(assets/fonts/consolai.ttf);
}

@font-face {
    font-family: Consolas;
    font-weight: bold;
    font-style: italic;
    src: url(assets/fonts/consolaz.ttf);
}
 */
@font-face {
    font-family: "Material Icons";
    font-style: normal;
    font-weight: 400;
    src: local("Material Icons"), local("MaterialIcons-Regular"),
        url(assets/fonts/MaterialIcons-Regular.ttf) format("truetype");
}

.material-icons {
    font-family: "Material Icons";
    font-weight: normal;
    font-style: normal;
    font-size: 24px; /* Preferred icon size */
    display: inline-block;
    line-height: 1;
    text-transform: none;
    letter-spacing: normal;
    word-wrap: normal;
    white-space: nowrap;
    direction: ltr;

    /* Support for all WebKit browsers. */
    -webkit-font-smoothing: antialiased;
    /* Support for Safari and Chrome. */
    text-rendering: optimizeLegibility;

    /* Support for Firefox. */
    -moz-osx-font-smoothing: grayscale;

    /* Support for IE. */
    font-feature-settings: "liga";
}

h4 {
    font-family: Consolas;
    font-weight: normal;
}

table {
    margin-top: 20px;
}

caption {
    font-family: Consolas;
    margin-bottom: 8px;
}

td {
    padding-right: 4px;
}

th {
    font-family: Consolas;
    text-align: left;
}

vscode-text-field {
    font-family: Consolas;
}

vscode-checkbox {
    width: 80px;
}

.container {
    display: grid;
    padding: 0px 12px;
}

.code {
    font-family: Consolas;
    padding-top: 16px;
}

pre {
    font-family: Consolas;
}

.left {
    grid-column: 1;
    margin-right: 8px;
}

.right {
    grid-column: 2;
    margin-left: 8px;
}

#header {
    position: -webkit-sticky;
    /* Safari */
    position: sticky;
    padding: 12px 0px;
    top: 0px;
    z-index: 10;
    background-color: var(--vscode-editor-background) !important;
}

#header-cont {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

#button-cont {
    display: flex;
    justify-items: center;
    justify-content: flex-end;
}

vscode-button {
    margin: 4px;
    margin-left: 8px;
}
</style>
