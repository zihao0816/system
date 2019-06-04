/**
 * Reven Studio Presents
 *
 * Author Ralph
 * Since 12/12/2016
 *
 */
(function ($) {
	var _settings;
	var timeoutId;
	var $dropList;
	var $textBox;
	// var $dataNodes;
	$.fn.SearchBox = function (_options) {
		var $this = $(this);
		var _dft = {
			key: 'value',
			highLightIndex: -1,
			// timeoutId: null,
			idKey: 'id',
			nameKey: 'name',
			url: null,
			offsetFixX: 0,
			offsetFixY: 0,
			widthFix: 0,
			positionX: $this.position().left,
			positionY: $this.position().top,
			width: $this.width(),
			type: 'POST',
			requestKey: 'name',
			onSelectionConfirm: null,
            onSelectionChange: null,
            rowTemplate: null

		};
		_settings = $.extend(_dft, _options);
		var _dropListStr = '<div class="auto_div_data" style="border: 1px solid rgb(204, 204, 204); border-radius: 3px; padding: 5px; background-color: rgb(255, 255, 255); top: 0; left: 0; box-shadow: rgb(204, 204, 204) 2px 2px 2px; position: absolute; display: none; width: 400px; z-index: 10000" id="' + $this.attr('id') + 'DropList' + '"></div>';
		$this.parent().append(_dropListStr);
		methods.inits($this, _settings);
		$this.bind('keyup', methods.processKeyup);
		$this.bind('blur', function () {
			setTimeout(function () {
				if(typeof $dropList != 'undefined'){
					$dropList.hide();
				}
			}, 150);
		});
		return $this;
	};
	var methods;
	methods = {

		/***
		 * 初始化弹出框列表的位置，大小
		 */
		inits: function (_textBox, _settings) {
			var _dropList = _textBox.next();
			_dropList.hide();
			// _dropList.show();
			_dropList.css('left', _settings.offsetFixX);
			_dropList.css('top', _settings.offsetFixY);
			_dropList.css('width', _settings.width);
			//$('#auto_div').css('position','absolute');
		},



		/**
		 * 处理鼠标滑过
		 */
		fnOver: function () {
			// this.changeToWhite();
			$(this).css('background-color', '#efefef');
			this.highLightIndex = $(this).index();
			//下面一行注释掉了，百度搜索也没这功能，就是鼠标移动时，跟着改变搜索框的内容
			// $textBox.val($dropList.children().eq(this.highLightIndex).html());
		},

		/**
		 * 处理鼠标移除
		 */
		fnOut: function () {
			// console.log('enter fnOut');
			$(this).css('background-color', '#ffffff');
		},

		/**
		 * 得到自动填充文本
		 */
		getAutoText: function () {
			//有高亮显示的则选中当前选中当前高亮的文本
			if (this.highLightIndex != -1) {
				$textBox.val($(this).html());
                if (typeof _settings.onSelectionConfirm == 'function') {
                    _settings.onSelectionConfirm($dropList.children().eq(this.highLightIndex).data('dataNode'));
                }
				$dropList.html('').hide();
			}
		},

		/**
		 * 处理按下Enter键
		 // * @param keyCode
		 */
		processEnter: function () {
			if (this.highLightIndex != -1) {
				$textBox.val($dropList.children().eq(this.highLightIndex).html());
				if (typeof _settings.onSelectionConfirm == 'function') {
					_settings.onSelectionConfirm($dropList.children().eq(this.highLightIndex).data('dataNode'));
				}

				$dropList.html('').hide();
			}
		},

		/**
		 * 处理按上下键的情况
		 */
		processKeyUpAndDown: function (keyCode) {
			var words = $dropList.children();
			var num = words.length;
			if (num <= 0) return;
			this.changeToWhite();
			this.highLightIndex = ((keyCode != 38 ? num + 1 : num - 1) + this.highLightIndex) % num;
			words.eq(this.highLightIndex).css('background-color', '#efefef');
			$textBox.val(words.eq(this.highLightIndex).html());
		},

		/**
		 * 如果有高亮的则把高亮变白
		 */
		changeToWhite: function () {
			// console.log('enter changeToWhite')
			if (this.highLightIndex != -1) {
				$dropList.children().eq(this.highLightIndex).css('background-color', '#ffffff');
			}
		},

		/**
		 * 处理Ajax回复
		 * @param data Ajax请求得到的返回结果为dom文档对象
		 */
		processAjaxResponse: function  (data) {
			// console.log('enter processAjaxResponse');
			// debugger;
			// $dataNodes = data;
			if (typeof data != 'undefined' && data.length > 0) {
				$dropList.html('').show();
			} else {
				$dropList.html('').hide();
			}
			var json = $(data);
			//console.log(json.length);
			for (var i = 0; i < json.length; i++) {
				var word_div;
                if(typeof _settings.rowTemplate == 'function'){
                    word_div = _settings.rowTemplate(json[i]);
                } else {
                    word_div = $('<div></div>');
                    // eval('content.' + text);
                    // debugger;
                    if (!isEmpty(eval('json[' + i + '].' + _settings.idKey)) && !isEmpty(eval('json[' + i + '].' + _settings.nameKey))) {
                        word_div.attr('for', eval('json[' + i + '].' + _settings.idKey));
                        word_div.html(eval('json[' + i + '].' + _settings.nameKey));
                    }
                    else {
                        word_div.html('');
                    }
                }
                word_div.hover(methods.fnOver, methods.fnOut);
                word_div.click(methods.getAutoText);
                $dropList.append(word_div);
                $(word_div).data('dataNode', json[i]);
                // console.log($(word_div).data('dataNode'));
                // console.log($(word_div));
			}
		},


		/**
		 * 处理Ajax请求
		 // * @param data
		 */
		processAjaxRequest: function () {
			// debugger;
		// console.log('enter processAjaxRequest');
		// 	console.log($textBox.val());
			if($textBox.val() != '') {
				var requestUrl = _settings.url;
				if(_settings.type == 'GET' || _settings.type == 'get'){
					requestUrl += ('?' + _settings.requestKey + '=' + $textBox.val());//
				}
				var data = '{"' + _settings.requestKey + '":"' + $textBox.val() + '"}';
				$dropList = $textBox.next();
				$.ajax({
					type: _settings.type,       //http请求方法,默认:"post"
					url: requestUrl,   //发送请求的地址
					contentType: "application/json", //必须有
					data: data,
					dataType: "json",   //预期服务器返回的数据类型
					success: methods.processAjaxResponse
				});
			}

		},

		processKeyup: function  (event) {
			var myEvent = event || window.event;
			var keyCode = myEvent.keyCode;
			// console.log(keyCode);
			//输入是字母，或者退格键则需要重新请求
			if ((keyCode >= 65 && keyCode <= 90) || keyCode == 8/*backspace*/ || keyCode == 46/*delete*/ || keyCode == 32/*space*/) {
				//以下两行代码是为了防止用户快速输入导致频繁请求服务器
				//这样便可以在用户500ms内快速输入的情况下，只请求服务器一次
				//大大提高服务器性能
				methods.highLightIndex = (-1);
				clearTimeout(timeoutId);
				// var testObj = $(this);
				// console.log(typeof this.processAjaxRequest);
				timeoutId = setTimeout(function(){

					methods.processAjaxRequest()
				}, 1000);
				$textBox = $(this);
				//处理上下键(up,down)
			} else if (keyCode == 38 || keyCode == 40) {
				methods.processKeyUpAndDown(keyCode);
				//按下了回车键
			} else if (keyCode == 13) {
				methods.processEnter();
			}
		}
		
		

	};
})(jQuery);
