const base_url= 'http://192.168.20.45:9001/v1';
const ips_access_url = `${base_url}/token`;
const ips_payment_url = `${base_url}/iso20022/incoming`;
const digest_url="http://10.1.3.53:7000/api/digest";
const jwt_assertion='eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJBQkFZRVRBQSIsImNlcnRfaXNzIjoiQ049VEVTVCBFVFMgSVBTIElzc3VpbmcgQ0EsIE89RXRoU3dpdGNoLCBDPUVUIiwiY2VydF9zbiI6IjQyMzcxNDE1OTE1MzI3NDIyMzk3MzIwNDExNjMxNDc3NTk0MjE5MTkwNjg4OSIsImp0aSI6IjE3NzY0MTIxMzEwMDAiLCJleHAiOjE3NzY0MTIxMzEsImFsZyI6IlJTMjU2In0.lrGwOyDMNWcKH3I0cAw6nAX2eD7B8sZuRMcYxyd_vkKh9slTCWPbkFiKK4EFcgmxT68jY-WxeCFRJicbRg0cs4GZoV9J-EKWjWowrDi74DHaPkXQBiO9hXnymWIaL_3nltxRmqRncZPDk36moN734gKU5ND75xzjnnmtqTmR24-yxO62eoaxG_N3lYqOq6wY-52T3wIi-gxtNYLwMpLICnNNezsKPxAvYScs7xDv9yiiDiLeYBAX0fslH8Hj5QCfEO5zBaq-55yPN6ypg6LXG-Kz1MIRcwkhJIN7PY_23tdSMw5zBzqNrpJgCZakgVXX3ybW_GbhBlsZmzItYeHAfw';
//test Url
//const digest_url="http://10.1.50.56:9000/api/verify/digest";
//const verification_url = "http://10.1.50.56:9000/api/verify/digest";

module.exports={jwt_assertion,base_url,ips_access_url,ips_payment_url,digest_url};