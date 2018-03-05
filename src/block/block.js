//  Import CSS.
import './style.scss';
import './editor.scss';

// Include the carousel library
import 'owl.carousel';
import _ from 'lodash';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType, InspectorControls } = wp.blocks; // Import registerBlockType() from wp.blocks
const { withAPIData, SelectControl, ToggleControl, RangeControl } = wp.components;


/**
 * Register Gutenberg Block.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'libby/book-carousel', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Book Carousel' ), // Block title.
	icon: 'dashicons-book-alt', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'embed', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'book' ),
		__( 'carousel' ),
		__( 'covers' ),
	],
	attributes: {
		postType: {
			type: 'select',
			default: 'post'
		},
		taxonomyId: {
			type: 'select',
		},
		autoplay: {
			type: 'boolean',
			default: false
		},
		itemsPerPage: {
			type: 'number',
			default: 3
		}
	},

	/**
	 * The back-end editor function
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	edit: withAPIData( ( { attributes }, { type, taxonomy } ) => {
		const { postType, taxonomyId } = attributes;
		let endpoints = {
			postTypes: `/wp/v2/types`,
		};
		if (postType) {
			if (postType === 'post') {
				endpoints.lists = `/wp/v2/${ taxonomy( 'category' ) }`;
				if (taxonomyId) {
					endpoints.items = `/wp/v2/${ type( 'post' ) }?categories=${taxonomyId}`
				}
			}
		}
		return endpoints;
	} )( ( { items, lists, postTypes, attributes, setAttributes, className, focus, id } ) => {

		const { postType, taxonomyId, autoplay, itemsPerPage } = attributes;

		let listOptions = [{value: '', label: ''}];
		let postTypeOptions = [];

		if (lists && !lists.isLoading && lists.data) {
			lists.data.map(list => {
				listOptions.push({
					value: list.id,
					label: list.name
				});
			});
		}

		if (!postTypes.isLoading && postTypes.data) {
			Object.keys(postTypes.data).map(slug => {
				if (slug === 'attachment' || slug === 'wp_block') {
					return false;
				}
				postTypeOptions.push({
					value: slug,
					label: postTypes.data[slug].name
				});
			});
		}

		let $carousel = null;

		const updateCarousel = () => {
			const options = {
				autoplay: autoplay,
				items: itemsPerPage,
				slideBy: 'page'
			};
			if ($carousel) {
				$carousel.trigger('destroy.owl.carousel');
			} else {
				$carousel = $('#carousel-' + id).owlCarousel(options);
			}
		}

		if (taxonomyId && items) {
			if ( items.isLoading ) {
				return <div>Loading...</div>;
			}

			if ( !items.data || items.data.length === 0 ) {
				return <div>There doesn't seem to be any items in this list.</div>;
			}

			updateCarousel();
		}

		
		
		const onChangePostType = newPostType => {
			setAttributes( { postType: newPostType } );
		};
		
		const onChangeTaxonomyId = newtaxonomyId => {
			setAttributes( { taxonomyId: newtaxonomyId } );
			updateCarousel();
		};

		const onChangeAutoplay = autoplay => {
			setAttributes( { autoplay : autoplay } );
			updateCarousel();
		}

		const onChangeItemsPerPage = itemsPerPage => {
			setAttributes( { itemsPerPage : itemsPerPage } );
			updateCarousel();
		}

		return [
			focus && (
				<InspectorControls key="inspector">
					<SelectControl
						type="string"
						label="Post Type"
						value={postType}
						onChange={onChangePostType}
						options={postTypeOptions}
					/>
					<SelectControl
						type="number"
						label="List"
						value={taxonomyId}
						onChange={onChangeTaxonomyId}
						options={listOptions}
					/>
					 <RangeControl
						label="Items Per Page"
						value={ itemsPerPage }
						onChange={ onChangeItemsPerPage }
						min={ 1 }
						max={ 6 }
					/>
					<ToggleControl
						label={ __( 'Enable Autoplay' ) }
						checked={ !! autoplay }
						onChange={ onChangeAutoplay }
					/>
				</InspectorControls>
			),
			(!taxonomyId || !items) && (<div>Select a list ID in the block settings</div>),
			taxonomyId && items && items.data && (
				<div className={className}>
					<p>Here are your items</p>
					<div className='owl-carousel owl-theme' id={'carousel-' + id}>
						{
							items.data.map(item => {
								return <div>{item.title.rendered}</div>;
							})
						}
					</div>
				</div>
			)
		];
	} ),

	/**
	 * The front-end render function
	 */
	save: function( { attributes } ) {
		return null;
	},
} );
