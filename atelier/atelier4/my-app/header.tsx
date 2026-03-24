import React, { useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Animated, ImageBackground, Dimensions } from 'react-native';

type HeaderProps = {
  title: string;
};

export const Header = ({ title }: HeaderProps) => {
  const translate = useRef(new Animated.Value(0)).current;
  const { width } = Dimensions.get('window');

  useEffect(() => {
    Animated.loop(
      Animated.timing(translate, {
        toValue: -width,
        duration: 8000,
        useNativeDriver: true,
      })
    ).start();
  }, [translate, width]);

  return (
    <View style={styles.headerWrapper}>
      <ImageBackground
        source={require('./assets/julien.png')}
        style={styles.imageBg}
        resizeMode="cover"
      >
        <Animated.View
          style={{
            ...styles.animatedLayer,
            transform: [{ translateX: translate }],
          }}
        />
        <Text style={styles.headerText}>{title}</Text>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    width: '100%',
    height: 120,
    overflow: 'hidden',
    marginTop: 40,
  },
  imageBg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedLayer: {
    position: 'absolute',
    width: '200%',
    height: '100%',
  },
  headerText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
});