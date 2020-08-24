import React, {
    useState,
    useRef,
    useEffect,
} from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './sliderButtonHooks.css';

const SliderButtonHooks = (props) => {
    const {
        className,
        style,
        items,
        onChange,
        onDragStop,
        onDragStart,
        selectedItemId,
        disabled,
    } = props;

    const [markerPosX, setMarkerPosX] = useState(0);
    const [dragStartPosX, setDragStartPosX] = useState(null);
    const [dragStartMarkerPosX, setDragStartMarkerPosX] = useState(null);
    const [lastSelectedIndex, setLastSelectedIndex] = useState(0);

    const sliderButtonRef = useRef();
    const sliderButton = sliderButtonRef && sliderButtonRef.current;

    const firstItemRef = useRef();
    let firstItem = firstItemRef && firstItemRef.current;

    const markerRef = useRef();
    let marker = markerRef && markerRef.current;

    useEffect(() => {
        firstItem = firstItemRef.current;
        marker = markerRef.current;

        if (selectedItemId) {
            const i = items.findIndex((item) => item.id === selectedItemId);
            setMarkerIndex(i);
        }
    }, []);

    useEffect(() => {
        if (!dragStartPosX) {
            const i = items.findIndex((item) => item.id === selectedItemId);
            setMarkerIndex(i);
        }
    }, [selectedItemId]);

    useEffect(() => {
        const listener = [
            {
                type: 'mousemove',
                cb: (ev) => handleMovement(ev.clientX),
            },
            {
                type: 'touchmove',
                cb: (ev) => handleMovement(ev.touches[0].clientX),
            },
            {
                type: 'mouseup',
                cb: () => stopDrag(),
            },
            {
                type: 'touchend',
                cb: () => stopDrag(),
            },
        ];

        listener.forEach((lst) => window.addEventListener(lst.type, lst.cb));

        return () => {
            listener.forEach((lst) => window.removeEventListener(lst.type, lst.cb));
        };
    });

    const startDrag = (posX) => {
        if (!disabled) {
            setDragStartPosX(posX);
            setDragStartMarkerPosX(markerPosX);

            onDragStart && onDragStart();
        }
    };

    const stopDrag = () => {
        if (dragStartPosX) {
            setDragStartPosX(null);
            setDragStartMarkerPosX(null);
            setMarkerIndex(getHoveredItemIndex());

            onDragStop && onDragStop();
        }
    };

    const handleMovement = (posX) => {
        if (dragStartPosX) {
            const maxMarkerPosX = sliderButton && firstItem ? sliderButton.clientWidth - firstItem.clientWidth : 0;
            let newMarkerPosX = dragStartMarkerPosX + posX - dragStartPosX;

            if (newMarkerPosX < 0) {
                newMarkerPosX = 0;
            } else if (newMarkerPosX > maxMarkerPosX) {
                newMarkerPosX = maxMarkerPosX;
            }

            const newSelectedIndex = getHoveredItemIndex(newMarkerPosX);

            handleChange(newSelectedIndex);
            setMarkerPosX(newMarkerPosX);
        }
    };

    const handleChange = (newIndex) => {
        if (newIndex !== lastSelectedIndex) {
            setLastSelectedIndex(newIndex);
            onChange && onChange(items[newIndex]);
        }
    };

    const getHoveredItemIndex = (markerPositionX = markerPosX) => {
        if (firstItem) {
            const markerHalfPosX = markerPositionX + firstItem.clientWidth / 2;
            const index = Math.floor(markerHalfPosX / firstItem.clientWidth);

            return index;
        }

        return 0;
    };

    const setMarkerIndex = (index) => {
        if (firstItem && index > -1 && index < items.length) {
            const newMarkerPosX = index * firstItem.clientWidth;

            marker.animate([
                { left: `${markerPosX}px` },
                { left: `${newMarkerPosX}px` },
            ], {
                duration: 200,
                easing: 'cubic-bezier(0.42, 0, 0.29, 1.36)',
            }).onfinish = () => {
                setMarkerPosX(newMarkerPosX);
            };
        }
    };

    const hoveredItemIndex = getHoveredItemIndex();

    return (
        <div
            className={classNames(
                'sliderButtonHooks',
                { [className]: className },
                { 'sliderButtonHooks--disabled': disabled }
            )}
            style={style}
            ref={sliderButtonRef}
        >
            {
                items.map((item, i) => (
                    <div
                        className="sliderButtonHooks__item"
                        style={{ backgroundColor: chayns.env.site.color }}
                        ref={(ref) => {
                            if (i === 0) {
                                firstItemRef.current = ref;
                            }
                        }}
                        onClick={() => {
                            setMarkerIndex(i);
                            handleChange(i);
                        }}
                    >
                        <div className="sliderButtonHooks__item__content">{item.text}</div>
                    </div>
                ))
            }
            <div
                className={classNames(
                    { 'button': !disabled },
                    'sliderButtonHooks__item',
                    'sliderButtonHooks__item__marker'
                )}
                style={{
                    backgroundColor: chayns.env.site.color,
                    left: `${markerPosX}px`,
                }}
                onMouseDown={(ev) => {
                    if (!chayns.env.isMobile) {
                        startDrag(ev.clientX);
                    }
                }}
                onTouchStart={(ev) => startDrag(ev.touches[0].clientX)}
                ref={markerRef}
            >
                <div className="sliderButtonHooks__item__content">{items[hoveredItemIndex].text}</div>
            </div>
        </div>
    );
};

SliderButtonHooks.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    items: PropTypes.array,
    onChange: PropTypes.func,
    onDragStop: PropTypes.func,
    onDragStart: PropTypes.func,
    selectedItemId: PropTypes.number,
    disabled: PropTypes.bool,
};

SliderButtonHooks.defaultProps = {
    className: null,
    style: null,
    items: [
        {
            id: 0,
            text: 'Auf',
        },
        {
            id: 1,
            text: 'Stopp',
        },
        {
            id: 2,
            text: 'Zu',
        },
    ],
    onChange: null,
    onDragStop: null,
    onDragStart: null,
    selectedItemId: 0,
    disabled: false,
};

export default SliderButtonHooks;
