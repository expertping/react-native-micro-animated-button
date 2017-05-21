import React, { Component } from 'react';
import {
  ActivityIndicator,
  Animated,
  Text,
  TouchableOpacity
} from 'react-native';

import TouchableBounce
  from 'react-native/Libraries/Components/Touchable/TouchableBounce';

import { FontAwesome } from '@expo/vector-icons';

export default class Button extends Component {
  state = { step: 0, error: false };

  animated = new Animated.Value(0);

  successBackgroundColor = this.animated.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [
      this.props.backgroundColor || 'white',
      this.props.backgroundColor || 'white',
      this.props.successColor || this.props.foregroundColor || 'green'
    ]
  });

  errorBbackgroundColor = this.animated.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [
      this.props.backgroundColor || 'white',
      this.props.backgroundColor || 'white',
      this.props.errorColor || this.props.foregroundColor || 'red'
    ]
  });

  width = this.animated.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [
      this.props.maxWidth || 240,
      this.props.minWidth || 40,
      this.props.minWidth || 40
    ]
  });

  press = () => {
    this.setState({ step: 1 });
    Animated.spring(this.animated, { toValue: 1 }).start(animation => {
      if (animation.finished && this.props.onPress) this.props.onPress();
    });
  };

  success = () => {
    this.setState({ step: 2 });
    Animated.spring(this.animated, { toValue: 2 }).start(animation => {
      if (animation.finished && this.props.onSuccess) this.props.onSuccess();
    });
  };

  error = () => {
    this.setState({ step: 2, error: true });
    Animated.spring(this.animated, { toValue: 2 }).start(animation => {
      if (animation.finished && this.props.onError) this.props.onError();
    });
  };

  render() {
    const button = (
      <Animated.View
        style={[
          {
            alignItems: 'center',
            backgroundColor: this.state.error
              ? this.errorBbackgroundColor
              : this.successBackgroundColor,
            borderColor: this.state.step === 2
              ? this.state.error
                  ? this.props.errorColor || this.props.foregroundColor || 'red'
                  : this.props.successColor ||
                      this.props.foregroundColor ||
                      'green'
              : this.props.foregroundColor || 'black',
            flex: 0,
            justifyContent: 'center',
            width: this.width
          },
          styles.button,
          this.props.style
        ]}>
        {this.state.step === 0 &&
          <Text
            style={[
              { color: this.props.foregroundColor || 'black' },
              styles.label,
              this.props.labelStyle
            ]}>
            {this.props.label}
          </Text>}
        {this.state.step === 1 &&
          (this.props.renderIndicator ||
            <ActivityIndicator
              color={this.props.foregroundColor || 'black'}
            />)}
        {this.state.step === 2 &&
          (this.props.renderIcon ||
            <FontAwesome
              color={
                this.state.error
                  ? this.props.errorIconColor || 'white'
                  : this.props.successIconColor || 'white'
              }
              name={
                this.state.error
                  ? this.props.errorIconName
                  : this.props.successIconName
              }
              size={this.props.iconSize || 17}
            />)}
      </Animated.View>
    );

    if (this.props.bounce)
      return (
        <TouchableBounce disabled={this.state.step !== 0} onPress={this.press}>
          {button}
        </TouchableBounce>
      );

    return (
      <TouchableOpacity
        activeOpacity={1}
        disabled={this.state.step !== 0}
        onPress={this.press}>
        {button}
      </TouchableOpacity>
    );
  }
}

const styles = {
  button: {
    borderRadius: 25,
    borderWidth: 0.5,
    height: 40,
    marginBottom: 10,
    marginTop: 10
  },
  label: { padding: 9 }
};
