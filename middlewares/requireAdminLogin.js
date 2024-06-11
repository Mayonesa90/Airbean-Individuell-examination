export default function requireAdminLogin(req, res, next) {
    if (req.session.adminIsOnline) {
        next()
    } else {
        res.status(401).send('You need to log in as admin first')
    }
}