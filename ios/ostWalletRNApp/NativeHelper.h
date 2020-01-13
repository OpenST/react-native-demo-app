//
//  PepoNativeHelper.h
//  Pepo2
//
//  Created by Rachin Kapoor on 26/09/19.
//  Copyright © 2019 Facebook. All rights reserved.
//


#import <Foundation/Foundation.h>

#if __has_include("RCTBridgeModule.h")
#import "RCTBridgeModule.h"
#else
#import <React/RCTBridgeModule.h>
#endif

NS_ASSUME_NONNULL_BEGIN

@interface NativeHelper : NSObject <RCTBridgeModule>

@end


NS_ASSUME_NONNULL_END

