# react-native-demo-app


# Setup

## Add demo server configuration
By default the application is connected to Popcorn economy hosted on sandbox environment.
Use your own sandbox economy, scan the QR code of your sandbox economy and update the `demo-server-config.json` file. The QR contains json configuration.
Path of `demo-server-config.json` file:
```
react-native-demo-app/src/constants/demo-server-config.json
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


