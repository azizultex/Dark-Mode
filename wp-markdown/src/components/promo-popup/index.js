/**
 * WordPress dependencies
 */
import {__} from '@wordpress/i18n';
import {compose} from '@wordpress/compose';
import {Fragment, Component, render} from '@wordpress/element';
import {withSpokenMessages, Button, SVG, Path} from '@wordpress/components';
import {displayShortcut} from '@wordpress/keycodes';

/**-- style --**/
import './style.scss';

const PromoPopup = (props) => {
    return (
      <h1>Hello World</h1>
    );
}

export default PromoPopup;