const http = require('http')

const Hobby = require('../models/Hobby.enum')
const Faculty = require('../models/Faculty.enum')
const { MemberProvider } = require('../domain/MemberProvider')
const { MemberMapper } = require('../models/mappers/MemberMapper')


class MemberController {

    constructor() {
        this._provider = new MemberProvider()
        this._mapper = new MemberMapper()
    }

    /**
     * Lists all members
     */
    list(req, res) {
        const members = this._provider.findAll()
        const viewModel = {
            title: 'Danh sách thành viên',
            members,
        }
        res.render('member-list', viewModel)
    }

    /**
     * Goes to create view
     * @param {http.IncomingMessage | NewMember} reqOrMember
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
     * @param {NewMember} req.body Member instance
     */
    saveNew(req, res) {
        const formData = req.body
        
        // Translate raw data to Member type
        const { errors: valErrors, data: member } = this._mapper.sanitizeMember(formData)

        if (valErrors) {
            return this.create(formData, res, valErrors)
        }

        // Add to database
        this._provider.create(member)

        // Redirects to edit page
        res.redirect(`/members/${member.id}`)
    }

    /**
     * Goes to detail view
     * @param {http.IncomingMessage | MemberDetail} reqOrMember
     */
    async detail(reqOrMember, res, validationErrors = []) {
        let member, id
        if (reqOrMember instanceof http.IncomingMessage) {
            id = reqOrMember.params.id

            if (Number.isNaN(id) || !this._provider.exists(id)) {
                return res.render('error', {
                    title: 'Sự cố',
                    reason: 'Mã thành viên không tồn tại' 
                })
            }

            member = this._provider.findById(id)
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
     * @param {MemberDetail} req.body Member instance
     */
    saveEdit(req, res) {
        const formData = req.body
        const { id } = formData
        if (Number.isNaN(id) || !this._provider.exists(id)) {
            return res.render('error', {
                title: 'Sự cố',
                reason: 'Mã thành viên không tồn tại' 
            })
        }

        let member = this._provider.findById(id)
        const { errors: valErrors, data } = this._mapper.sanitizeMember(formData)
        if (valErrors) {
            return this.detail(formData, res, valErrors)
        }

        member = Object.assign(member, data)
        this._provider.update(member)
        return this.detail(req, res)
    }

    /**
     * Goes to delete confirmation view
     * @param {number} params.id Member ID
     */
    confirmDelete(req, res) {

        const { id } = req.params

        if (Number.isNaN(id) || !this._provider.exists(id)) {
            return res.render('error', {
                title: 'Sự cố',
                reason: 'Mã thành viên không tồn tại' 
            })
        }

        const member = this._provider.findById(id)
        
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

        if (Number.isNaN(id) || !this._provider.exists(id)) {
            return res.render('error', {
                title: 'Sự cố',
                reason: 'Mã thành viên không tồn tại' 
            })
        }

        this._provider.delete(id)

        res.redirect('/members')
    }

    _loadHobbyFromDb() {
        return Promise.resolve(Hobby)
    }
}

exports.MemberController = MemberController
