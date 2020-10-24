const {Component, Fragment} = wp.element;


class Palette extends Component {

    state = {
        type: 'default'
    };

    handleColorPalegtte(type) {
        const elm = document.getElementsByTagName('html')[0];
        const img = document.getElementById('darkmodeThemeSwitchImg');

        elm.classList.remove('darkmode-theme-default', 'darkmode-theme-darkmode', 'darkmode-theme-chathams', 'darkmode-theme-pumpkin', 'darkmode-theme-mustard', 'darkmode-theme-concord');
        elm.classList.add(`darkmode-theme-${type}`);

        img.setAttribute('src', `${darkmode.plugin_url}/block/build/images/${type}.png`);

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
            <div>
                {Object.entries(labels).map(([key, label], i) =>
                    <a href="#" className={type == key ? 'active' : ''} onClick={() => this.handleColorPalegtte(key)}>
                        <img src={`${darkmode.plugin_url}/block/build/images/${key}.png`} alt={label} /> {label} {type == key ? <span className='tick'>✓</span> : ''}
                    </a>)}
            </div>
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
            </Fragment>
        )
    }
}

export default ColorPalettes;