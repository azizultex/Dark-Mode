import {__} from '@wordpress/i18n';
import {Component} from '@wordpress/element';
import {Button} from '@wordpress/components';
import './style.scss';

const {promo_data} = WPMD_Settings;

class GetProBanner extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

        if (typeof window.timer_set === 'undefined') {
            window.timer_set = jQuery('.simple_timer').syotimer({
                year: promo_data.countdown_time.year,
                month: promo_data.countdown_time.month,
                day: promo_data.countdown_time.day,
                hour: promo_data.countdown_time.hour,
                minute: promo_data.countdown_time.minute
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

                    <img className="promo-img darkmode-ignore" src={WPMD_Settings.pluginDirUrl + '/assets/images/gift-box.svg'} alt="WP Markdown"/>

                    {'yes' === promo_data.is_christmas &&
                    <div className="black-friday-wrap">
                        <h3>
                            <img src={WPMD_Settings.pluginDirUrl + '/assets/images/holiday-gifts.svg'}/>
                        </h3>

                        <div className="ribbon">
                            <div className="ribbon-content">
                                <div className="ribbon-stitches-top"></div>
                                <img src={WPMD_Settings.pluginDirUrl + '/assets/images/merry-christmas.svg'}/>
                                <div className="ribbon-stitches-bottom"></div>
                            </div>
                        </div>

                    </div>
                    }

                    <h3 className="darkmode-ignore">{__('Unlock PRO features', 'dark-mode')}</h3>
                    <h3 className="discount darkmode-ignore">{__('GET', 'dark-mode')} <span class="percentage">{promo_data.discount_text}</span></h3>
                    <h3 className="limited-title darkmode-ignore">{__('LIMITED TIME ONLY', 'dark-mode')}</h3>

                    <div className="simple_timer darkmode-ignore"></div>

                    <Button href="https://wppool.dev/wp-markdown-editor" target="_blank" className="wpmd-pro-btn darkmode-ignore">
                        {__('GET PRO', 'dark-mode')}
                    </Button>

                </div>
            </div>
        )
    }
}

export default GetProBanner;