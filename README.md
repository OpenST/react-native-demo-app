# react-native-demo-app


# Setup

## Add demo server configuration

To use your own sandbox economy, scan the QR code of your sandbox economy and update the `demo-server-config.json` file. The QR contains json configuration.

Path of `demo-server-config.json` file:
```
react-native-demo-app/src/constants/demo-server-config.json
```

To get started right away, developers can use the config of popcorn economy.
Popcorn economy is hosted by OST platform on Sandbox environment.
```
{"token_id":1400,"token_name":"Popcorn","token_symbol":"POP","url_id":"55c0c94b98ef6362e7d2d10fe60572819d7d31e54f8017aaba95eb225cc1bff7","mappy_api_endpoint":"https://demo-mappy.ost.com/demo/","saas_api_endpoint":"https://api.ost.com/testnet/v2/","view_api_endpoint":"https://view.ost.com/testnet/"}
```

To avoid pushing config into github use the below command:
```
git update-index --skip-worktree ./src/constants/demo-server-config.json
```

## Install npm modules
```
npm install
```

# iOS Setup

## Go to ios folder
```
cd ios
```

## Install/Update dependencies using Carthage
`ost-wallet-sdk-ios` and other downstream dependencies of `ost-wallet-sdk-ios` are installed using Carthage.

```
carthage update --platform ios
```

## Install/Update Pods.
`react-native` and other react-native-community dependencies are  installed using Pods.
```
pod update
```

## Open and run the application using xcode.
- Open the `ostWalletRNApp.xcworkspace` in xcode.

```
open ostWalletRNApp.xcworkspace
```


