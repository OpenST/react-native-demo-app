
import { Easing, Animated,Platform } from 'react-native';


export default {
    zoomIn: ( duration=300 ) =>{ 
      return  {
        transitionSpec: {
          duration,
          easing: Easing.out(Easing.poly(4)),
          timing: Animated.timing,
          useNativeDriver: true,
        },
        screenInterpolator: ({ position, scene }) => {
          const { index } = scene;
          let start = 0;
          if (Platform.OS !== 'ios') {
            start = 0.005
          }
    
          const scale = position.interpolate({
            inputRange: [index - 1, index , index + 1],
            outputRange: [start, 1 , 1],
          });
    
          return { transform: [{ scale }] };
        },
      }
    },
    zoomOut : ( duration=300 ) => {
       return {
            transitionSpec: {
              duration,
              easing: Easing.out(Easing.poly(4)),
              timing: Animated.timing,
              useNativeDriver: true,
            },
            screenInterpolator: ({ position, scene }) => {
              const { index } = scene;
        
              const scale = position.interpolate({
                inputRange: [index - 1, index],
                outputRange: [10, 1],
              });
        
              return { transform: [{ scale }] };
            },
          }
    },
    fromBottom : (duration = 300) => {
      return {
        transitionSpec: {
          duration,
          easing: Easing.out(Easing.poly(4)),
          timing: Animated.timing,
          useNativeDriver: true,
        },
        screenInterpolator: ({ layout, position, scene }) => {
          const { index } = scene;
          const { initHeight } = layout;
    
          const translateY = position.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [initHeight, 0, 0],
          });
    
          const opacity = position.interpolate({
              inputRange: [index - 1, index - 0.99, index],
              outputRange: [0, 1, 1],
            });
    
          return { opacity, transform: [{ translateY }] };
        },
      };
    },
    defaultTransition: ( duration=300  ) => {
        return {
            transitionSpec: {
              duration: 300,
              easing: Easing.out(Easing.poly(4)),
              timing: Animated.timing
            },
            screenInterpolator: (sceneProps) => {
              const { layout, position, scene } = sceneProps;
              const { index } = scene;
      
              const height = layout.initHeight;
              const translateY = position.interpolate({
                inputRange: [index - 1, index, index + 1],
                outputRange: [height, 0, 0]
              });
      
              const opacity = position.interpolate({
                inputRange: [index - 1, index - 0.99, index],
                outputRange: [0, 1, 1]
              });
      
              return { opacity, transform: [{ translateY }] };
            }
          }
    }
}