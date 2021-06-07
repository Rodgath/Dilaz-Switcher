
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
		_itemSelector = document.querySelector('.dd-wrap'),
		_itemSelected = document.querySelector('.dd-selected'),
		_deviceSwitcher = document.querySelector('#switcher'),
		_deviceFrame = _deviceSwitcher.querySelector('#switcher-frame');
		
	/**
	 * Read text file
	 * 
	 * @param  {string}   file     The file to read
	 * @param  {Function} callback The invoked callback function 
	 * @return {Object}            Returns the file JSON data object
	 */
	function readTextFile(file, callback) {
		
		var rawFile = new XMLHttpRequest();
		
		rawFile.overrideMimeType('application/json');
		rawFile.open('GET', file, true);
		rawFile.onreadystatechange = function() {
			if (rawFile.readyState === 4 && rawFile.status == "200") {
				callback(rawFile.responseText);
			}
		}
		rawFile.send(null);
	}

	/* Read JSON config.json file and process the callback function */
	readTextFile('config.json', function(text) {
		var _itemsObject = JSON.parse(text);
		
		/* Set current item */
		var _currentItemId = decodeURI(location.search.substring(location.search.indexOf('=')+1)) || Object.keys(_itemsObject)[0];
		
		/* Build items select dropdown list */
		var _ddSelectListCom = document.createComment('Items select dropdown'),
			_ddSelectList = document.createElement('ul');
			
		for (var prop in _itemsObject) {
			if (_itemsObject.hasOwnProperty(prop)) {
				
				var _itemData = _itemsObject[prop],
					_ddSelectListItem = document.createElement('li'),
					_ddSelectLink = document.createElement('a'),
					_ddSelectLinkContent = '',
					_ddSelectPreview = document.createElement('img');
					
				_ddSelectLink.setAttribute('href', 'javascript:void();');
				_ddSelectLink.setAttribute('data-item-id', (_itemData.id || ''));
				_ddSelectLink.setAttribute('data-item-name', (_itemData.name || ''));
				_ddSelectLink.setAttribute('data-item-demo', (_itemData.demo || ''));
				_ddSelectLink.setAttribute('data-item-buy', (_itemData.buy || ''));
				
				_ddSelectLinkContent += (_itemData.name || '');
				_ddSelectLinkContent += _itemData.category ? '<span>'+ _itemData.category +'</span>' : '';
				
				_ddSelectLink.innerHTML = _ddSelectLinkContent;
				
				_ddSelectPreview.setAttribute('alt', (_itemData.name || ''));
				_ddSelectPreview.setAttribute('class', 'preview');
				_ddSelectPreview.setAttribute('src', (_itemData.preview || ''));
				
				_ddSelectListItem.appendChild(_ddSelectLink);
				_ddSelectListItem.appendChild(_ddSelectPreview);
				_ddSelectList.appendChild(_ddSelectListItem);
			}
		}
		
		_itemSelector.appendChild(_ddSelectListCom);
		_itemSelector.appendChild(_ddSelectList);
		
		/**
		 * Get item data
		 * @param  {string} itemId The item unique ID
		 * @return {Object}        Returns the item data object
		 */
		var _getItemData = function(itemId) {
			for (var prop in _itemsObject) {
				if (_itemsObject.hasOwnProperty(prop)) {
					return _itemsObject[itemId];
				}
			}
		};
		
		var _itemDropDown = document.querySelector('.dd-wrap ul'),
			_dropDownOpen = false,
			_dropDownTriggers = document.querySelectorAll('.c-down, .c-up');
		
		for (var i = 0; i < _dropDownTriggers.length; i++) {
			_dropDownTriggers[i].addEventListener('click', function(event) {
			
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
		
		_itemSelected.innerText = _currentItemName;
		
		document.querySelector('.link-buy a').setAttribute('href', _currentItemData.buy);
		document.querySelector('.link-close a').setAttribute('href', _currentItemData.demo);
		
		/* Set iFrame 'src' attribute */
		_deviceFrame.src = _currentItemData.demo;
		
		/* Set the iFrame size */
		var	_deviceSwitcherH = _deviceSwitcher.clientHeight,
			_deviceSwitcherWH = window.innerHeight;
			
		_deviceFrame.style.height = (_deviceSwitcherWH - _deviceSwitcherH) +'px';
	});

	/* Read JSON company.json file and process the callback function */
	readTextFile('company.json', function(text) {
		var _companyData = JSON.parse(text),
			_logo = document.querySelector('.logo a'),
			_logoImage = _logo.querySelector('img');
			
		_logo.setAttribute('href', _companyData.url);
		_logo.setAttribute('title', _companyData.name);
		
		_logoImage.setAttribute('src', _companyData.logo);
		_logoImage.setAttribute('alt', _companyData.name);
		
	});
	
});