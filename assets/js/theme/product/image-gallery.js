import 'jquery-zoom';
import _ from 'lodash';
import 'fancybox';

export default class ImageGallery {
    constructor($gallery) {
        this.$mainImage = $gallery.find('[data-image-gallery-main]');
        this.$mainImageNested = $gallery.find('[data-main-image]');
        this.$selectOption = $gallery.find('.slick-current [data-image-gallery-main]');
        this.$selectableImages = $gallery.find('[data-image-gallery-item]');
        this.$swipThumbnails = $gallery.find('.productView-for');
        this.$swipImage = $gallery.find('.productView-nav');
        this.currentImage = {};
    }

    init() {
        this.bindEvents();
        this.setImageZoom();
        this.fancyboxZoom();
    }

    setMainImage(imgObj) {
        this.currentImage = _.clone(imgObj);

        this.setActiveThumb();
        this.swapMainImage();
    }

    setAlternateImage(imgObj) {
        if (!this.savedImage) {
            this.savedImage = {
                mainImageUrl: this.$mainImage.find('img').attr('src'),
                zoomImageUrl: this.$mainImage.attr('data-zoom-image'),
                mainImageSrcset: this.$mainImage.find('img').attr('srcset'),
                $selectedThumb: this.currentImage.$selectedThumb,
            };
        }
        this.setMainImage(imgObj);

        if ($(window).width() > 1024) {
            this.$mainImage.trigger('zoom.destroy');
            this.$mainImage.zoom({ url: this.$mainImage.attr('data-zoom-image'), touch: false });
        }
    }

    restoreImage() {
        if (this.savedImage) {
            this.setMainImage(this.savedImage);
            delete this.savedImage;
        }
    }

    selectNewImage(e) {
        e.preventDefault();
        const $target = $(e.currentTarget);
        const imgObj = {
            mainImageUrl: $target.attr('data-image-gallery-new-image-url'),
            zoomImageUrl: $target.attr('data-image-gallery-zoom-image-url'),
            mainImageSrcset: $target.attr('data-image-gallery-new-image-srcset'),
            $selectedThumb: $target,
            mainImageAlt: $target.children().first().attr('alt'),
        };
        this.setMainImage(imgObj);
    }

    selectNewImage2(e) {
        const $target = $(e.currentTarget).find('.slick-current [data-image-gallery-item]');
        const imgObj = {
            mainImageUrl: $target.attr('data-image-gallery-new-image-url'),
            zoomImageUrl: $target.attr('data-image-gallery-zoom-image-url'),
            mainImageSrcset: $target.attr('data-image-gallery-new-image-srcset'),
            $selectedThumb: $(e.currentTarget).find('.slick-current'),
        };
        
        this.setMainImage(imgObj);

        if ($(window).width() > 1024) {
            this.$mainImage.trigger('zoom.destroy');
            this.$mainImage.zoom({ url: $target.data('image-gallery-zoom-image-url')});
        }
    }

    selectNewImage3(e) {
        const $target = this.$swipThumbnails.find('.slick-current [data-image-gallery-item]');
        const imgObj = {
            mainImageUrl: $target.attr('data-image-gallery-new-image-url'),
            zoomImageUrl: $target.attr('data-image-gallery-zoom-image-url'),
            mainImageSrcset: $target.attr('data-image-gallery-new-image-srcset'),
            $selectedThumb: $('.productView-for').find('.slick-current'),
            mainImageAlt: $target.children().first().attr('alt'),
        };

        this.setMainImage(imgObj);

        if ($(window).width() > 1024) {
            this.$mainImage.trigger('zoom.destroy');
            this.$mainImage.zoom({ url: $target.data('image-gallery-zoom-image-url')});
        }
    }

    setActiveThumb() {
        this.$selectableImages.removeClass('is-active');
        if (this.currentImage.$selectedThumb) {
            this.currentImage.$selectedThumb.addClass('is-active');
        }
    }

    swapMainImage() {
        const isBrowserIE = navigator.userAgent.includes('Trident');

        this.$mainImage.attr({ 'data-zoom-image': this.currentImage.zoomImageUrl, })
            .find('a').attr({href: this.currentImage.mainImageUrl})
            .find('img').attr({src: this.currentImage.mainImageUrl});

        this.$mainImage.find('.productView-img-container img').attr({srcset: this.currentImage.mainImageUrl});  

        this.$mainImage.find('img.zoomImg').attr({src: this.currentImage.zoomImageUrl})
            .find('img.zoomImg').attr({srcset: this.currentImage.zoomImageUrl});

        this.$mainImageNested.attr({
            alt: this.currentImage.mainImageAlt,
            title: this.currentImage.mainImageAlt,
        });

        if (isBrowserIE) {
            const fallbackStylesIE = {
                'background-image': `url(${this.currentImage.mainImageUrl}&ampimbypass=on)`,
                'background-position': 'center',
                'background-repeat': 'no-repeat',
                'background-origin': 'content-box',
                'background-size': 'contain',
            };

            this.$mainImageNested.css(fallbackStylesIE);
        }
    }

    setImageZoom() {
        if ($(window).width() > 1024) {
           this.$mainImage.zoom({ url: this.$mainImage.attr('data-zoom-image'), touch: false });
        }
    }

    fancyboxZoom() {
        $('[data-fancybox="images"]').fancybox({
            buttons: [
                "zoom",
                //"share",
                "slideShow",
                //"fullScreen",
                //"download",
                // "thumbs",
                "close"
            ]
        });
    }

    bindEvents() {
        if ($(window).width() > 550) {
            this.$selectableImages.on('click', this.selectNewImage.bind(this));
            this.$swipThumbnails.on('afterChange', this.selectNewImage2.bind(this));
            this.$swipImage.on('afterChange', this.selectNewImage3.bind(this));
        }
    }
}
