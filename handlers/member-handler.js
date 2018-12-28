const http = require('http')

const MEMBERS = require('../data/members-data')
const Hobby = require('../models/Hobby.enum')
const Faculty = require('../models/Faculty.enum')
const { Member } = require('../models/Member')



exports.onDefaultRoute = function (req, res) {
    res.render('default', {
        title: 'Trang chủ',
    })
}

exports.onMemberListRoute = function (req, res) {
    res.render('member-list', {
        title: 'Danh sách thành viên',
        members: MEMBERS
    })
}

function loadHobbyFromDb() {
    const dbRows = {
        READING: { key: 'reading', label: 'Đọc truyện ngôn tình' },
        SWIMMING: { key: 'swimming', label: 'Tắm sông' },
        TRAVELLING: { key: 'travelling', label: 'Đi bụi' },
        SHOPPING: { key: 'shopping', label: 'Mua Bitcoin' },
    }
    return Promise.resolve(dbRows)
}

exports.onMemberCreateRoute = async function (reqOrMember, res, validationErrors = []) {
    let member
    if (! (reqOrMember instanceof http.IncomingMessage)) {
        member = reqOrMember
        member.hobbies = member.hobbies || []
    } 
    else { // First visit
        member = {
            hobbies: [],
         }
    }

    return res.render('member-create', {
        id: null,
        member,
        errors: validationErrors,
        Hobby,
        Faculty,
        title: 'Thêm thành viên',
    })
}

exports.onMemberDetailRoute = function (reqOrMember, res, validationErrors = []) {
    let member, id
    if (reqOrMember instanceof http.IncomingMessage) {
        id = reqOrMember.query.id

        if (Number.isNaN(id) || !MEMBERS[id]) {
            return res.render('error', {
                title: 'Sự cố',
                reason: 'Mã thành viên không tồn tại' 
            })
        }

        member = MEMBERS[id]
    }
    else { // submitted form data
        member = reqOrMember
        id = reqOrMember.id
    }

    res.render('member-detail', {
        id,
        member,
        errors: validationErrors,
        Hobby,
        Faculty,
        title: 'Chi tiết',
    })
}

exports.onMemberSaveRoute = function (req, res) {
    const formData = req.body
    const isEdit = (req.path === '/member-detail')

    if (isEdit) {
        const member = MEMBERS[formData.id]
        if (!member) {
            return res.redirect('/')
        }
        const { errors: valErrors, data } = Member.from(formData)
        if (valErrors) {
            return exports.onMemberDetailRoute(formData, res, valErrors)
        }
        MEMBERS[formData.id] = data
        return exports.onMemberDetailRoute(req, res)
    }
    else { // Create new

        // Translate raw data to Member type
        const { errors: valErrors, data } = Member.from(formData)

        if (valErrors) {
            return exports.onMemberCreateRoute(formData, res, valErrors)
        }

        // Add to database
        const newId = MEMBERS.push(data) - 1

        // Redirects to edit page
        res.redirect(`/member-detail?id=${newId}`)
    }
}


exports.onMemberConfirmDeleteRoute = function (req, res) {
    const { id } = req.query

    if (Number.isNaN(id) || !MEMBERS[id]) {
        return res.render('error', {
            title: 'Sự cố',
            reason: 'Mã thành viên không tồn tại' 
        })
    }

    const member = MEMBERS[id]
    
    res.render('member-delete', {
        id,
        member,
        backUrl: req.headers.referer,
        title: 'Xác nhận xóa',
    })
}

exports.onMemberExecuteDeleteRoute = function (req, res) {
    const { id } = req.body

    if (Number.isNaN(id) || !MEMBERS[id]) {
        return res.render('error', {
            title: 'Sự cố',
            reason: 'Mã thành viên không tồn tại' 
        })
    }

    // Add to database
    MEMBERS.splice(id, 1)

    // Redirects to edit page
    res.redirect('/members')
}
