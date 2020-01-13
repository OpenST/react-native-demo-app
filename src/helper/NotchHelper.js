import DeviceInfo from 'react-native-device-info';

let devicesWithNotch =  [
  {
    "brand": "Apple",
    "model": "iPhone X"
  },
  {
    "brand": "Apple",
    "model": "iPhone XS"
  },
  {
    "brand": "Apple",
    "model": "iPhone XS Max"
  },
  {
    "brand": "Apple",
    "model": "iPhone XR"
  },
  {
    "brand": "Asus",
    "model": "ZenFone 5"
  },
  {
    "brand": "Asus",
    "model": "ZenFone 5z"
  },
  {
    "brand": "Huawei",
    "model": "P20"
  },
  {
    "brand": "Huawei",
    "model": "P20 Plus"
  },
  {
    "brand": "Huawei",
    "model": "P20 Lite"
  },
  {
    "brand": "Huawei",
    "model": "Honor 10"
  },
  {
    "brand": "Huawei",
    "model": "Nova 3"
  },
  {
    "brand": "Huawei",
    "model": "Nova 3i"
  },
  {
    "brand": "Oppo",
    "model": "R15"
  },
  {
    "brand": "Oppo",
    "model": "R15 Pro"
  },
  {
    "brand": "Oppo",
    "model": "F7"
  },
  {
    "brand": "Vivo",
    "model": "V9"
  },
  {
    "brand": "Vivo",
    "model": "X21"
  },
  {
    "brand": "Vivo",
    "model": "X21 UD"
  },
  {
    "brand": "OnePlus",
    "model": "6"
  },
  {
    "brand": "OnePlus",
    "model": "A6003"
  },
  {
    "brand": "OnePlus",
    "model": "OnePlus A6003"
  },
  {
    "brand": "LG",
    "model": "G7"
  },
  {
    "brand": "LG",
    "model": "G7 ThinQ"
  },
  {
    "brand": "LG",
    "model": "G7+ ThinQ"
  },
  {
    "brand": "Leagoo",
    "model": "S9"
  },
  {
    "brand": "Oukitel",
    "model": "U18"
  },
  {
    "brand": "Sharp",
    "model": "Aquos S3"
  },
  {
    "brand": "Nokia",
    "model": "6.1 Plus"
  },
  {
    "brand": "xiaomi",
    "model": "Redmi Note 7 Pro"
  },
  {
    "brand": "HONOR",
    "model": "COR-AL00"
  },
  {
    "brand": "HONOR",
    "model": "JSN-L42"
  },
  {
    "brand": "OnePlus",
    "model": "ONEPLUS A6010"
  }
];

class NotchHelper {

  syncList(){
    fetch(`https://d3attjoi5jlede.cloudfront.net/pepo-app/devices-list/notch-devices.json?${Date.now()}`)
      .then((response) => response.json())
      .then((responseJson) => {
        const devices = responseJson && responseJson.devices;
        if( devices && devices instanceof Array && devices.length > 0 ) {
          devicesWithNotch = devices;
        }
      })
      .catch((error) => {
        console.log("Notch helper fetch error ignored");
      });
  }

  hasNotchRemote(){
      if(devicesWithNotch.length > 0){
          return (
              devicesWithNotch.findIndex(
                  item =>
                      item.brand.toLowerCase() === DeviceInfo.getBrand().toLowerCase() &&
                      (item.model.toLowerCase() === DeviceInfo.getDeviceName().toLowerCase() || item.model.toLowerCase() === DeviceInfo.getModel().toLowerCase())
              ) !== -1
          );
      }
      return false;
  }

  hasNotch() {
    return DeviceInfo.hasNotch() || this.hasNotchRemote();
  }

}

export default new NotchHelper()
