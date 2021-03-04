/**
 * WordPress dependencies
 */
import {__} from '@wordpress/i18n';
import {compose} from '@wordpress/compose';
import {Component, Fragment, render} from '@wordpress/element';
import {Button, withSpokenMessages} from '@wordpress/components';
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

            <svg width="60" height="27" viewBox="0 0 83 37" fill="none" xmlns="http://www.w3.org/2000/svg" style={{
                borderRadius: '5px',
                boxShadow: '0px 0px 3px #666'
            }}>
                <g clip-path="url(#clip0)">
                    <path d="M0 4.82332C0 2.16888 2.16888 0 4.82332 0H78.1767C80.8311 0 83 2.16888 83 4.82332V31.4002C83 34.0546 80.8311 36.2235 78.1767 36.2235H4.82332C2.16888 36.2559 0 34.087 0 31.4325V4.82332Z" fill="#0591E5"/>
                    <path d="M0 4.82332C0 2.16888 2.16888 0 4.82332 0H31.8857C34.5402 0 36.709 2.16888 36.709 4.82332V31.4002C36.709 34.0546 34.5402 36.2235 31.8857 36.2235H4.82332C2.16888 36.2559 0 34.087 0 31.4325V4.82332Z" fill="white"/>
                    <path d="M75.9431 19.5199V12.6572H72.0585V19.5199H69.7601L74.0008 24.408L78.2414 19.5199H75.9431Z" fill="white"/>
                    <path d="M41.1116 24.3756C41.9209 24.3756 42.5683 23.6958 42.5683 22.8865C42.5683 22.0772 41.9209 21.3974 41.1116 21.3974C40.3023 21.3974 39.6872 22.0772 39.6872 22.8865C39.6872 23.6958 40.3023 24.3756 41.1116 24.3756Z" fill="white"/>
                    <path d="M44.0897 24.2785H46.8412V19.0991C46.8412 18.225 47.3268 17.6747 48.0713 17.6747C48.8159 17.6747 49.2367 18.1603 49.2367 19.0343V24.2785H51.8588V19.0667C51.8588 18.1927 52.312 17.6424 53.0565 17.6424C53.8334 17.6424 54.2543 18.1279 54.2543 19.0343V24.2785H57.0058V18.3222C57.0058 16.5417 55.8728 15.344 54.2219 15.344C52.9594 15.344 51.9235 16.0885 51.5998 17.2215H51.5351C51.3085 16.0238 50.4344 15.344 49.172 15.344C48.0066 15.344 47.1002 16.0885 46.7441 17.1892H46.6794V15.5059H43.9926V24.2785H44.0897Z" fill="white"/>
                    <path d="M61.4407 24.408C62.7032 24.408 63.6743 23.6958 64.0304 22.7894H64.0952V24.2785H66.8143V12.6572H64.0628V17.0597H63.998C63.6096 16.0885 62.7032 15.3764 61.4731 15.3764C59.3689 15.3764 58.0741 17.0597 58.0741 19.876C58.0741 22.6923 59.3366 24.408 61.4407 24.408ZM62.4766 17.61C63.4477 17.61 64.0628 18.484 64.0628 19.9084C64.0628 21.3327 63.4801 22.1743 62.4766 22.1743C61.4731 22.1743 60.8904 21.3003 60.8904 19.9084C60.8904 18.484 61.5055 17.61 62.4766 17.61Z" fill="white"/>
                    <path d="M18.3869 5.14704C20.0702 5.14704 21.7535 5.50312 23.3073 6.15055C24.0519 6.47426 24.764 6.86271 25.4438 7.34828C26.1236 7.80148 26.7387 8.35179 27.3214 8.93448C27.9041 9.51716 28.422 10.1646 28.8752 10.8444C29.3284 11.5242 29.7169 12.2687 30.0406 13.0456C30.688 14.6318 31.0441 16.3151 31.0441 18.0632C31.0441 19.8112 30.7204 21.4945 30.0406 23.0807C29.7169 23.8576 29.3284 24.5698 28.8752 25.282C28.422 25.9618 27.9041 26.6092 27.3214 27.1919C26.7387 27.7746 26.1236 28.2925 25.4438 28.7781C24.764 29.2313 24.0519 29.6521 23.3073 29.9758C21.7535 30.6556 20.1026 30.9793 18.3869 30.9793C16.6712 30.9793 15.0203 30.6232 13.4665 29.9758C12.7219 29.6521 12.0098 29.2637 11.33 28.7781C10.6502 28.3249 10.0351 27.7746 9.45242 27.1919C8.86974 26.6092 8.3518 25.9618 7.8986 25.282C7.4454 24.6022 7.05695 23.8576 6.73323 23.0807C6.08581 21.4945 5.72972 19.8112 5.72972 18.0632C5.72972 16.3151 6.05344 14.6318 6.73323 13.0456C7.05695 12.2687 7.4454 11.5566 7.8986 10.8444C8.3518 10.1646 8.86974 9.51716 9.45242 8.93448C10.0351 8.35179 10.6502 7.83385 11.33 7.34828C12.0098 6.89509 12.7219 6.47426 13.4665 6.15055C15.0203 5.50312 16.6712 5.14704 18.3869 5.14704ZM18.3869 4.33775C10.9415 4.33775 4.92044 10.4883 4.92044 18.0308C4.92044 25.5733 10.9415 31.7239 18.3869 31.7239C25.8323 31.7239 31.8534 25.5733 31.8534 18.0308C31.821 10.4559 25.7999 4.33775 18.3869 4.33775Z" fill="#32373C"/>
                    <path d="M7.15405 18.0308C7.15405 22.5628 9.74376 26.4474 13.4665 28.3249L8.12519 13.4017C7.51014 14.7937 7.15405 16.3799 7.15405 18.0308ZM25.9618 17.4481C25.9618 16.0238 25.4762 15.0527 25.023 14.3081C24.4403 13.3694 23.9224 12.5601 23.9224 11.6213C23.9224 10.5854 24.6993 9.58191 25.7999 9.58191C25.8647 9.58191 25.897 9.58191 25.9294 9.58191C23.9224 7.70438 21.2679 6.57138 18.3545 6.57138C14.4376 6.57138 10.9739 8.61077 8.96685 11.7184C9.22582 11.7184 9.48479 11.7184 9.67901 11.7184C10.8444 11.7184 12.6572 11.5889 12.6572 11.5889C13.2722 11.5566 13.337 12.463 12.7219 12.5277C12.7219 12.5277 12.1069 12.5924 11.4271 12.6248L15.5058 24.9906L17.9661 17.4805L16.218 12.5924C15.603 12.5601 15.0526 12.4953 15.0526 12.4953C14.4376 12.463 14.5347 11.5242 15.1174 11.5566C15.1174 11.5566 16.9626 11.686 18.0632 11.686C19.2285 11.686 21.0413 11.5566 21.0413 11.5566C21.6564 11.5242 21.7211 12.4306 21.1061 12.4953C21.1061 12.4953 20.491 12.5601 19.8112 12.5924L23.8576 24.8612L25.023 21.1385C25.6381 19.5846 25.9618 18.4516 25.9618 17.4481ZM18.5811 19.0343L15.2145 29.0047C16.218 29.296 17.2863 29.4579 18.3869 29.4579C19.6817 29.4579 20.9442 29.2313 22.1096 28.8105C22.0772 28.7457 22.0448 28.7133 22.0448 28.6486L18.5811 19.0343ZM28.2278 12.5601C28.2601 12.9162 28.2925 13.3046 28.2925 13.7254C28.2925 14.8908 28.0659 16.1857 27.4509 17.8042L24.0195 27.9041C27.3537 25.9294 29.5874 22.2391 29.5874 18.0308C29.5874 16.0562 29.1018 14.1786 28.2278 12.5601Z" fill="#32373C"/>
                </g>
                <defs>
                    <clipPath id="clip0">
                        <rect width="83" height="36.2559" fill="white"/>
                    </clipPath>
                </defs>
            </svg>
        );

        const ShortcutPinnedButton = () => {

            return (
                <Fragment>
                    <Button
                        icon={icon}
                        label={__('Switch to Markdown', 'dark-mode')}
                        shortcut={displayShortcut.secondary('i')}
                        onClick={() => {
                            onToggle();
                        }}
                    ></Button>
                </Fragment>
            );
        };
        //edit-post-header-toolbar edit-post-header-toolbar__block-toolbar
        const moreMenuButton = document.querySelector('.edit-post-header-toolbar');

        if (isEnabled && !isActive && !document.getElementById('components-markdown-shortcut-pinned-button')) {

            moreMenuButton.insertAdjacentHTML('beforeend', '<div id="components-markdown-shortcut-pinned-button"></div>');

            render(
                <ShortcutPinnedButton/>,
                document.getElementById('components-markdown-shortcut-pinned-button')
            );
        } else if (isActive || !isEnabled) {
            const markdownButton = document.getElementById('components-markdown-shortcut-pinned-button');
            if (markdownButton) {
                markdownButton.remove();
            }
        }
    }

    render() {
        return false;
    }
}

export default compose([withSpokenMessages])(ShortcutButton);
