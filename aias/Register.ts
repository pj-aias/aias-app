import RNSecureStorage, { ACCESSIBLE } from "rn-secure-storage";
import Tor from 'react-native-tor';
import { keyTag } from './Core';
import { RSAKeychain } from "react-native-rsa-native";

const ISSUER_DOMAIN = "2jz6o2vhsfb55tk2lv73gauoxjmh2uisra65umzkg22yq67mzkvg6ayd.onion";

const sendPhoneNumber = async (phoneNumber: string) => {
    const tor = Tor();
    const body = JSON.stringify({ phone_number: phoneNumber });
    let cookie = "";
    try {
        await tor.startIfNotStarted();
    }
    catch (e) { }
    try {
        const resp = await tor.post(`http://${ISSUER_DOMAIN}/send_code`, body, { 'Content-Type': 'text/json' });
        const setCookie = resp.headers["set-cookie"][0];

        cookie = setCookie.split(";")[0]

        console.log(`result: ${setCookie}`);
        console.log(`result: ${resp.respCode}`);
    } catch (error) {
        throw error;
    }

    await tor.stopIfRunning();
    return cookie;
}

const verifyCode = async (code: string, cookie: string) => {
    const tor = Tor();
    const keys = await RSAKeychain.generateKeys(keyTag, 2048);

    const body = JSON.stringify({ code, pubkey: keys.public });
    const headers = { 'Content-Type': 'text/json', "Cookie": cookie };

    try {
        await tor.startIfNotStarted();
    }
    catch (e) { }

    try {

        const resp = await tor.post(`http://${ISSUER_DOMAIN}/verify_code`, body, headers);

        await RNSecureStorage.set('pubkey', keys.public, {
            accessible: ACCESSIBLE.WHEN_UNLOCKED,
        });

        const _public = await RNSecureStorage.get('public');
        console.log('public=' + _public);


        await RNSecureStorage.set('cert', resp.json.cert, {
            accessible: ACCESSIBLE.WHEN_UNLOCKED,
        });

        const _cert = await RNSecureStorage.get('cert');
        console.log('_cert=' + _cert);


    } catch (error) {
        throw error;
    }

    tor.stopIfRunning();
}

export { sendPhoneNumber, verifyCode };
