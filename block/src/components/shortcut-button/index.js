/**
 * WordPress dependencies
 */
import {__} from '@wordpress/i18n';
import {compose} from '@wordpress/compose';
import {Fragment, Component, render} from '@wordpress/element';
import {withSpokenMessages, Button, SVG, Path} from '@wordpress/components';
import {displayShortcut} from '@wordpress/keycodes';

class ShortcutButton extends Component {
    constructor() {
        super(...arguments);
        this.addPinnedButton = this.addPinnedButton.bind(this);
    }

    componentDidMount() {
        this.addPinnedButton();
    }

    componentDidUpdate() {
        this.addPinnedButton();
    }

    addPinnedButton() {
        const {isActive, onToggle, isEnabled} = this.props;

        const icon = (
            <SVG xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
                 focusable="false" width="1.63em" height="1em"
                 preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 158">
                <Path
                    d="M238.371 157.892H18.395C8.431 157.892 0 149.462 0 139.497V18.395C0 8.431 8.431 0 18.395 0h219.21C247.569 0 256 8.431 256 18.395v121.102c0 9.964-7.665 18.395-17.629 18.395zM18.395 12.263c-3.066 0-6.132 3.066-6.132 6.132v121.102c0 3.832 3.066 6.132 6.132 6.132h219.21c3.832 0 6.132-3.066 6.132-6.132V18.395c0-3.832-3.066-6.132-6.132-6.132H18.395zM36.79 121.102V36.79h24.527l24.527 30.66l24.527-30.66h24.527v84.312h-24.527V72.814l-24.527 30.66l-24.527-30.66v48.288H36.79zm154.06 0l-36.79-40.623h24.527V36.79h24.527v42.923h24.527l-36.79 41.389z"
                    fill="#000"/>
            </SVG>
        );

        const ShortcutPinnedButton = () => {
            return (
                <Fragment>
                    <Button
                        icon={icon}
                        label={__('Switch to MarkDown', 'iceberg')}
                        shortcut={displayShortcut.secondary('i')}
                        onClick={() => {
                            onToggle();
                        }}
                    ></Button>
                </Fragment>
            );
        };
        //edit-post-header-toolbar edit-post-header-toolbar__block-toolbar
        const moreMenuButton = document.querySelector(
            '.edit-post-header-toolbar'
        );

        if (
            isEnabled &&
            !isActive &&
            !document.getElementById(
                'components-iceberg-shortcut-pinned-button'
            )
        ) {
            moreMenuButton.insertAdjacentHTML(
                'beforeend',
                '<div id="components-iceberg-shortcut-pinned-button"></div>'
            );

            render(
                <ShortcutPinnedButton/>,
                document.getElementById(
                    'components-iceberg-shortcut-pinned-button'
                )
            );
        } else if (isActive || !isEnabled) {
            const icebergButton = document.getElementById(
                'components-iceberg-shortcut-pinned-button'
            );

            if (icebergButton) {
                icebergButton.remove();
            }
        }
    }

    render() {
        return false;
    }
}

export default compose([withSpokenMessages])(ShortcutButton);
