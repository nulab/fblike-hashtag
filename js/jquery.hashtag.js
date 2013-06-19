/**
 * Textarea overlay like Facebook hashtag
 * 
 * @author someda
 * @require jquery 2.0.2 or later
 */
(function($) {

	// レイヤ
	var underlay = function(textarea) {

		var $elem = $(textarea), oldval = $elem.val(),
		// レイヤに適用する mixin
		mixin = {
			cssSync : function() {
				return this.css({
					padding : $elem.css('padding'),
					margin : $elem.css('margin'),
					"line-height" : $elem.css('line-height'),
					"font-size" : $elem.css('font-size')
				});
			},
			adjust : function() {
				var pos = $elem.position();
				return this.css({
					width : $elem.outerWidth() + 'px',
					left : pos.left + 'px',
					top : pos.top + 'px'
				});
			},
			refresh : function() {
				var re = new RegExp(/(^|\s)#(.+?)(\s|$)/g), v = $elem.val();
				var escaped = $('<div>').text(v).html();
				var html = escaped.replace(re, function(m, p1, p2, p3, offset, str) {
					return p1 + '<b>#' + p2 + '</b>' + p3;
				});
				return this.children('span').html(html).end();
			}
		},
		// レイヤ本体
		$div = $('<div class="Layer"><span></span></div>').insertBefore($elem)
				.extend(mixin).cssSync().adjust();

		return {
			update : function() {
				var curval = $elem.val();
				if (curval !== oldval) {
					$div.refresh();
					oldval = curval;
				}
			}
		};
	};
	// textarea の変更を拾ってレイヤを更新する
	var hashtag = function(textarea) {
		var $elem = $(textarea), evtsuffix = '.hashtag';

		var bind = function() {
			var events = [ 'keydown', 'keyup', 'keypress', 'click', 'change' ], layer = underlay(textarea);
			$.each(events, function(i, evt) {
				$elem.on(evt + evtsuffix, $.proxy(layer.update, layer));
			});

			// リサイズではなく、高さを自動拡張する
			$elem.on('scroll' + evtsuffix, function() {
				$elem.height($elem.height() + $elem.scrollTop());
			});

			$elem.data('hashtag', 'initialized');
		};

		return {
			init : function() {
				if (!$elem.is('textarea') || $elem.data('hashtag')) {
					return;
				}
				bind();
			}
		};
	};

	$.fn['hashtag'] = function() {
		return this.each(function(i, elem) {
			hashtag(elem).init();
		});
	};

})(jQuery);