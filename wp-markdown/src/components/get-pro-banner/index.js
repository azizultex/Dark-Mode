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

            <div className="components-markdown-gopro components-markdown-gopro-hidden darkmode-ignore">
                <div className="markdown-gopro-inner darkmode-ignore">
                    <span class="markdown-close-promo darkmode-ignore">×</span>
                    <img className="promo-img darkmode-ignore" src={WPMD_Settings.pluginDirUrl + '/assets/images/icon-128x128.svg'} alt="WP Markdown"/>
                    <h3 className="darkmode-ignore">{__('Upgrade to PRO to access these features', 'dark-mode')}</h3>
                    <h3 className="discount darkmode-ignore">{__('GET', 'dark-mode')} <span class="percentage">{__('80%', 'dark-mode')}</span> {__('OFF', 'dark-mode')}</h3>
                    <h3 className="limited-title darkmode-ignore">{__('LIMITED TIME ONLY', 'dark-mode')}</h3>
                    <div className="simple_timer darkmode-ignore"></div>
                    <Button href="https://wppool.dev/wp-markdown-editor" target="_blank" className="wpmd-pro-btn darkmode-ignore">{__('GET PRO', 'dark-mode')}</Button>
                </div>
            </div>
        )
    }
}

export default GetProBanner;