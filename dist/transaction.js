"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const algokit_utils_1 = require("@algorandfoundation/algokit-utils");
const algosdk = __importStar(require("algosdk"));
const dotenv = __importStar(require("dotenv"));
const amount_1 = require("@algorandfoundation/algokit-utils/types/amount");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
dotenv.config();
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
async function getTestAccount(algorand) {
    const myTestAcct = await algorand.account.fromEnvironment("LARKIN");
    const dispenserClient = algorand.client.getTestNetDispenserFromEnvironment();
    await algorand.account.ensureFundedFromTestNetDispenserApi(myTestAcct, dispenserClient, (2.5).algo(), {});
    return myTestAcct;
}
async function Level0() {
    try {
        const APP_ID = 723450047n;
        const algorand = algokit_utils_1.AlgorandClient.testNet();
        const myTestAcct = await getTestAccount(algorand);
        console.log(`Opting in to application ID ${APP_ID}...`);
        const response = await algorand.send.appCall({
            sender: myTestAcct.addr,
            onComplete: algosdk.OnApplicationComplete.OptInOC,
            appId: APP_ID,
        });
        console.log(`Successfully opted in to application ID ${APP_ID}.`);
    }
    catch (error) {
        console.error("Error during application opt-in:", error.message);
    }
}
async function Level1() {
    try {
        const APP_ID = 723190722n;
        const PREV_APP_ID = 723190719n;
        const algorand = algokit_utils_1.AlgorandClient.testNet();
        const myTestAcct = await getTestAccount(algorand);
        const app = await algorand.app.getById(APP_ID);
        // Wait in case test account needed to be funded
        await delay(5000);
        console.log(`Sending payment and opt-in txn to ${APP_ID}...`);
        const result = await algorand.send
            .newGroup()
            .addPayment({
            amount: amount_1.AlgoAmount.Algos(1),
            receiver: app.appAddress,
            sender: myTestAcct.addr,
        })
            .addAppCall({
            sender: myTestAcct.addr,
            onComplete: algosdk.OnApplicationComplete.OptInOC,
            appId: APP_ID,
            appReferences: [PREV_APP_ID],
        })
            .send();
        console.log(`Successfully sent payment and opt-in txns to ${APP_ID}.`);
    }
    catch (error) {
        console.error("Error:", error.message);
    }
}
async function Level2() {
    try {
        const APP_ID = 723190723n;
        const PREV_APP_ID = 723190722n;
        const algorand = algokit_utils_1.AlgorandClient.testNet();
        const myTestAcct = await getTestAccount(algorand);
        const app = await algorand.app.getById(APP_ID);
        // Wait in case test account needed to be funded
        await delay(5000);
        console.log(`Sending payment and opt-in txn to ${APP_ID}...`);
        const result = await algorand.send
            .newGroup()
            .addPayment({
            amount: amount_1.AlgoAmount.Algos(1),
            receiver: app.appAddress,
            sender: myTestAcct.addr,
            staticFee: amount_1.AlgoAmount.MicroAlgos(2000),
        })
            .addAppCall({
            sender: myTestAcct.addr,
            onComplete: algosdk.OnApplicationComplete.OptInOC,
            appId: APP_ID,
            appReferences: [PREV_APP_ID],
            staticFee: amount_1.AlgoAmount.Algos(0),
        })
            .send();
        console.log(`Successfully completed task for ${APP_ID}.`);
    }
    catch (error) {
        console.error("Error:", error.message);
    }
}
async function Level3() {
    try {
        const APP_ID = 723190735n;
        const PREV_APP_ID = 723190723n;
        const algorand = algokit_utils_1.AlgorandClient.testNet();
        const myTestAcct = await getTestAccount(algorand);
        const app = await algorand.app.getById(APP_ID);
        // Wait in case test account needed to be funded
        await delay(5000);
        console.log(`Sending transactions to ${APP_ID}...`);
        const result = await algorand.send
            .newGroup()
            .addAppCall({
            sender: myTestAcct.addr,
            onComplete: algosdk.OnApplicationComplete.OptInOC,
            appId: APP_ID,
            appReferences: [PREV_APP_ID],
        })
            .addAppCall({
            sender: myTestAcct.addr,
            onComplete: algosdk.OnApplicationComplete.ClearStateOC,
            appId: APP_ID,
        })
            .addAppCall({
            sender: myTestAcct.addr,
            onComplete: algosdk.OnApplicationComplete.OptInOC,
            appId: APP_ID,
        })
            .send();
        console.log(`Successfully completed task for ${APP_ID}.`);
    }
    catch (error) {
        console.error("Error:", error.message);
    }
}
async function Level4() {
    try {
        const APP_ID = 723190738n;
        const PREV_APP_ID = 723190735n;
        const FOREIGN_APP_ID = 723459001n;
        const algorand = algokit_utils_1.AlgorandClient.testNet();
        const myTestAcct = await getTestAccount(algorand);
        const app = await algorand.app.getById(APP_ID);
        // Wait in case test account needed to be funded
        await delay(5000);
        console.log(`Sending transactions to ${APP_ID} from address ${myTestAcct.addr}...`);
        const result = await algorand.send
            .newGroup()
            .addAppCall({
            sender: myTestAcct.addr,
            onComplete: algosdk.OnApplicationComplete.OptInOC,
            appId: APP_ID,
            appReferences: [PREV_APP_ID, FOREIGN_APP_ID],
        })
            .send();
        console.log(`Successfully completed task for ${APP_ID}.`);
    }
    catch (error) {
        console.error("Error:", error.message);
    }
}
async function Level5() {
    try {
        const APP_ID = 723190739n;
        const PREV_APP_ID = 723190738n;
        const algorand = algokit_utils_1.AlgorandClient.testNet();
        const myTestAcct = await getTestAccount(algorand);
        const app = await algorand.app.getById(APP_ID);
        // Wait in case test account needed to be funded
        await delay(5000);
        console.log(`Sending transactions to ${APP_ID} from address ${myTestAcct.addr}...`);
        const BOX_1 = new TextEncoder().encode("box1");
        const BOX_2 = new TextEncoder().encode("box2");
        const BOX_3 = new TextEncoder().encode("box3");
        const BOX_4 = new TextEncoder().encode("box4");
        const BOX_5 = new TextEncoder().encode("box5");
        const BOX_6 = new TextEncoder().encode("box6");
        const BOX_7 = new TextEncoder().encode("box7");
        const boxResults = await algorand.app.getBoxNames(APP_ID);
        const boxValues = await algorand.app.getBoxValues(APP_ID, boxResults.map((box) => box.nameRaw));
        const boxWithBall = boxValues.findIndex((box) => new TextDecoder().decode(box) === "ball");
        const result = await algorand.send
            .newGroup()
            .addAppCall({
            args: [boxResults[boxWithBall].nameRaw],
            sender: myTestAcct.addr,
            onComplete: algosdk.OnApplicationComplete.OptInOC,
            appId: APP_ID,
            appReferences: [PREV_APP_ID],
            boxReferences: [BOX_1, BOX_2, BOX_3, BOX_4, BOX_5, BOX_6, BOX_7],
        })
            .send();
        console.log(`Successfully completed task for ${APP_ID}.`);
    }
    catch (error) {
        console.error("Error:", error.message);
    }
}
async function Level6() {
    try {
        const APP_ID = 723190754n;
        const PREV_APP_ID = 723190739n;
        const CALC_APP_ID = 723517896n;
        const algorand = algokit_utils_1.AlgorandClient.testNet();
        const myTestAcct = await getTestAccount(algorand);
        const app = await algorand.app.getById(APP_ID);
        // Wait in case test account needed to be funded
        await delay(5000);
        console.log(`Sending transactions to LEVEL 6 (${APP_ID}) from address ${myTestAcct.addr}...`);
        const result = await algorand.send
            .newGroup()
            .addAppCall({
            args: [algosdk.encodeUint64(CALC_APP_ID)],
            sender: myTestAcct.addr,
            onComplete: algosdk.OnApplicationComplete.OptInOC,
            appId: APP_ID,
            extraFee: amount_1.AlgoAmount.Algos(0.1),
            appReferences: [PREV_APP_ID, CALC_APP_ID],
        })
            .send();
        console.log(`Successfully completed task for ${APP_ID}.`);
    }
    catch (error) {
        console.error("Error:", error.message);
    }
}
async function Level7() {
    try {
        const APP_ID = 723190755n;
        const PREV_APP_ID = 723190754n;
        const AUTH_APP_ID = 723943234n;
        const algorand = algokit_utils_1.AlgorandClient.testNet();
        const myTestAcct = await getTestAccount(algorand);
        const result = await algorand.send
            .newGroup()
            .addAppCallMethodCall({
            appId: AUTH_APP_ID,
            method: algosdk.ABIMethod.fromSignature("authorize()void"),
            sender: myTestAcct.addr,
            staticFee: (2000).microAlgos(),
            appReferences: [APP_ID, PREV_APP_ID],
        })
            .addAppCall({
            sender: myTestAcct.addr,
            onComplete: algosdk.OnApplicationComplete.OptInOC,
            appId: APP_ID,
            appReferences: [PREV_APP_ID],
        })
            .send();
        console.log(`Successfully completed task for ${APP_ID}.`);
    }
    catch (error) {
        console.error("Error:", error.message);
    }
}
async function Level8() {
    try {
        const APP_ID = 723190758n;
        const PREV_APP_ID = 723190755n;
        const ASSET_ID = 723190772n;
        const APP_ADDR = "FCBREC7XDM5ULHVZNRL7Q23CPSVA4FJMQLR7NGYUYISRUEDMYRTLOZDPRA";
        const algorand = algokit_utils_1.AlgorandClient.testNet();
        const testAcct = await getTestAccount(algorand);
        await algorand.send.assetTransfer({
            amount: 0n,
            assetId: ASSET_ID,
            receiver: testAcct.addr,
            sender: testAcct.addr,
        });
        const filePath = path.join(__dirname, "lsig.teal");
        const lsigCode = fs.readFileSync(filePath, "utf8");
        const { compiledBase64ToBytes: program } = await algorand.app.compileTeal(lsigCode);
        const lsigAcct = algorand.account.logicsig(program);
        await algorand.send
            .newGroup()
            .addAssetTransfer({
            amount: 1n,
            assetId: ASSET_ID,
            receiver: testAcct.addr,
            sender: APP_ADDR,
            clawbackTarget: lsigAcct.addr,
            staticFee: (0).algos(),
            signer: lsigAcct,
        })
            .addAppCall({
            sender: testAcct.addr,
            onComplete: algosdk.OnApplicationComplete.OptInOC,
            appId: APP_ID,
            appReferences: [PREV_APP_ID],
            assetReferences: [ASSET_ID],
            staticFee: (3000).microAlgos(),
        })
            .send();
    }
    catch (error) {
        console.error("Error:", error.message);
    }
}
Level8();
