
/**
 * Run event after DOM is ready
 * @param {Function} fn Callback function
 */
var DOMready = function(fn) {

	/* Sanity check */
	if (typeof fn !== 'function') return;

	/* If document is already loaded, run method */
	if (document.readyState === 'interactive' || document.readyState === 'complete') {
		return fn();
	}

	/* Otherwise, wait until document is loaded */
	document.addEventListener('DOMContentLoaded', fn, false);

};

/* DOM is ready */
DOMready(function() {
	
	var _itemsObject = {},
		_deviceSwitcher = document.querySelector('#switcher'),
		_deviceFrame = _deviceSwitcher.querySelector('#switcher-frame');
	
	/* Read text file */
	function readTextFile(file, callback) {
		var rawFile = new XMLHttpRequest();
		rawFile.overrideMimeType("application/json");
		rawFile.open("GET", file, true);
		rawFile.onreadystatechange = function() {
			if (rawFile.readyState === 4 && rawFile.status == "200") {
				callback(rawFile.responseText);
			}
		}
		rawFile.send(null);
	}

	/* Read JSON config file and process the callback function */
	readTextFile("config.json", function(text){
		var _itemsObject = JSON.parse(text);
		
		_itemsObject = _itemsObject;
		
		/* Set current item */
		var _currentItemId = decodeURI(location.search.substring(location.search.indexOf('=')+1)) || Object.keys(_itemsObject)[0];
		
		/* Build items select dropdown list */
		var _ddSelectList = document.createElement('ul');
		
		for (var prop in _itemsObject) {
			if (_itemsObject.hasOwnProperty(prop)) {
				var _itemData = _itemsObject[prop],
					_ddSelectListItem = document.createElement('li')
					_ddSelectlLink = document.createElement('a');
				
				_ddSelectlLink.setAttribute('data-item-id', (_itemData.id || ''));
				_ddSelectlLink.setAttribute('data-item-name', (_itemData.name || ''));
				_ddSelectlLink.setAttribute('data-item-demo', (_itemData.demo || ''));
				_ddSelectlLink.setAttribute('data-item-buy', (_itemData.buy || ''));
				
			var ddListItemContent = '';
					// ddListItemContent += '<a href="javascript:void();" data-item-id="'+ _itemData.id +'" data-item-name="'+ _itemData.name +'" data-item-demo="'+ _itemData.demo +'" data-item-buy="'+ _itemData.buy +'">'+ _itemData.name +' <span>'+ _itemData.category +'</span></a><img alt="" class="preview" src="'+ _itemData.preview +'">';
			
				// _ddSelectListItem.innerHTML = ddListItemContent;
				
				_ddSelectList.appendChild(_ddSelectlLink);
				_ddSelectList.appendChild(_ddSelectListItem);
			}
		}
		
		// console.log(_ddSelectList)
		
		document.querySelector('.dd-wrap').appendChild(_ddSelectList);
		
		/**
		 * Get item data
		 * @param  {String} itemId The item unique ID
		 * @return {Object}        The item data object
		 */
		var _getItemData = function(itemId) {
			
			for (var prop in _itemsObject) {
				if (_itemsObject.hasOwnProperty(prop)) {
					return _itemsObject[itemId];
				}
			}
			// var _data = {},
				// _item = document.querySelector('a[data-item-name="'+ itemName +'"]');
				
			// if (_item) {
				// _data.name = itemName;
				// _data.demo = _item.getAttribute('data-item-demo');
				// _data.buy  = _item.getAttribute('data-item-buy');
			// }
			
			// return _data;
		};
		
		var _itemSelector = document.querySelector('.dd-wrap'),
			_itemSelected = document.querySelector('.dd-selected'),
			_itemDropDown = document.querySelector('.dd-wrap ul'),
			_dropDownOpen = false;
		
		var dropDownTriggers = document.querySelectorAll('.c-down, .c-up');
		
		for (var i = 0; i < dropDownTriggers.length; i++) {
			dropDownTriggers[i].addEventListener('click', function(event) {
			
				event.preventDefault();
				
				_itemDropDown.style.display = _dropDownOpen ? 'none' : 'block';
				_dropDownOpen = _dropDownOpen ? false : true;
				document.querySelector('.c-down').style.display = _dropDownOpen ? 'none' : 'block';
				document.querySelector('.c-up').style.display = _dropDownOpen ? 'block' : 'none';
				
			}, true);
		}
		
		var _dropDownList = _itemDropDown.querySelectorAll('li a');
		
		for (var i = 0; i < _dropDownList.length; i++) {
			_dropDownList[i].addEventListener('click', function(event) {
				
				event.preventDefault();
				
				window.location.href = '?item=' + (this).getAttribute('data-item-id');
				
			}, true);
		}
		
		var _currentItemData = _getItemData(_currentItemId),
			_currentItemName = _currentItemData.name || 'Select';
				console.log(_currentItemData)
				_deviceFrame.src = _currentItemData.demo;
			
		_itemSelected.innerText = _currentItemName;
		document.querySelector('.link-buy a').setAttribute('href', _currentItemData.buy);
		document.querySelector('.link-close a').setAttribute('href', _currentItemData.demo);
		
		/* Setup the iframe size */
		var	_deviceSwitcherH = _deviceSwitcher.clientHeight,
			_deviceSwitcherWH = window.innerHeight;
			
		_deviceFrame.style.height = (_deviceSwitcherWH - _deviceSwitcherH) +'px';
	});
	
});
