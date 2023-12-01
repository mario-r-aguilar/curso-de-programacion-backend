export function isUserAuth(req, res, next) {
	// Si el usuario tiene la sesión abierta lo redirecciona a la página de productos, de lo contrario a la página de logueo
	if (req.session?.user) return res.redirect('/products');

	return next();
}

export function isGuest(req, res, next) {
	// Si el usuario tiene la sesión abierta lo redirecciona a la página de productos, de lo contrario a la página de logueo
	if (req.session?.user) return next();
	return res.redirect('/');
}
