const base_url= 'http://192.168.20.45:9001/v1';
const access_url = `${base_url}/token`;
const verification_url = `${base_url}/iso20022/incoming`;
const digest_url="http://10.1.3.53:7000/api/digest";
//test Url
//const digest_url="http://10.1.50.56:9000/api/verify/digest";
//const verification_url = "http://10.1.50.56:9000/api/verify/digest";

module.exports={base_url,access_url,verification_url,digest_url};