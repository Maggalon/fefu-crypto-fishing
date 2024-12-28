import { generateMnemonic, mnemonicToEntropy } from "ethereum-cryptography/bip39";
import { wordlist } from "ethereum-cryptography/bip39/wordlists/english";
import { HDKey } from "ethereum-cryptography/hdkey";
import { secp256k1 } from "ethereum-cryptography/secp256k1.js"
import { keccak256 } from "ethereum-cryptography/keccak";
import { bytesToHex } from "ethereum-cryptography/utils";
import { encrypt, decrypt } from "@metamask/browser-passworder";

const _generateMnemonic = () => {
    const strenth = 256;
    const mnemonic = generateMnemonic(wordlist, strenth);
    const entropy = mnemonicToEntropy(mnemonic, wordlist);
    return {mnemonic, entropy};
}

const _getHdRootKey = (_mnemonic: Uint8Array<ArrayBufferLike>) => {
    return HDKey.fromMasterSeed(_mnemonic);
}

const _generatePrivateKey = (_hdRootKey: HDKey, _accountIndex: number) => {
    // Use standard Ethereum derivation path
    // m/44'/60'/0'/0/index
    const path = `m/44'/60'/0'/0/${_accountIndex}`;
    return _hdRootKey.derive(path).privateKey;
}

const _getPublicKey = (_privateKey: Uint8Array<ArrayBufferLike>) => {
    return secp256k1.getPublicKey(_privateKey, false); // false for uncompressed
}

const _getEthAddress = (_publicKey: Uint8Array<ArrayBufferLike>) => {    
    const publicKeyWithoutPrefix = _publicKey.slice(1);
    return keccak256(publicKeyWithoutPrefix).slice(-20);
}

const _storeWallet = async (_privateKey: string, _publicKey: string, _address: string, password: string) => {
    
    const accountInfo = {
        privateKey: _privateKey, 
        publicKey: _publicKey,
        address: _address
    }
    
    encrypt(password, accountInfo)
              .then(blob => {
                localStorage.setItem('accountInfo', blob)
                console.log("Account data successfully stored to local storage");
              })
}

export const createWallet = async (password: string) => {
    const { mnemonic, entropy } = _generateMnemonic();
    console.log(`WARNING! Never disclose your Seed Phrase:\n ${mnemonic}`);
    
    const hdRootKey = _getHdRootKey(entropy);
    const accountOneIndex = 0;
    const accountOnePrivateKey = _generatePrivateKey(hdRootKey, accountOneIndex);
    //console.log(bytesToHex(accountOnePrivateKey));
    const accountOnePublicKey = _getPublicKey(accountOnePrivateKey!);
    //console.log(bytesToHex(accountOnePublicKey));
    const accountOneAddress = _getEthAddress(accountOnePublicKey);
    const readableAddress = `0x${bytesToHex(accountOneAddress)}`

    _storeWallet(`0x${bytesToHex(accountOnePrivateKey!)}`, `0x${bytesToHex(accountOnePublicKey)}`, readableAddress, password)

    return {mnemonic, readableAddress}
}

export const restoreWallet = async (_mnemonic: string, password: string) => {
    const entropy = mnemonicToEntropy(_mnemonic, wordlist);
    const hdRootKey = _getHdRootKey(entropy);
    const privateKey = _generatePrivateKey(hdRootKey, 0);
    const publicKey = _getPublicKey(privateKey!);
    const address = _getEthAddress(publicKey);

    _storeWallet(`0x${bytesToHex(privateKey!)}`, `0x${bytesToHex(publicKey)}`, `0x${bytesToHex(address)}`, password)
}

export const getWallet = async (password: string) => {
    const blob = localStorage.getItem('accountInfo')
    
    const result = await decrypt(password, blob!) || undefined
    
    return result;
}
