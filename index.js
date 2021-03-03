const express = require('express');
const tls = require('@digitalcredentials/tls-did-resolver');
const { Resolver } = require('did-resolver');
const { rootCertificates } = require('tls');

// Express config
const port = 8080;
const app = express();

// Did resolver config
const jsonRpcUrl = 'http://localhost:8545'; // local testnet
REGISTRY = '0xa725a297b0f81c502df772dbe2d0aeb68788679d'; // testnet tls registry

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
