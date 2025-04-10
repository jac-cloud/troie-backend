import { CONFIG } from '../config';

import * as fs from 'fs';
import * as http from 'https';
import * as os from 'os';

export function checkMasterCertificate() {
  return new Promise<void>((resolve, reject) => {
    try {
      const file = fs.readFileSync(`${os.tmpdir()}/${CONFIG.SECRET_MASTER_NAME}.pem.crt`);
      resolve();
    } catch (err) {
      const finishedActions = [];

      const cert = fs.createWriteStream(`${os.tmpdir()}/${CONFIG.SECRET_MASTER_NAME}.certificate.pem.crt`);
      const privateKey = fs.createWriteStream(`${os.tmpdir()}/${CONFIG.SECRET_MASTER_NAME}.private.pem.key`);
      const amazonRoot = fs.createWriteStream(`${os.tmpdir()}/AmazonRootCA1.pem`);

      http.get(
        `${CONFIG.SECRET_MASTER_ENDPOINT}/${CONFIG.SECRET_MASTER_NAME}.certificate.pem.crt`,
        function (response) {
          response.pipe(cert);
        },
      );

      http.get(`${CONFIG.SECRET_MASTER_ENDPOINT}/${CONFIG.SECRET_MASTER_NAME}.private.pem.key`, function (response) {
        response.pipe(privateKey);
      });

      http.get(`${CONFIG.SECRET_MASTER_ENDPOINT}/AmazonRootCA1.pem`, function (response) {
        response.pipe(amazonRoot);
      });

      cert.on('finish', function () {
        console.log('finish download remote cert');
        finishedActions.push(true);

        if (finishedActions.length === 3) {
          resolve();
        }
      });

      cert.on('error', function () {
        reject();
      });

      amazonRoot.on('finish', function () {
        console.log('finish download amazon cert');
        finishedActions.push(true);

        if (finishedActions.length === 3) {
          resolve();
        }
      });

      amazonRoot.on('error', function () {
        reject();
      });

      privateKey.on('finish', function () {
        console.log('finish download private key');
        finishedActions.push(true);

        if (finishedActions.length === 3) {
          resolve();
        }
      });

      privateKey.on('error', function () {
        reject();
      });
    }
  });
}
