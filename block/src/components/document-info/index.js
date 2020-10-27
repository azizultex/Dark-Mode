/**
 * Internal dependencies
 */
import WordCount from './word-count';
import CharacterCount from './character-count';
import EstimatedReadingTime from './estimated-reading-time';

/**
 * WordPress dependencies
 */
import { withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { Fragment, Component } from '@wordpress/element';
import { withSpokenMessages } from '@wordpress/components';

class DocumentInfo extends Component {
	constructor() {
		super( ...arguments );

		this.state = {
			isOpen: false,
		};
	}

	componentDidMount() {
		const element = document.querySelector(
			'.components-iceberg-document-info'
		);
		if ( element ) {
			element.parentElement.style.display = 'block';
		}
	}

	render() {
		return (
			<Fragment>
				<div className="components-iceberg-document-info">
					<div className="components-iceberg-document-info__content">
						<WordCount />
						<CharacterCount />
						<EstimatedReadingTime />
					</div>
				</div>
			</Fragment>
		);
	}
}

export default compose( [
	withSelect( ( select ) => {
		const { getGlobalBlockCount } = select( 'core/block-editor' );
		return {
			paragraphCount: getGlobalBlockCount( 'core/paragraph' ),
		};
	} ),
	withSpokenMessages,
] )( DocumentInfo );
