import { RSAKeychain, RSA } from "react-native-rsa-native";
import RNSecureStorage from "rn-secure-storage";
import Tor from 'react-native-tor';
import { keyTag } from './Core';

type IssueCredential = {
    cert: string, pubkey: string
}

type AIASCredential = {
    credential: any,
    pubkey: any,
}
const issue = async (domains: string[]) => {
    const tor = Tor();
    // try {
    //     await tor.startIfNotStarted();
    // }
    // catch (e) { }
    const usk = [];

    let pubkey: string | null = "";
    let cert: string | null = ";"

    pubkey = await RNSecureStorage.get('pubkey');
    console.log('pubkey=' + pubkey);

    cert = await RNSecureStorage.get('cert');
    console.log('cert=' + cert);

    const cred: IssueCredential = {
        pubkey: (pubkey as string),
        cert: (cert as string),
    };

    const partialGPK = [];
    const allCombinedGPK = [];

    for (const domain of domains) {
        try {
            const partial_usk = await requestPartialUsk(cred, domain, domains, tor);
            const pubkey = await requestPubkey(domains, domain, tor);

            usk.push(partial_usk);
            partialGPK.push(pubkey.partial)
            allCombinedGPK.push(pubkey.combined)
        } catch (e) {
            console.log(e);
            await tor.stopIfRunning();

            throw e;
        }

    }

    const combinedGPK = JSON.stringify(allCombinedGPK[0]);
    const filtered = allCombinedGPK.filter(x => JSON.stringify(x) != combinedGPK);

    if (filtered.length !== 0) {
        await tor.stopIfRunning();
        throw Error("pubkey is wrong");
    }

    console.log(`usk: ${JSON.stringify(usk)}`);
    console.log(`pubkeys: ${combinedGPK}`);

    await tor.stopIfRunning();

    return `?credential=${JSON.stringify(usk)}&pubkey=${combinedGPK}`;

}

const requestPubkey = async (domains: string[], domain: String, tor: any) => {
    console.log(`http://${domain}/pubkey`);

    const resp = await tor.post(`http://${domain}/pubkey`, JSON.stringify({ "domains": domains }), { 'Content-Type': 'text/json' });
    return resp.json
}

const requestPartialUsk = async (cred: IssueCredential, domain: string, domains: string[], tor: any) => {
    let cookie = "";
    let nonce = "";

    console.log(`http://${domain}/challenge`);

    const challenge_resp = await tor.get(`http://${domain}/challenge`);
    nonce = challenge_resp.json.nonce;
    console.log(nonce);

    const setCookie = challenge_resp.headers["set-cookie"][0];
    cookie = setCookie.split(";")[0];
    console.log(`result: ${setCookie}`);
    console.log(`result: ${challenge_resp.respCode}`);

    const _signature = await RSAKeychain.signWithAlgorithm(nonce, keyTag, RSA.SHA256withRSA as any);
    const signature = _signature.replace(/\n/g, "");

    const body = JSON.stringify({ signature, domains, cert: cred.cert, pubkey: cred.pubkey });

    console.log(`http://${domain}/issue`);

    const resp = await tor.post(`http://${domain}/issue`, body, { 'Content-Type': 'text/json', "Cookie": cookie });
    return resp.json
}

export { issue };
