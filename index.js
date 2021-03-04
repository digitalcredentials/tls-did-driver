const express = require('express');
const tls = require('@digitalcredentials/tls-did-resolver');
const { Resolver } = require('did-resolver');
const { rootCertificates } = require('tls');

// Express config
const port = 8080;
const app = express();

// Did resolver config
const jsonRpcUrl = 'https://goerli.infura.io/v3/923dab15302f45aba7158692f117ac0c'; // goerli testnet
REGISTRY = '0x60492b0755D8dba01dB9915a1f8Bf28D242BF6dC'; // goerli tls-did registry

// Resolver instantiation
const tlsResolver = tls.getResolver(
  {
    rpcUrl: jsonRpcUrl,
  },
  REGISTRY,
  rootCertificates
);
const resolver = new Resolver({ ...tlsResolver });

// Express setup
app.get('/1.0/identifiers/:did', async (req, res) => {
  try {
    console.log('Resolving', req.params.did);
    const doc = await resolver.resolve(req.params.did);
    res.status(200).send(doc);
  } catch (err) {
    console.error(err);
    if (
      err.message.match(/(Unsupported DID method:)|(Invalid DID)|(contracts were found.)/)
    ) {
      res.status(400).send(err.toString());
    } else {
      res.status(500).send(err.toString());
    }
  }
});

app.listen(port, function () {
  console.log(`Resolver app listening on port ${port}...`);
});
