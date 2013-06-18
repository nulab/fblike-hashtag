/**
 * Textarea overlay like Facebook hashtag
 * 
 * @author someda
 * @require jquery 2.0.2 or later
 */
(function($) {

	// オーバーレイ
	var overlay = function(textarea) {

		var $elem = $(textarea), oldval = $elem.val(),
		// オーバーレイエリアに適用する mixin
		mixin = {
			copyStyle : function() {
				return this.css({
					padding : $elem.css('padding'),
					margin : $elem.css('margin'),
					"line-height" : $elem.css('line-height'),
					"font-size" : $elem.css('font-size')
				});
			},
			sync : function() {
				var pos = $elem.position();
				return this.css({
					width : $elem.outerWidth() + 'px',
					left : pos.left + 'px'
				});
			},
			replaceHtml : function() {
				return this.children('span').html(layerHtml()).end();
			}
		},
		// レイヤー用の HTML に置換
		layerHtml = function() {
			var re = new RegExp(/(^|\s)#(.+?)(\s|$)/g), v = $elem.val();
			return v.replace(re, function(m, p1, p2, p3, offset, str) {
				return p1 + '<b>#' + p2 + '</b>' + p3;
			});
		},
		// オーバーレイ本体
		$div = $('<div class="Overlay"><span></span></div>')
				.insertBefore($elem).extend(mixin).copyStyle().sync();
		$elem.on('scroll', function(){
			$elem.height($elem.height() + $elem.scrollTop());
		});

		return {
			update : function(evt) {
				if ($elem.val() !== oldval) {
					$div.replaceHtml();
					oldval = $elem.val();
				}
			}
		};
	};
	// textarea の変更を拾ってオーバーレイエリアを更新する
	var hashtag = function(textarea) {
		var $elem = $(textarea);

		var bind = function() {
			var events = [ 'keydown', 'keyup', 'keypress', 'click', 'change',
					'blur' ], layer = overlay(textarea);
			$.each(events, function(i, evt) {
				$elem.on(evt + '.hashtag', $.proxy(layer.update, layer));
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