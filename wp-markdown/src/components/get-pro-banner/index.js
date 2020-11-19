import {__} from '@wordpress/i18n';
import {Component} from '@wordpress/element';
import {Button} from '@wordpress/components';
import './style.scss';

class GetProBanner extends Component {

    constructor(props){
        super(props);
    }

    componentDidMount() {
        const {countdown_time} = WPMD_Settings; 
        if (typeof window.timer_set === 'undefined') {
            window.timer_set = jQuery('.simple_timer').syotimer({
                year: countdown_time.year,
                month : countdown_time.month,
                day : countdown_time.day,
                hour : countdown_time.hour,
                minute : countdown_time.minute
            });
        }

        document.addEventListener('click', (event) => {
            if(event.target.classList.contains('markdown-close-promo')){
                event.preventDefault();
                document.querySelector('.components-markdown-gopro').classList.add('components-markdown-gopro-hidden');
            }
        });
    }

    render() {
        return (
            <div className="components-markdown-gopro components-markdown-gopro-hidden">
                <div className="markdown-gopro-inner">
                    <span class="markdown-close-promo">×</span>
                    <img className="promo-img" src={WPMD_Settings.pluginDirUrl + '/assets/images/icon-128x128.png'} alt="WP Markdown"/>
                    <h3>{__('Upgrade to Ultimate to access these features', 'dark-mode')}</h3>
                    <h3 className="discount">{__('GET', 'dark-mode')} <span class="percentage">{__('50%', 'dark-mode')}</span> {__('OFF', 'dark-mode')}</h3>
                    <h3 className="limited-title">{__('LIMITED TIME ONLY', 'dark-mode')}</h3>
                    <div className="simple_timer"></div>
                    <Button href="https://wppool.dev/wp-markdown-editor" target="_blank" className="wpmd-pro-btn">{__('GET PRO', 'dark-mode')}</Button>
                </div>
            </div>
        )
    }
}

export default GetProBanner;