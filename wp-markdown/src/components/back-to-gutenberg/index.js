import {__} from '@wordpress/i18n';
import {Component} from '@wordpress/element';
import {compose} from '@wordpress/compose';
import {withDispatch} from '@wordpress/data';
import {withSpokenMessages, Button} from '@wordpress/components';
import UpdateTitleHeight from '../utils/title-height';

import './style.scss';

class BackToGutenberg extends Component {

    constructor(props){
        super(props);
    }
    render() {

        const {toggleEditorMode} = this.props;

        return (
            <Button
                className="components-markdown-back-to-default"
                onClick={() => {
                    toggleEditorMode();
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-hidden="true" focusable="false"><path d="M12.3 16.1l-5.8-5.6 1-1 4.7 4.4 4.3-4.4 1 1z"></path></svg>
                <span>{__('Back to wordpress editor', 'dark-mode')}</span>
            </Button>
        )
    }
}

export default compose([
    withDispatch((dispatch) => ({
        toggleEditorMode() {
            dispatch('core/edit-post').toggleFeature('markdownWritingMode');

            setTimeout(function () {
                UpdateTitleHeight();
            }, 100);

            // Reset post meta
            dispatch('core/editor').editPost({
                meta: {
                    _markdown_editor_remember: false,
                },
            });

            dispatch('core/editor').savePost();
        },
    })),
    withSpokenMessages,
])(BackToGutenberg);