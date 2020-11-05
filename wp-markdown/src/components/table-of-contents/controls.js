/**
 * External dependencies
 */
import { isNil, map, omitBy, noop } from 'lodash';
import classnames from 'classnames';
import scrollIntoView from 'dom-scroll-into-view';

/**
 * WordPress dependencies
 */
import { withSelect, withDispatch } from '@wordpress/data';
import { compose, ifCondition } from '@wordpress/compose';
import { Fragment, Component } from '@wordpress/element';
import { Button, withSpokenMessages } from '@wordpress/components';
import { getScrollContainer } from '@wordpress/dom';

class TableOfContents extends Component {
	constructor() {
		super( ...arguments );

		this.scrollToSelected = this.scrollToSelected.bind( this );
		this.addListContent = this.addListContent.bind( this );

		this.state = {
			isEnabled: false,
		};
	}

	componentDidMount() {
		this.addListContent();
	}

	componentDidUpdate() {
		this.addListContent();
	}

	addListContent() {
		const { getComputedStyle } = window;

		const tableOfContents = document.querySelector(
			'.components-markdown-table-of-contents'
		);

		if ( tableOfContents ) {
			tableOfContents.parentElement.style.display = 'block';

			const tableOfContentsList = document.querySelector(
				'.components-markdown-table-of-contents__list'
			);

			const listHeight = parseInt(
				getComputedStyle( tableOfContentsList ).height
			);
			const scale = ( window.innerHeight - 100 ) / listHeight;

			const topPosition = 0.5 * ( innerHeight - listHeight );

			// scale table of contents
			if ( listHeight > window.innerHeight - 100 ) {
				tableOfContents.style.transform = 'scale(' + scale + ')';
				tableOfContents.style.top = '60px';
			} else {
				tableOfContents.style.top = topPosition + 'px';
				tableOfContents.style.transform = 'none';
			}
		}
	}

	scrollToSelected( client, isTitle = false ) {
		let element = document.getElementById( client );

		if ( isTitle ) {
			element = document.querySelector( client );
		}

		scrollIntoView( element, getScrollContainer( element ), {
			offsetTop: isTitle ? 75 : 50,
		} );
	}

	render() {
		const {
			isActive,
			title,
			rootBlocks,
			selectBlock,
			selectedBlockClientId,
			headingBlockCount,
		} = this.props;

		if ( ! isActive ) {
			return false;
		}

		if ( headingBlockCount === 0 ) {
			return false;
		}

		return (
			<Fragment>
				<div className="components-markdown-table-of-contents">
					<ul className="components-markdown-table-of-contents__list">
						<li
							key="toc-post-title"
							className={ classnames(
								'components-markdown-heading-level--1'
							) }
						>
							<Button
								className={ classnames(
									'markdown-block-navigation__item-button'
								) }
								onClick={ () => {
									this.scrollToSelected(
										'.editor-post-title__input',
										true
									);
									document
										.querySelector(
											'.editor-post-title__input'
										)
										.focus();
								} }
							>
								{ title }
							</Button>
						</li>
						{ map( omitBy( rootBlocks, isNil ), ( block ) => {
							const isSelected =
								block.clientId === selectedBlockClientId;

							// Limit to Heading blocks only.
							if ( ! [ 'core/heading' ].includes( block.name ) ) {
								return false;
							}

							return (
								<li
									key={ block.clientId }
									className={ classnames(
										'components-markdown-heading-level--' +
											block.attributes.level,
										{
											'is-selected': isSelected,
										}
									) }
								>
									<Button
										className={ classnames(
											'markdown-block-navigation__item-button'
										) }
										onClick={ () => {
											this.scrollToSelected(
												'block-' + block.clientId
											);
											selectBlock( block.clientId );
										} }
									>
										{ block.attributes.content.replace(
											/(<([^>]+)>)/gi,
											''
										) }
									</Button>
								</li>
							);
						} ) }
					</ul>
				</div>
			</Fragment>
		);
	}
}

export default compose( [
	withSelect( ( select ) => {
		const {
			getSelectedBlockClientId,
			getBlocks,
			getGlobalBlockCount,
		} = select( 'core/block-editor' );

		const { getEditedPostAttribute } = select( 'core/editor' );

		const selectedBlockClientId = getSelectedBlockClientId();

		return {
			rootBlocks: getBlocks(),
			headingBlockCount: getGlobalBlockCount( 'core/heading' ),
			title: getEditedPostAttribute( 'title' ),
			isActive: select( 'core/edit-post' ).isFeatureActive(
				'markdownWritingMode'
			),
			isEnabled: select( 'markdown-settings' ).isEditorPanelEnabled(
				'uiToc'
			),
			selectedBlockClientId,
		};
	} ),
	withDispatch( ( dispatch, { onSelect = noop } ) => ( {
		selectBlock( clientId ) {
			dispatch( 'core/block-editor' ).selectBlock( clientId );
			onSelect( clientId );
		},
	} ) ),
	ifCondition( ( props ) => {
		return props.isEnabled;
	} ),
	withSpokenMessages,
] )( TableOfContents );
