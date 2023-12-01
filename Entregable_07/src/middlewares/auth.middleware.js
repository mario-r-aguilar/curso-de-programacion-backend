export function isUserAuth(req, res, next) {
	if (req.session?.user) return res.redirect('/products');

	return next();
}

export function isGuest(req, res, next) {
	if (req.session?.user) return next();
	return res.redirect('/');
}
