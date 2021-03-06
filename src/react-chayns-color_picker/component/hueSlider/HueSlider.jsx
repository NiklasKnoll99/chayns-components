import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Slider from '../../../react-chayns-slider/component/Slider';
import { hexStringToHsv, hsvToRgbString, rgbToHsv } from '../../../utils/color';
import { isString } from '../../../utils/is';

const getHsvColor = (color) => {
    if (isString(color)) { // HEX(A)
        return hexStringToHsv(color);
    }
    if (color.r !== undefined) { // RGB(A) (0-255)
        return rgbToHsv(color);
    }
    if (color.h !== undefined) { // HSV(A)
        return color;
    }
    return {
        h: 0,
        s: 0,
        v: 0,
        a: 1,
    };
};

export default class HueSlider extends PureComponent {
    onChange = (value) => {
        const { onChange, color } = this.props;
        if (onChange) {
            onChange({
                ...getHsvColor(color),
                h: value,
            });
        }
    };

    onChangeEnd = (value) => {
        const { onChangeEnd, color } = this.props;
        if (onChangeEnd) {
            onChangeEnd({
                ...getHsvColor(color),
                h: value,
            });
        }
    };

    render() {
        const { color, showTooltip } = this.props;
        const hsv = getHsvColor(color);
        const thumbColor = hsvToRgbString({
            h: hsv.h,
            s: 1,
            v: 1,
            a: null,
        });

        return (
            <div>
                <Slider
                    innerTrackStyle={{ background: 'transparent' }}
                    /* eslint-disable-next-line max-len */
                    trackStyle={{ background: 'linear-gradient(90deg, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)' }}
                    thumbStyle={{ background: thumbColor }}
                    onChange={this.onChange}
                    onChangeEnd={this.onChangeEnd}
                    min={0}
                    max={360}
                    value={hsv.h}
                    scaleOnDown={showTooltip === null ? chayns.env.isMobile : showTooltip}
                />
            </div>
        );
    }
}

HueSlider.propTypes = {
    onChange: PropTypes.func,
    onChangeEnd: PropTypes.func,
    showTooltip: PropTypes.bool,
    color: PropTypes.oneOfType([
        PropTypes.shape({
            h: PropTypes.number.isRequired,
            s: PropTypes.number.isRequired,
            v: PropTypes.number.isRequired,
        }).isRequired,
        PropTypes.shape({
            r: PropTypes.number.isRequired,
            g: PropTypes.number.isRequired,
            b: PropTypes.number.isRequired,
        }).isRequired,
        PropTypes.string.isRequired,
    ]).isRequired,
};

HueSlider.defaultProps = {
    onChange: null,
    onChangeEnd: null,
    showTooltip: null,
};

HueSlider.displayName = 'HueSlider';
