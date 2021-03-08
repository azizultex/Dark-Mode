import {Component, Fragment} from '@wordpress/element';
import {Button} from '@wordpress/components';

class MusicList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            playing: false,
            track: null,
            audio: null,
            musics: [
                {
                    name: 'Relaxing',
                    src: `${WPMD_Settings.pluginDirUrl}assets/musics/relaxing.mp3`,
                },
                {
                    name: 'Relaxing 2',
                    src: `${WPMD_Settings.pluginDirUrl}assets/musics/music2.mp3`,
                },
            ],
            action: false
        }
    }

    componentDidMount() {

        wp.ajax.send('wp_markdown_get_musics', {
            data: {
                user_id: WPMD_Settings.current_user_id
            },

            success: (data) => {
                this.setState({musics: [...this.state.musics, ...data]})
            },

            error: error => console.log(error)
        });


    }

    handlePlayPause(e) {
        const key = e.target.getAttribute('data-key');

        /*remove pause from all items and add play*/
        document.querySelectorAll('.music-play-pause').forEach(element => {
            element.classList.remove('dashicons-controls-pause');
            element.classList.add('dashicons-controls-play');
        });

        /*check if current item is playing*/
        if (this.state.playing && this.state.track === key) {
            this.setState({
                playing: false,
                track: null,
            });

            this.state.audio.pause();

        } else {

            if (this.state.audio) {
                this.state.audio.pause();
            }

            e.target.classList.remove('dashicons-controls-play');
            e.target.classList.add('dashicons-controls-pause');

            console.log(this.state.musics);

            const mp3 = this.state.musics[key].src;

            const audio = new Audio(mp3);
            audio.play();

            this.setState({
                playing: true,
                track: key,
                audio,
            });

        }
    }

    removeMusic(e) {

        const key = e.target.getAttribute('data-key');

        if (this.state.playing && this.state.track === key) {
            this.state.audio.pause();
        }

        const mp3 = this.state.musics[key].src;

        this.state.musics.splice(key, 1);
        this.setState({musics: this.state.musics});

        wp.ajax.post('wp_markdown_remove_music', {
            data: {
                src: mp3,
                user_id: WPMD_Settings.current_user_id
            }
        });

    }


    render() {


        return (
            <Fragment>
                <div className="wp-markdown-music">
                    <ol className='wp-markdown-music-list'>

                        {
                            this.state.musics.map((item, i) => {

                                return (
                                    Object.keys(item).length ?
                                        <li key={i}>
                                            <div className='wp-markdown-music-item'>
                                                <span className='music-title'>{item.name}</span>
                                                {
                                                    this.state.action && i > 1 ?
                                                        <span className='music-action'>
                                                            {
                                                                this.state.action &&
                                                                <Button
                                                                    data-key={i}
                                                                    className="music-action-remove"
                                                                    onClick={(e) => {
                                                                        this.removeMusic(e)
                                                                    }}
                                                                >
                                                                    <i data-key={i} className="dashicons dashicons-trash"></i>
                                                                </Button>
                                                            }
                                                        </span>
                                                        :
                                                        <span className='music-play-pause dashicons dashicons-controls-play' data-key={i} onClick={(e) => this.handlePlayPause(e)}> </span>
                                                }
                                            </div>
                                        </li> : ''
                                )
                            })
                        }

                    </ol>

                    {
                        this.state.musics.length > 2 &&
                        <Button
                            className="wp-markdown-remove-music is-small button button-link-delete"
                            onClick={() => {
                                this.setState({action: !this.state.action})
                            }}
                        >
                            {this.state.action ? 'Done' : 'Remove Music'}
                        </Button>
                    }


                    <Button
                        className="wp-markdown-add-music is-small is-primary"
                        onClick={() => {

                            const file_frame = wp.media.frames.file_frame = wp.media({
                                title: 'Add Music',
                                library: {
                                    type: 'audio'
                                },
                                button: {
                                    text: 'Add Music',
                                },
                                multiple: false
                            });

                            file_frame.on('select', () => {
                                const attachment = file_frame.state().get('selection').first().toJSON();

                                const items = [...this.state.musics, ...[{
                                    name: attachment.title,
                                    src: attachment.url
                                }]];

                                this.setState({
                                    musics: items
                                });

                                wp.ajax.post('wp_markdown_add_music', {
                                    data: {
                                        music_id: attachment.id,
                                        user_id: WPMD_Settings.current_user_id
                                    },
                                });

                            });

                            // Finally, open the modal
                            file_frame.open();
                        }}
                    >
                        Add Music
                    </Button>


                </div>
            </Fragment>
        );
    }
}

export default MusicList;