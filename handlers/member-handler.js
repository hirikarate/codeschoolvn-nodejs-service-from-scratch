const http = require('http')

const MEMBERS = require('../data/members-data-validation')
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


exports.onMemberDetailRoute = function (reqOrMember, res, validationErrors = []) {
    let member, id
    if (reqOrMember instanceof http.IncomingMessage) {
        // const queryObj = parseQueryString(reqOrMember.url)
        // id = parseInt(queryObj['id'])
        id = reqOrMember.query.id

        if (Number.isNaN(id) || !MEMBERS[id]) {
            return res.render('error', { reason: 'Mã thành viên không tồn tại' })
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
        title: 'Trang chủ',
    })
}

exports.onMemberSaveRoute = function (req, res) {
    // const formData = await extractFormData(req)
    const formData = req.body
    console.log({ formData })

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
