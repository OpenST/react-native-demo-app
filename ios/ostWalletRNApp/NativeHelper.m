//
//  PepoNativeHelper.m
//  Pepo2
//
//  Created by Rachin Kapoor on 26/09/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "NativeHelper.h"

@implementation NativeHelper

RCT_EXPORT_MODULE(NativeHelper);

RCT_EXPORT_METHOD(getGroupAndDecimalSeparators:(RCTResponseSenderBlock)callback
                  failureCallback:(RCTResponseSenderBlock)errorCallback) {
  
  NSNumberFormatter *formatter = [[NSNumberFormatter alloc] init];
  [formatter setLocale: [NSLocale currentLocale]];
  [formatter setNumberStyle:NSNumberFormatterDecimalStyle];
  [formatter setUsesGroupingSeparator:YES];
  NSNumber *number = [[NSNumber alloc]initWithFloat:1000.1];
  NSString *formattedValue = [formatter stringFromNumber: number];
  
  NSInteger decimalSeparatorIndex = [formattedValue length]-2;
  
  NSString *decimalSeparator = [formattedValue substringWithRange:NSMakeRange(decimalSeparatorIndex, 1)];
  
  NSString *groupSeparator = [formattedValue substringWithRange:NSMakeRange(1, 1)];
  NSMutableString *finalGroupSeparator = [NSMutableString stringWithString:groupSeparator];
  
  if ([groupSeparator caseInsensitiveCompare:@"0"] == NSOrderedSame) {
    finalGroupSeparator = [NSMutableString stringWithString:@""];
  }
  
  
  NSLog(@"decimalSeparator: %@ and groupSeparator: %@", decimalSeparator, finalGroupSeparator);
  
  callback( @[finalGroupSeparator, decimalSeparator] );
}

@end
