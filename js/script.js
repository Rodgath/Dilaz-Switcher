
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

	var itemsData = [
		{
			'name' : 'Theme 1',
			'demo' : 'https://yourcompanyurl.com/themes/theme_1',
			'buy' : 'https://www.ThemeDilaz.com/theme/theme1/?r=Rodgath',
			'preview' : 'https://yourcompanyurl.com/previews/theme1.jpg',
			'category' : 'Multi-Purpose',
			'featured' : '',
			'type' : ''
		}
	];
		
	/**
	 * Get item data
	 * @param  {String} itemName The item name
	 * @return {Object}          The item  data object
	 */
	var _getItemData = function(itemName) {
		console.log(itemName)
		var _data = {},
			_item = document.querySelector('a[data-item-name="'+ itemName +'"]');
			
		if (_item) {
			_data.name = itemName;
			_data.demo = _item.getAttribute('data-item-demo');
			_data.buy  = _item.getAttribute('data-item-buy');
		}
		
		return _data;
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
			
			window.location.href = '?theme=' + (this).getAttribute('data-item-name');
			
		}, true);
	}
	
	var _currentItemName = decodeURI(location.search.substring(location.search.indexOf('=')+1)) || 'Select',
		_currentItemData = _getItemData(_currentItemName);
		
	_itemSelected.innerText = _currentItemName;
	document.querySelector('.link-buy a').setAttribute('href', _currentItemData.buy);
	document.querySelector('.link-close a').setAttribute('href', _currentItemData.demo);
	
	/* Setup the iframe size */
	var _deviceSwitcher = document.querySelector('#switcher'),
		_deviceSwitcherH = _deviceSwitcher.clientHeight,
		_deviceSwitcherWH = window.innerHeight,
		_deviceFrame = _deviceSwitcher.querySelector('#switcher-frame');
		
	_deviceFrame.style.height = (_deviceSwitcherWH - _deviceSwitcherH) +'px';
	
});
