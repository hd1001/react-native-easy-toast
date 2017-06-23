/**
 * react-native-easy-toast
 * https://github.com/hd1001/react-native-easy-toast
 * Email:hhttw@163.com
 * Blog:cnblog.com/farmkids
 * @flow
 */

import React, { Component } from 'react'

import {
    StyleSheet,
    View,
    Image,
    Animated,
    Dimensions,
    Text,
} from 'react-native'

import { _getWidth, _getHeight } from '../../lib/px2dp-helper'
const { height, width } = Dimensions.get('window');

export const DURATION = {
    LENGTH_LONG: 2000,
    LENGTH_SHORT: 500,
    FOREVER: 0,
};

const styles = StyleSheet.create({
    toastContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    toastContent: {
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#414141',
        width: _getWidth(428),
        height: _getHeight(152)
    },
    text: {
        alignSelf: 'center',
        color: '#fff',
        fontSize: _getHeight(28),
        fontWeight: 'bold'
    }
});

export class Toast extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isShow: false,
            text: '',
            opacityValue: new Animated.Value(this.props.opacity),
        }
    }

    show(text, duration) {
        this.duration = typeof duration === 'number' ? duration : DURATION.LENGTH_SHORT;

        this.setState({
            isShow: true,
            text: text,
        });

        Animated.timing(
            this.state.opacityValue,
            {
                toValue: this.props.opacity,
                duration: this.props.fadeInDuration,
            }
        ).start(() => {
            this.isShow = true;
            if (duration !== DURATION.FOREVER) this.close();
        });
    }

    close(duration) {
        let delay = typeof duration === 'undefined' ? this.duration : duration;

        if (delay === DURATION.FOREVER) delay = this.props.defaultCloseDelay || 250;

        if (!this.isShow && !this.state.isShow) return;
        this.timer && clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            Animated.timing(
                this.state.opacityValue,
                {
                    toValue: 0.0,
                    duration: this.props.fadeOutDuration,
                }
            ).start(() => {
                this.setState({
                    isShow: false,
                });
                this.isShow = false;
            });
        }, delay);
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    render() {
        const { children } = this.props
        let pos;
        switch (this.props.position) {
            case 'top':
                pos = this.props.positionValue;
                break;
            case 'center':
                pos = height / 2 - this.props.height / 2;
                break;
            case 'bottom':
                pos = height - this.props.positionValue;
                break;
        }

        const view = this.state.isShow
            ?
            <View style={[styles.toastContainer, { top: pos }]} pointerEvents="none" >
                <Animated.View style={[{ opacity: this.state.opacityValue }]}>
                    {
                        children
                            ?
                            children
                            :
                            <View style={[styles.toastContent, this.props.style]}>
                                <Text style={[styles.text, this.props.textStyle]}>{this.state.text}</Text>
                            </View>
                    }

                </Animated.View>
            </View >
            :
            null;
        return view;
    }
}

Toast.propTypes = {
    style: View.propTypes.style,
    height: React.PropTypes.number,
    position: React.PropTypes.oneOf([
        'top',
        'center',
        'bottom',
    ]),
    textStyle: Text.propTypes.style,
    positionValue: React.PropTypes.number,
    fadeInDuration: React.PropTypes.number,
    fadeOutDuration: React.PropTypes.number,
    opacity: React.PropTypes.number
}

Toast.defaultProps = {
    position: 'center',
    textStyle: styles.text,
    positionValue: 120,
    fadeInDuration: 1000,
    fadeOutDuration: 1000,
    height: 284,
    opacity: 0.8
}