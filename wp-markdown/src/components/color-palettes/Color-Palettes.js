const {Component, Fragment} = wp.element;
import GetProBanner from '../get-pro-banner';


class Palette extends Component {

    is_saved = localStorage.getItem('dark_mode_active');

    state = {
        type: (this.is_saved && this.is_saved != 0) ? 'darkmode' : 'default',
    };

    handleColorPalette(type) {
        const elm = document.getElementsByTagName('html')[0];
        const img = document.getElementById('darkmodeThemeSwitchImg');

        elm.classList.remove('darkmode-theme-default', 'darkmode-theme-darkmode', 'darkmode-theme-chathams', 'darkmode-theme-pumpkin', 'darkmode-theme-mustard', 'darkmode-theme-concord');
        elm.classList.add(`darkmode-theme-${type}`);

        img.setAttribute('src', `${darkmode.plugin_url}/wp-markdown/build/images/${type}.png`);

        this.setState({type: type});
    }

    render() {
        const {type} = this.state;

        const labels = {
            default: 'Default',
            darkmode: 'Darkmode',
            chathams: 'Chathams',
            pumpkin: 'Pumpkin Spice',
            mustard: 'Mustard Seed',
            concord: 'Concord Jam',
        };

        return (
            <Fragment>
                <div>
                    {Object.entries(labels).map(([key, label], i) =>
                        <a href="javascript:;"
                            className= {`${type == key ? 'active' : ''} ${!WPMD_Settings.is_pro && ('default' !== key && 'darkmode' !== key) ? 'disabled' : ''}`}
                            onClick={() => {
                                if (!WPMD_Settings.is_pro && ('default' !== key && 'darkmode' !== key)) {
                                    document.querySelector('.components-markdown-gopro').classList.remove('components-markdown-gopro-hidden');
                                } else {
                                    this.handleColorPalette(key);
                                }
                            }}
                        >
                            <img src={`${darkmode.plugin_url}/wp-markdown/build/images/${key}.png`} alt={label}/>

                            <span>{label}</span>

                            {type == key ? <span className='tick'>✓</span> : ''}

                            {!WPMD_Settings.is_pro && ('default' !== key && 'darkmode' !== key) &&
                            <span className={'wp-markdown-pro-badge'}>PRO</span>}

                        </a>)}
                </div>

            </Fragment>
        )
    }
}

class ColorPalettes extends Component {


    render() {
        const {active} = this.props;

        return (
            <Fragment>
                {
                    active ?
                        <div className="darkmode-color-palettes-wrapper">
                            <Palette/>
                        </div>
                        : ''
                }

                {!WPMD_Settings.is_pro && <GetProBanner/>}

            </Fragment>
        )
    }
}

export default ColorPalettes;