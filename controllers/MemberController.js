const http = require('http')

const Hobby = require('../models/Hobby.enum')
const Faculty = require('../models/Faculty.enum')
const { MemberModel } = require('../models/MemberModel')


class MemberController {

    /**
     * Lists all members
     */
    list(req, res) {
        res.render('member-list', {
            title: 'Danh sách thành viên',
            members: MemberModel.findAll()
        })
    }

    /**
     * Goes to create view
     * @param {http.IncomingMessage | MemberModel} reqOrMember
     */
    create(reqOrMember, res, validationErrors = []) {
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

        return res.render('member-detail', {
            member,
            errors: validationErrors,
            Hobby,
            Faculty,
            title: 'Thêm thành viên',
        })
    }

    /**
     * Saves new member
     * @param {MemberModel} req.body Member instance
     */
    saveNew(req, res) {
        console.log('SAVE NEW')
        const formData = req.body
        
        // Translate raw data to Member type
        const { errors: valErrors, data: member } = MemberModel.from(formData)

        if (valErrors) {
            return this.create(formData, res, valErrors)
        }

        // Add to database
        console.log({ saving: member })
        member.save()

        // Redirects to edit page
        res.redirect(`/members/${member.id}`)
    }

    /**
     * Goes to detail view
     * @param {http.IncomingMessage | MemberModel} reqOrMember
     */
    async detail(reqOrMember, res, validationErrors = []) {
        let member, id
        if (reqOrMember instanceof http.IncomingMessage) {
            id = reqOrMember.params.id

            if (Number.isNaN(id) || !MemberModel.exists(id)) {
                return res.render('error', {
                    title: 'Sự cố',
                    reason: 'Mã thành viên không tồn tại' 
                })
            }

            member = MemberModel.findById(id)
        }
        else { // submitted form data
            member = reqOrMember
            id = reqOrMember.id
        }

        res.render('member-detail', {
            member,
            errors: validationErrors,
            Hobby: await this._loadHobbyFromDb(),
            Faculty,
            title: 'Chi tiết',
        })
    }

    /**
     * Saves modified member
     * @param {MemberModel} req.body Member instance
     */
    saveEdit(req, res) {
        const formData = req.body
        const { id } = formData
        if (Number.isNaN(id) || !MemberModel.exists(id)) {
            return res.render('error', {
                title: 'Sự cố',
                reason: 'Mã thành viên không tồn tại' 
            })
        }

        let member = MemberModel.findById(id)
        const { errors: valErrors, data } = MemberModel.from(formData)
        if (valErrors) {
            return this.detail(formData, res, valErrors)
        }

        member = Object.assign(member, data)
        member.save()
        return this.detail(req, res)
    }

    /**
     * Goes to delete confirmation view
     * @param {number} params.id Member ID
     */
    confirmDelete(req, res) {

        const { id } = req.params

        if (Number.isNaN(id) || !MemberModel.exists(id)) {
            return res.render('error', {
                title: 'Sự cố',
                reason: 'Mã thành viên không tồn tại' 
            })
        }

        const member = MemberModel.findById(id)
        
        res.render('member-delete', {
            member,
            backUrl: req.headers.referer,
            title: 'Xác nhận xóa',
        })
    }

    /**
     * Deletes member by id
     * @param {number} params.id Member ID
     */
    delete(req, res) {
        const { id } = req.body

        if (Number.isNaN(id) || !MemberModel.exists(id)) {
            return res.render('error', {
                title: 'Sự cố',
                reason: 'Mã thành viên không tồn tại' 
            })
        }

        MemberModel.delete(id)

        res.redirect('/members')
    }

    _loadHobbyFromDb() {
        return Promise.resolve(Hobby)
    }
}

exports.MemberController = MemberController
