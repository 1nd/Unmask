/**
 * Unmask {@link https://github.com/pradhanaindra/Unmask}
 * 
 * Show/hide (unmask/mask) password character in a password field.
 * 
 * Usually used in account registration page so user does not have to fill
 * "Password Confirmation" field, just hit "Unmask Password" to see if password
 * she typed is correct.
 * 
 * @requires jQuery {@link http://jquery.com/}
 * @requires jStorage {@link https://github.com/andris9/jStorage}
 * 
 * @copyright 2014 Pradhana Indra {@link https://github.com/pradhanaindra}
 * @license MIT
 */
var Unmask = Unmask || {};
Unmask = function() {
};
Unmask.prototype = function() {
	var isPasswordUnmasked;
	var options;
	var DEFAULT_LANG = 'eng';
	var unmaskConfirmationText = {
		eng : 'Your password is going to be shown as plain text. For your security, please ensure no one see. Unmask your password now? (This message only appear once)',
		ind : 'Password anda akan ditampilkan sebagai teks biasa. Demi keamanan anda, pastikan tidak ada orang lain yang melihat. Tampilkan sebagai teks biasa sekarang? (Pesan ini hanya muncul 1 kali)'
	};
	var toggleLabelText = {
		eng : {
			unmasked : 'Hide password',
			masked : 'See password'
		},
		ind : {
			unmasked : 'Sembunyikan',
			masked : 'Lihat password'
		}
	};

	var unmask = function($passwordElem) {
		changeType($passwordElem, 'text');
		isPasswordUnmasked = true;
	};

	var mask = function($passwordElem) {
		changeType($passwordElem, 'password');
		isPasswordUnmasked = false;
	};

	var togglePassword = function($passwordElem) {
		if ($passwordElem.attr('type') == 'password') {
			this.unmask($passwordElem);
		} else if ($passwordElem.attr('type') == 'text') {
			this.mask($passwordElem);
		}
	};

	/**
	 * Initialize Unmask. Most of the time this is the function you would call
	 * when use Unmask.
	 * 
	 * @param {string} userOptions.toggleId - HTML element's ID of the toggle
	 * button/link.
	 * @param {string} userOptions.passwordId - HTML element's ID of the
	 * password field.
	 * @param {string} [userOptions.passwordConfirmationWrapperId] - Optional.
	 * HTML element's ID of password confirmation field wrapper. Omit this
	 * option if the form does not have password confirmation field.
	 * @param {object} [userOptions.flagNoConfirmation] - Optional. HTML
	 * attribute(s) of a hidden input field created as flag to tell server-side
	 * scripting whether submitted password need to be checked against password
	 * confirmation field or not. If "Unmask" is in use, the hidden field is
	 * created and its value is set to "false".
	 * @param {string} [userOptions.toggleLabelClass.unmasked] - Optional.
	 * Toggle button's text class when password is unmasked/shown as plain text.
	 * @param {string} [userOptions.toggleLabelClass.masked] - Optional. Toggle
	 * button's text class when password is masked.
	 * @param {string} [userOptions.toggleLabelText.unmasked] - Optional. Toggle
	 * button's text when password is unmasked/shown as plain text.
	 * @param {string} [userOptions.toggleLabelText.masked] - Optional. Toggle
	 * button's text when password is masked.
	 * @param {string} [userOptions.unmaskConfirmationText] - Optional. Text for
	 * confirmation dialog that shown first time user try to unmask the
	 * password.
	 * @param {string} [userOptions.language] - Optional. ISO 639-2 code of
	 * language used.
	 */
	var init = function(userOptions) {
		var unmaskObj = this;

		if (userOptions.language === undefined) {
			userOptions.language = DEFAULT_LANG;
		}
		// Set default value of userOptions
		var defaultOptions = {
			toggleLabelClass : {
				unmasked : 'unmasked_password__label_unmasked',
				masked : 'unmasked_password__label_masked'
			},
			toggleLabelText : toggleLabelText[userOptions.language],
			unmaskConfirmationText : unmaskConfirmationText[userOptions.language]
		};
		// Merge default options with user-submitted options
		options = jQuery.extend(true, {}, defaultOptions, userOptions);

		var $toggleElem = $('#' + options.toggleId);
		var $passwordElem = $('#' + options.passwordId);

		// Show toggle button
		$toggleElem.show();

		// Set event when toggle button is clicked (toggle the password
		// between masked/unmasked)
		$toggleElem.on('click', function() {
			if (confirmationDialog()) {
				// Cannot use $passwordElem because it may refer to old
				// password HTMLElement
				unmaskObj.togglePassword($('#' + options.passwordId));
				toggleLabel($toggleElem);
			}
		});

		if (options.passwordConfirmationWrapperId != null
				&& options.passwordConfirmationWrapperId != '') {
			// Hide "password confirmation" section (not only the field, but
			// also label, etc.)
			$('#' + options.passwordConfirmationWrapperId).hide();
		}

		// Create hidden field as flag to tell backend that password does
		// not need confirmation
		if ($.isEmptyObject(options.flagNoConfirmation) == false) {
			$('<input>', {
				attr : $.extend(true, {}, {
					'type' : 'hidden',
					'value' : 0
				// We cannot use false here, because server-side scripting
				// may submit the value as string "false" which is not
				// evaluated as boolean false
				}, options.flagNoConfirmation)
			}).appendTo($passwordElem.closest('form'));
		}

		// Set label in toggle button
		setShownLabel($toggleElem);
		setHiddenLabel($toggleElem);

		// Hide wrong label in toggle button
		$toggleElem.find('.' + options.toggleLabelClass.unmasked).hide();
		$toggleElem.attr('aria-label', function() {
			return $(this).find('.' + options.toggleLabelClass.masked)
					.eq(0).text();
		});
	};

	/**
	 * Change type of password input field between 'text' and 'password'.
	 * 
	 * Derived from https://gist.github.com/3559343 by Blake Miner
	 * {@link https://github.com/bminer}.
	 */
	function changeType($passwordElement, type) {
		try {
			$passwordElement.attr('type', type);
		} catch (error) {
			// Older IE does not allow password field change it's type to text
			// so we will need workaround.

			// Get password element's HTML as string.
			var html = $('<div>').append($passwordElement.clone()).html();
			var regex = /type=(\")?([^\"\s]+)(\")?/; // matches type=foo or
			// type="foo"

			// If regex does not match, we add the type attribute to the end;
			// otherwise, we replace it.
			var $tmp;
			if (html.match(regex) == null) {
				$tmp = $(html.replace('>', 'type="' + type + '">'));
			} else {
				$tmp = $(html.replace(regex, 'type="' + type + '"'));
			}

			// Copy data from original element
			$tmp.data('type', $passwordElement.data('type'));
			$tmp.prop('value', $passwordElement.prop('value'));
			var events = $passwordElement.data('events');
			var callback = function(events) {
				return function() {
					// Bind all prior events
					for (i in events) {
						var y = events[i];
						for (j in y) {
							$tmp.bind(i, y[j].handler);
						}
					}
				}
			}(events);
			$passwordElement.replaceWith($tmp);
			setTimeout(callback, 10); // Wait a bit to call the callback
		}
	}

	function toggleLabel($toggleElem) {
		if (isPasswordUnmasked) {
			$toggleElem.find('.' + options.toggleLabelClass.unmasked).show();
			$toggleElem.find('.' + options.toggleLabelClass.masked).hide();
			$toggleElem.attr('aria-label', function() {
				return $(this).find('.' + options.toggleLabelClass.unmasked)
						.eq(0).text();
			});
		} else if (isPasswordUnmasked === false) {
			$toggleElem.find('.' + options.toggleLabelClass.unmasked).hide();
			$toggleElem.find('.' + options.toggleLabelClass.masked).show();
			$toggleElem.attr('aria-label', function() {
				return $(this).find('.' + options.toggleLabelClass.masked)
						.eq(0).text();
			});
		}
	}

	function setShownLabel($toggleElem) {
		if (($toggleElem.find('.' + options.toggleLabelClass.unmasked).length > 0) == false) {
			// Toggle label for "unmasked" condition is not set yet, so let's
			// set it
			var shownLabel = document.createElement('span');
			$(shownLabel).addClass(options.toggleLabelClass.unmasked).html(
					options.toggleLabelText.unmasked);
			$toggleElem.append(shownLabel);
		}
	}

	function setHiddenLabel($toggleElem) {
		if (($toggleElem.find('.' + options.toggleLabelClass.masked).length > 0) == false) {
			// Toggle label for "masked" condition is not set yet, so let's set
			// it
			var hiddenLabel = document.createElement('span');
			$(hiddenLabel).addClass(options.toggleLabelClass.masked).html(
					options.toggleLabelText.masked);
			$toggleElem.append(hiddenLabel);
		}
	}

	function confirmationDialog() {
		var keyName = 'Unmask_confirmationAppeared';
		var confirmationAppeared;
		confirmationAppeared = $.jStorage.get(keyName);
		if (confirmationAppeared == null) {
			var confirmationResult = window
					.confirm(options.unmaskConfirmationText);
			$.jStorage.set(keyName, true);
		}
		return confirmationAppeared || confirmationResult;
	}

	return {
		init : init,
		unmask : unmask,
		mask : mask,
		togglePassword : togglePassword
	};
}();