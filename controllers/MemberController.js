const http = require('http')

const Faculty = require('../models/Faculty.enum')
const { HobbyProvider } = require('../domain/HobbyProvider')
const { MemberProvider } = require('../domain/MemberProvider')
const { MemberMapper } = require('../models/mappers/MemberMapper')


class MemberController {

    constructor() {
        this._hobProvider = new HobbyProvider()
        this._memProvider = new MemberProvider()
        this._mapper = new MemberMapper()
    }

    /**
     * Lists all members
     */
    list(req, res) {
        const members = this._memProvider.getAll()
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
                hobbyIDs: [],
            }
        }

        const hobbies = this._hobProvider.getAll()
        const viewModel = {
            member,
            errors: validationErrors,
            hobbies,
            Faculty,
            title: 'Thêm thành viên',
        }
        return res.render('member-detail', viewModel)
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
        this._memProvider.create(member)

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

            if (Number.isNaN(id) || !this._memProvider.exists(id)) {
                return res.render('error', {
                    title: 'Sự cố',
                    reason: 'Mã thành viên không tồn tại' 
                })
            }

            member = this._memProvider.getDetails(id)
        }
        else { // submitted form data
            member = reqOrMember
            id = reqOrMember.id
        }

        const hobbies = this._hobProvider.getAll()
        const viewModels = {
            member,
            errors: validationErrors,
            hobbies,
            Faculty,
            title: 'Chi tiết',
        }
        res.render('member-detail', viewModels)
    }

    /**
     * Saves modified member
     * @param {MemberDetail} req.body Member instance
     */
    saveEdit(req, res) {
        const formData = req.body
        const { id } = formData
        if (Number.isNaN(id) || !this._memProvider.exists(id)) {
            return res.render('error', {
                title: 'Sự cố',
                reason: 'Mã thành viên không tồn tại' 
            })
        }

        let member = this._memProvider.getDetails(id)
        const { errors: valErrors, data } = this._mapper.sanitizeMember(formData)
        if (valErrors) {
            return this.detail(formData, res, valErrors)
        }

        member = Object.assign(member, data)
        this._memProvider.update(member)
        return this.detail(req, res)
    }

    /**
     * Goes to delete confirmation view
     * @param {number} params.id Member ID
     */
    confirmDelete(req, res) {

        const { id } = req.params

        if (Number.isNaN(id) || !this._memProvider.exists(id)) {
            return res.render('error', {
                title: 'Sự cố',
                reason: 'Mã thành viên không tồn tại' 
            })
        }

        const member = this._memProvider.getSummary(id)
        
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

        if (Number.isNaN(id) || !this._memProvider.exists(id)) {
            return res.render('error', {
                title: 'Sự cố',
                reason: 'Mã thành viên không tồn tại' 
            })
        }

        this._memProvider.delete(id)

        res.redirect('/members')
    }
}

exports.MemberController = MemberController
