Unmask
======

jQuery plugin to show/hide (unmask/mask) password character in a password field.

Usually used in account registration page so user does not have to fill "Password Confirmation" field, just hit "Unmask Password" to see if password she typed is correct.

## Requires ##

[jQuery](http://jquery.com/) and [jStorage](https://github.com/andris9/jStorage).

## License ##

[MIT](https://raw.github.com/pradhanaindra/Unmask/master/LICENSE)

## Supported Browsers ##

Known **unsupported** browsers are **IE 8.0 and older**. IE 8.0 due to unknown bug. IE 7.0 and older due to bug in jQuery. *Unmask* should working in any other browsers that supported by jQuery. 

Tested on:

- Firefox (Windows PC, Linux, and Android).
- Chrome (Windows PC, Linux & Android).
- Opera (Windows PC & Android). Tested on all variants including Opera Mini.
- IE (Windows PC).
- Android Browser/AOSP.

## Get Started ##

1. Load required modules (jQuery etc.).
2. Load `unmask.js` in your web page.
3. Add the toggle button/link to your HTML. When user click the button/link, we will unmask/mask the password. 
4. Initialize *Unmask*. How? See example. For information about options, check documentation inside `unmask.js`.

Example on registration page:

	<html>
		<head>
		...
		<script src="/js/jquery.js"></script>
		<script src="/js/jStorage.js"></script>
		<script src="/js/unmask.js"></script>
		...
		</head>
		<body>
		...
		<form>
			<div id="email_wrapper">
				<label for="email">Email</label>
				<input name="data[email]" type="email" id="email">
			</div>
			<div id="password_wrapper">
				<label for="password">Password</label>
				<input name="data[password]" type="password" id="password">
				<button type="button" id="unmask_btn" style="display:none;"></button>
			</div>
			<div id="password_confirmation_wrapper">
				<label for="password_confirmation">Confirm your password</label>
				<input name="data[password_confirmation]" type="password" id="password_confirmation">
			</div>
			<input type="submit" value="Create account">
		</form>
		...
		<script>
		$(document).on('ready', function () {
			$('#password').unmask({
				'toggleId' : 'unmask_btn',
				'passwordConfirmationWrapperId' : 'password_confirmation_wrapper'
			});
		});
		</script>
		</body>
	</html>

In example above, *Unmask* will show "unmask password" button (which is hidden at the beginning) and hide password confirmation field and label (technically *Unmask* hide its wrapper).

## Documentation (Docs) ##

For information about *Unmask* parameters and anything else check documentation inside source code of `unmask.js`.

## Additional Features ##

### Internationalization & Localization ###

*Unmask* supports i18n & l10n, although the feature is still tightly coupled to the source code. To add support for your language, you need to edit the source code (`unmask.js`) directly.

Currently *Unmask* provides built-in supports for English and Indonesian.

#### How to add localization for other languages ####

Open file `unmask.js`.

Add text for label of "unmask password" button. Add new object (as name-value pair) to variable `toggleLabelText`.

Format

	<code of the language (we recommend use ISO-639-2)> : {
		masked : <Label of the button when password is masked. It should tell user to press this button if she want to unmask and see her password as plain text>,
		unmasked : <Label of the button when password is unmasked. It should tell user to press this button if she want to mask her password>
	}

Example: you add localization for German. `toggleLabelText` should become:
	...
	toggleLabelText = {
		'eng' : {
			'unmasked' : 'Hide password',
			'masked' : 'See password'
		},
		'ind' : {
			'unmasked' : 'Sembunyikan',
			'masked' : 'Lihat password'
		},
		'deu' : {
			'masked' : 'Siehe Passwort',
			'unmasked' : 'Verbergen'
		}
	},
	...

Then add text for confirmation dialog message that displayed first time the user use "unmask password" button. Add new name-value pair to `unmaskConfirmationText`.

Format

	<code of the language (we recommend ISO-639-2)> : <Confirmation dialog message displayed to user when she click "unmask password" button for first time>

Example: you add localization for German. `unmaskConfirmationText` should become:
	...
	unmaskConfirmationText = {
		'eng' : 'Your password is going to be shown as plain text. For your security, please ensure no one see. Unmask your password now? (This message only appear once)',
		'ind' : 'Password anda akan ditampilkan sebagai teks biasa. Demi keamanan anda, pastikan tidak ada orang lain yang melihat. Tampilkan sebagai teks biasa sekarang? (Pesan ini hanya muncul 1 kali)',
		'deu' : 'Wir werden Ihr Passwort als Klartext anzeigen. Für die Sicherheit Zweck, stellen Sie bitte sicher niemand sehen kann. Zeigen Sie Ihr Passwort jetzt? (Diese Meldung nur einmal angezeigt)'
	},
	...

Note: German in examples above are translated using Google Translate. If the translations are inaccurate, confusing, or funny... please tell us... after you finish laughing :D
