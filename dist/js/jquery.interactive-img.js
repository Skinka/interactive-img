;(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory;
    } else {
        factory(jQuery);
    }
}(function ($) {
    'use script';

    var InteractiveImg = function (elm, opt) {
        var self,
            $darkenBox,
            init = function () {
                setDarken(elm, opt);
                setImage(elm, opt);
            };

        self = {
            init: init
        };

        function setImage(elm, options) {
            options = setConfig($(elm), options);

            var image = new Image();
            image.className = 'interactive__img';
            image.onload = function (img, opt) {
                initPoints(img, opt);
            }.bind(this, image, options);
            $(window).on('resize', function (img, opt) {
                initPoints(img, opt);
            }.bind(this, image, options));
            image.src = $(elm).data('ii-src');
            $(elm).append($(image));
        }

        function setDarken(elm, options) {
            $darkenBox = $('<div class="interactive-darken" style="display: none;"></div>');
            $darkenBox.on('click', function () {
                var $this = $(this);
                $this.parent().find('.interactive-point__description:visible').fadeOut(options.duration);
                $this.fadeOut(options.duration);
            });
            $(elm).append($darkenBox);
        }

        function setConfig(obj, config) {
            config.width = obj.data('ii-width') ? obj.data('ii-width') : config.width;
            config.height = obj.data('ii-height') ? obj.data('ii-height') : config.height;
            config.mode = obj.data('ii-mode') ? obj.data('ii-mode') : config.mode;
            config.duration = obj.data('ii-duration') ? obj.data('ii-duration') : config.duration;
            return config;
        }

        function initPoints(img, options) {
            var $points = $(img).parent().find('.interactive-point');
            $points.each(function (index, item) {
                initPoint($(item), options);
                setEvents($(item), options);
            });
        }

        function initPoint($point, options) {
            var top, left;
            var img = $point.parents('.interactive').find('img.interactive__img');
            top = (parseInt($point.data('ii-top')) * parseInt(img.height())
                / parseInt(options.height))
                - ($point.innerHeight() / 2);
            left = (parseInt($point.data('ii-left')) * parseInt(img.width())
                / parseInt(options.width))
                - ($point.innerWidth() / 2);
            descriptionPos($point);

            $point.css({top: top, left: left});
        }

        function setEvents($point, options) {
            $point.off();

            if (options.mode.indexOf('click') >= 0) {
                onClick($point, options);
            }

            if (options.mode.indexOf('hover') >= 0 && $(window).outerWidth() > 992) {
                onHover($point, options);
            } else if (options.mode.indexOf('hover') >= 0 && options.mode.indexOf('click') < 0 && $(window).outerWidth() <= 992) {
                onClick($point, options);
            }
        }

        function onClick($point, options) {
            $point.on('click', function (e) {
                $point.parent().append($darkenBox);
                $point.parent().append($point);
                $darkenBox.stop().fadeToggle(options.duration);
                $point.find('.interactive-point__description').stop().fadeToggle(options.duration, function () {
                    if ($(window).width() <= 992) {
                        correctionPos($point);
                    }
                });
            });
        }

        function onHover($point, options) {
            $point.hover(function () {
                $point.parent().append($darkenBox);
                $point.parent().append($point);
                $darkenBox.stop().fadeIn(options.duration);
                $point.find('.interactive-point__description').stop().fadeIn(options.duration);
            }, function () {
                $darkenBox.stop().fadeOut(options.duration);
                $point.find('.interactive-point__description').stop().fadeOut(options.duration);
            });
        }

        function descriptionPos($point) {
            var desc = $point.find('.interactive-point__description');
            var desc_pos = $point.data('ii-position') ? $point.data('ii-position') : 'bottom';
            switch (desc_pos) {
                case 'top':
                    desc.addClass('interactive-point__description--top');
                    desc.css('margin', '-' + (desc.innerHeight() + $point.height() * 1.5) + 'px 0 0 -' + (desc.innerWidth() / 2 - $point.width() / 2) + 'px');
                    break;
                case 'bottom':
                    desc.addClass('interactive-point__description--bottom');
                    desc.css('margin', ($point.height() / 2) + 'px 0 0 -' + (desc.innerWidth() / 2 - $point.width() / 2) + 'px');
                    break;
                case 'right':
                    desc.addClass('interactive-point__description--right');
                    desc.css('margin', '-' + (desc.innerHeight() / 2 + $point.height() / 2) + 'px 0 0 ' + $point.width() * 1.5 + 'px');
                    break;
                case 'left':
                    desc.addClass('interactive-point__description--left');
                    desc.css('margin', '-' + (desc.innerHeight() / 2 + $point.height() / 2) + 'px 0 0 -' + (desc.innerWidth() + $point.width() / 2) + 'px');
                    break;
            }
        }

        function correctionPos($point) {
            var desc = $point.find('.interactive-point__description');
            if (desc.offset().top < 0)
                desc.css('margin-top', (parseInt(desc.css('margin-top')) + Math.abs(desc.offset().top)) + 'px');
            if (desc.offset().left < 0)
                desc.css('margin-left', (parseInt(desc.css('margin-left')) + Math.abs(desc.offset().left)) + 'px');
            if ($(window).width() - (desc.offset().left + desc.width()) < 0) {
                desc.css('margin-left', (parseInt(desc.css('margin-left')) - Math.abs(($(window).width() - (desc.offset().left + desc.width()))) - parseInt(desc.css('padding-right')) - parseInt(desc.css('padding-left'))) + 'px');
            }
        }

        return self;
    };

    $.fn.interactiveImg = function (opt, opt2) {
        var result = this;
        this.each(function () {
            var image;
            if (!$(this).data('interactiveImg')) {
                var config = $.extend(
                    $.fn.interactiveImg.defaultOptions,
                    opt
                );
                image = new InteractiveImg(this, config);
                image.init();
                $(this).data('interactiveImg', image);
            } else {
                image = $(this).data('interactiveImg');
            }
            if ($.type(opt) === 'string' && image[opt] !== undefined && $.isFunction(image[opt])) {
                result = image[opt](opt2);
            }
        });
        return result;
    };

    $.fn.interactiveImg.defaultOptions = {
        width: 0,
        height: 0,
        mode: 'hover click',
        duration: 300
    };
}));
