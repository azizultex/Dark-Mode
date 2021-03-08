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
            list: false
        }
    }


    render() {
        return (
            <Fragment>
                <Button
                    className="components-markdown-music"
                    onClick={() => {
                        this.setState({list: !this.state.list})
                    }}
                >

                    <svg id="wp-markdown-music" style={{width: 20, height: 20}} enable-background="new 0 0 415.963 415.963" viewBox="0 0 415.963 415.963" xmlns="http://www.w3.org/2000/svg"><path d="m328.712 264.539c12.928-21.632 21.504-48.992 23.168-76.064 1.056-17.376-2.816-35.616-11.2-52.768-13.152-26.944-35.744-42.08-57.568-56.704-16.288-10.912-31.68-21.216-42.56-35.936l-1.952-2.624c-6.432-8.64-13.696-18.432-14.848-26.656-1.152-8.32-8.704-14.24-16.96-13.76-8.384.576-14.88 7.52-14.88 15.936v285.12c-13.408-8.128-29.92-13.12-48-13.12-44.096 0-80 28.704-80 64s35.904 64 80 64 80-28.704 80-64v-186.496c24.032 9.184 63.36 32.576 74.176 87.2-2.016 2.976-3.936 6.176-6.176 8.736-5.856 6.624-5.216 16.736 1.44 22.56 6.592 5.888 16.704 5.184 22.56-1.44 4.288-4.864 8.096-10.56 11.744-16.512.384-.448.737-.928 1.056-1.472z"/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/></svg>

                </Button>

                {this.state.list && <MusicList/>}
            </Fragment>
        )
    }
}

export default Music;