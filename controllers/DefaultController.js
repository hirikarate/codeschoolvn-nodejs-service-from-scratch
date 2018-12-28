
class DefaultController {
    
    /**
     * Goes to homepage view
     */
    homepage(req, res) {
        res.render('default', {
            title: 'Trang chủ',
        })
    }
}

exports.DefaultController = DefaultController
