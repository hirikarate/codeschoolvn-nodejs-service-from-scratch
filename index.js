const express = require('express')

const { buildPublicPath, buildViewPath } = require('./common/web-util')
const { DefaultController } = require('./controllers/DefaultController')
const { MemberController } = require('./controllers/MemberController')


const publicPath = buildPublicPath()
const viewPath = buildViewPath()



/*
 * Event listeners
 */

const handleUnexpectedError = (err) => {
    console.error('Unhandled error:', err)
    process.exit()
}
process.on('uncaughtException', handleUnexpectedError)
process.on('unhandledRejection', handleUnexpectedError)


function handleRequest (ControllerClass, action) {
    return (req, res) => {
        res.on('error', handleUnexpectedError)
        const controller = new ControllerClass()
        controller[action](req, res)
    }
}

const webapp = express()

// Parsing POST form-data
webapp.use(express.urlencoded({
    extended: true,
}));

// Parsing POST JSON data
webapp.use(express.json());

// Set up view
webapp.set('view engine', 'ejs');
webapp.set('views', viewPath);


// Register routes

webapp.get('/', handleRequest(DefaultController, 'homepage'))

webapp.get('/members', handleRequest(MemberController, 'list'))

// WHY NOT?
// webapp.get('/members/:id', handleRequest(MemberController, 'detail'))
// webapp.post('/members/:id', handleRequest(MemberController, 'saveEdit'))

webapp.get('/members/create', handleRequest(MemberController, 'create'))
webapp.post('/members/create', handleRequest(MemberController, 'saveNew'))

webapp.get('/members/delete/:id', handleRequest(MemberController, 'confirmDelete'))
webapp.post('/members/delete', handleRequest(MemberController, 'delete'))

webapp.get('/members/:id', handleRequest(MemberController, 'detail'))
webapp.post('/members/:id', handleRequest(MemberController, 'saveEdit'))

webapp.use('/static', express.static(publicPath))


// Handle 404
webapp.use((req, res) => {
    res.status(400);
    res.render('error', {
        reason: 'Bạn đang cố gắng truy cập một trang không tồn tại.',
        title: 'Sự cố',
    });
});

// Handle 500
webapp.use((error, req, res, next) => {
    console.error(error)
    res.status(500)
    res.render('error', {
        reason: error,
        title: 'Sự cố',
    })
})

webapp
    .on('error', (err) => {
        console.error('Web Server error:', err)
    })
    .listen(3000, () => {
        console.log('Server is listening at port 3000')
    })