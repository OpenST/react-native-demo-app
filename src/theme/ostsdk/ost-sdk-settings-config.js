import {DEFAULT_SESSION_KEY_EXPIRY_TIME, DEFAULT_SPENDING_LIMIT} from "../../constants/AppConfig";
import {appProvider} from '../../helper/AppProvider';

export default {
  item_configs:{
    add_session: {
      config: {
        "spending_limit": DEFAULT_SPENDING_LIMIT,
          "expiration_time": DEFAULT_SESSION_KEY_EXPIRY_TIME
      }
    },
    wallet_details:{
      config: {
        ost_view_endpoint: appProvider.getViewApiEndpoint()
      }
    }
  }
}