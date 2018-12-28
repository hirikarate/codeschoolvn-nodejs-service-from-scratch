const path = require('path');
const { Stream } = require('stream');

const express = require('express')

const { buildPublicPath } = require('./common/web-util')
const member = require('./handlers/member-handler')


const ROOT = process.cwd()
const publicPath = path.join(ROOT, 'public')
const viewPath = path.join(ROOT, 'views')



/*
 * Event listeners
 */

const handleUnexpectedError = (err) => {
    console.error('Unhandled error:', err)
    process.exit()
}
process.on('uncaughtException', handleUnexpectedError)
process.on('unhandledRejection', handleUnexpectedError)


function handleRequest (handler) {
    return (req, res) => {
        res.on('error', handleUnexpectedError)
        handler(req, res)
    }

}

const webapp = express()

// Parsing form-data
webapp.use(express.urlencoded({
    extended: true,
}));

// Parsing JSON data
webapp.use(express.json());

webapp.set('view engine', 'ejs');
webapp.set('views', viewPath);

webapp.get('/', handleRequest(member.onDefaultRoute))

webapp.get('/members', (req, res) => {
    // throw new Error('A random error')
    handleRequest(member.onMemberListRoute)(req, res)
})

webapp.get('/member-detail', handleRequest(member.onMemberDetailRoute))
webapp.post('/member-detail', handleRequest(member.onMemberSaveRoute))

webapp.get('/member-create', handleRequest(member.onMemberCreateRoute))
webapp.post('/member-create', handleRequest(member.onMemberSaveRoute))

webapp.get('/member-delete', handleRequest(member.onMemberConfirmDeleteRoute))
webapp.post('/member-delete', handleRequest(member.onMemberExecuteDeleteRoute))

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