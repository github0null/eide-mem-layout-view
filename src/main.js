import Vue from 'vue'
import App from './App.vue'

const TAG = '[eide mem layout view] ';

Vue.config.productionTip = false

let appInstance = undefined
let initData = undefined
let inited = false
let appData = App.data()

//////////////////////////////////////////////////////////
// entry
//////////////////////////////////////////////////////////

// eslint-disable-next-line no-undef
const vscode = acquireVsCodeApi();

// receive vscode event
window.addEventListener('message', event => {

    // is a string
    if (typeof event.data == 'string') {
        switch (event.data) {
            case 'eide.mem-layout.status.done':
                break;
            case 'eide.mem-layout.status.fail':
                break;
            default:
                break;
        }
    }

    // is app data
    else {
        if (!inited) {
            initData = event.data;
            initAppData();
            initApp();
            inited = true;
        } else {
            initData = event.data;
            reset(initData.CURRENT);
        }
    }
})

// add ctrl+s event callbk
document.addEventListener('keydown', function (e) {
    if (e.key.toLowerCase() == 's' && e.ctrlKey) {
        e.preventDefault();
        save();
    }
});

// launch done, notify to vscode
vscode.postMessage('eide.mem-layout.launched')

//////////////////////////////////////////////////////////
// funcs
//////////////////////////////////////////////////////////

function initApp() {
    if (inited) return
    inited = true; /* set init flag */
    console.log(TAG + 'start init and create page ...')
    new Vue({ render: h => h(App) }).$mount('#app') /* create and init page */
    appInstance = App.methods.getInstance()
    appInstance.$on('save', () => save())
    appInstance.$on('reset', () => reset())
    console.log(TAG + 'app inited done !')
}

/* data's type:

    export type RAMTag = 'IRAM' | 'RAM';
    export type ROMTag = 'IROM' | 'ROM';

    export interface Memory {
        startAddr: string;
        size: string;
    }

    export interface ARMRamItem {
        tag: RAMTag;
        id: number;
        mem: Memory;
        isChecked: boolean;
        noInit: boolean;
    }

    export interface ARMRomItem {
        tag: ROMTag;
        id: number;
        mem: Memory;
        isChecked: boolean;
        isStartup: boolean;
    }

    export interface ARMStorageLayout {
        RAM: ARMRamItem[];
        ROM: ARMRomItem[];
    }
*/
function initAppData() {

    reset(initData.CURRENT);

    console.log(`${TAG}init data: ` + JSON.stringify(appData.data, undefined, 2));

    if (initData.DEF) appData.status.canReset = true;
}

function save() {

    console.log(`${TAG}save data: ` + JSON.stringify(appData.data, undefined, 2));

    //TODO
}

function reset(memLayoutData) {

    if (inited) {
        appInstance.reInitData();
    }

    const data = memLayoutData || initData.DEF;

    if (!memLayoutData) {
        console.log(TAG + `reset data by default value.`);
    }

    for (const ramItem of data.RAM) {
        const dat = appData.data.ram[ramItem.tag == 'IRAM' ? 'on-chip' : 'off-chip'][ramItem.id - 1];
        dat.isDef = ramItem.isChecked;
        dat.addr = ramItem.mem.startAddr;
        dat.size = ramItem.mem.size;
        dat.noInit = ramItem.noInit;
    }

    for (const romItem of data.ROM) {
        const dat = appData.data.rom[romItem.tag == 'IROM' ? 'on-chip' : 'off-chip'][romItem.id - 1];
        dat.isDef = romItem.isChecked;
        dat.addr = romItem.mem.startAddr;
        dat.size = romItem.mem.size;
        dat.isStartup = romItem.isStartup;
    }
}
