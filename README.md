# tls-did-driver

Driver for the TLS DID Method. This repository contains a docker setup for
dockerized tls-did-resolver.

## Docker Build

```shell
docker build -t <username>/did-resolver-goerli .
```

## Docker Run

```shell
docker run -p <exposed port>:8080 -d <username>/did-resolver-goerli
```

## Docker Test

```shell
http://localhost:<exposed port>/1.0/identifiers/did:tls:tls-did.de
```
