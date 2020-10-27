/**
 * External dependencies
 */
import { get, filter, map } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Component, Fragment } from '@wordpress/element';
import { withSelect, withDispatch } from '@wordpress/data';
import { compose, withInstanceId } from '@wordpress/compose';
import {
	BlockAlignmentToolbar,
	__experimentalImageSizeControl as ImageSizeControl,
} from '@wordpress/block-editor';
import {
	withSpokenMessages,
	Popover,
	Toolbar,
	DropdownMenu,
	TextareaControl,
	TextControl,
} from '@wordpress/components';

class MediaToolbar extends Component {
	constructor() {
		super( ...arguments );
		this.updateAlt = this.updateAlt.bind( this );
		this.updateLink = this.updateLink.bind( this );
		this.updateAlignment = this.updateAlignment.bind( this );
		this.updateImage = this.updateImage.bind( this );
		this.getImageSizeOptions = this.getImageSizeOptions.bind( this );
		this.syncPosition = this.syncPosition.bind( this );

		this.state = {
			anchorRef: null,
			isUpdated: false,
		};
	}

	componentDidMount() {
		this.syncPosition();
	}

	componentDidUpdate() {
		this.syncPosition();
	}

	syncPosition() {
		const { clientId, attributes } = this.props;
		const { id } = attributes;
		const { isUpdated } = this.state;
		if ( ! isUpdated && id ) {
			const range = document.createRange();
			const elementRect = document.querySelector(
				'[data-block="' + clientId + '"] div:first-of-type'
			);
			range.selectNodeContents( elementRect );

			this.setState( { anchorRef: range, isUpdated: true } );
		}
	}

	updateAlt( newAlt ) {
		this.props.setAttributes( { alt: newAlt } );
	}

	updateLink( newLink ) {
		this.props.setAttributes( { href: newLink } );
	}

	updateAlignment( nextAlign ) {
		const extraUpdatedAttributes =
			[ 'wide', 'full' ].indexOf( nextAlign ) !== -1
				? { width: undefined, height: undefined }
				: {};
		this.props.setAttributes( {
			...extraUpdatedAttributes,
			align: nextAlign,
		} );

		this.setState( { isUpdated: false } );
	}

	getImageSizeOptions() {
		const { imageSizes, image } = this.props;
		return map(
			filter( imageSizes, ( { slug } ) =>
				get( image, [ 'media_details', 'sizes', slug, 'source_url' ] )
			),
			( { name, slug } ) => ( { value: slug, label: name } )
		);
	}

	updateImage( sizeSlug ) {
		const { image } = this.props;

		const url = get( image, [
			'media_details',
			'sizes',
			sizeSlug,
			'source_url',
		] );
		if ( ! url ) {
			return null;
		}

		this.props.setAttributes( {
			url,
			width: undefined,
			height: undefined,
			sizeSlug,
		} );
	}

	render() {
		const { isActive, attributes, setAttributes } = this.props;
		const { align, id, alt, width, height, sizeSlug, href } = attributes;
		const { anchorRef } = this.state;

		if ( ! isActive || ! id ) {
			return false;
		}

		const POPOVER_PROPS = {
			className:
				'components-iceberg-popover components-iceberg-image-settings__popover',
			position: 'bottom right',
			focusOnMount: 'container',
		};

		const TOGGLE_PROPS = {
			tooltipPosition: 'bottom',
		};

		return (
			<Fragment>
				<Popover
					className="component-iceberg-contextual-toolbar"
					position="top center"
					focusOnMount="container"
					anchorRef={ anchorRef }
				>
					<Toolbar>
						<BlockAlignmentToolbar
							isCollapsed={ false }
							value={ align }
							onChange={ this.updateAlignment }
						/>
						<DropdownMenu
							className="components-iceberg-more-menu__trigger"
							icon="admin-generic"
							label={ __( 'Image options', 'iceberg' ) }
							popoverProps={ POPOVER_PROPS }
							toggleProps={ TOGGLE_PROPS }
						>
							{ () => (
								<Fragment>
									<TextareaControl
										label={ __( 'Alt text', 'iceberg' ) }
										placeholder={ __(
											'Write a brief description of this image for readers with visual impairments',
											'iceberg'
										) }
										value={ alt }
										onChange={ this.updateAlt }
									/>
									<ImageSizeControl
										onChangeImage={ this.updateImage }
										onChange={ ( value ) =>
											setAttributes( value )
										}
										slug={ sizeSlug }
										width={ width }
										height={ height }
										isResizable={ false }
										imageSizeOptions={ this.getImageSizeOptions() }
									/>
									<TextControl
										label={ __( 'Link', 'iceberg' ) }
										placeholder={ __(
											'https://',
											'iceberg'
										) }
										value={ href }
										onChange={ this.updateLink }
									/>
								</Fragment>
							) }
						</DropdownMenu>
					</Toolbar>
				</Popover>
			</Fragment>
		);
	}
}

export default compose( [
	withInstanceId,
	withSelect( ( select, props ) => {
		const { getMedia } = select( 'core' );
		const { getSettings } = select( 'core/block-editor' );

		const {
			attributes: { id },
			isSelected,
		} = props;
		const { mediaUpload, imageSizes, maxWidth } = getSettings();

		return {
			isSelected,
			image: id && isSelected ? getMedia( id ) : null,
			maxWidth,
			imageSizes,
			mediaUpload,
			isActive: select( 'core/edit-post' ).isFeatureActive(
				'icebergWritingMode'
			),
		};
	} ),
	withDispatch( ( dispatch ) => ( {
		updateBlockAttributes: dispatch( 'core/block-editor' )
			.updateBlockAttributes,
	} ) ),
	withSpokenMessages,
] )( MediaToolbar );
