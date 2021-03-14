import {__} from '@wordpress/i18n';
import {Component, Fragment} from '@wordpress/element';
import {compose} from '@wordpress/compose';
import {withDispatch} from '@wordpress/data';
import {withSpokenMessages, Button} from '@wordpress/components';
import UpdateTitleHeight from '../utils/title-height';
import MusicList from './music-list';

import './style.scss';

class Music extends Component {

    constructor(props) {
        super(props);

        this.state = {
        }
    }


    render() {
        return (
            <Fragment>

                <MusicList/>

            </Fragment>
        )
    }
}

export default Music;