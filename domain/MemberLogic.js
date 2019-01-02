const { MemberRepository } = require('../data-access/MemberRepository')
const { MemberFindAllCommand, MemberFindAllResult } = require('../models/DTO/member')

class MemberLogic {
    
    constructor() {
        this._repo = new MemberRepository()
    }

    /**
     * Fetches all members
     */
    findAll(command) {
        const members = this._repo.findAll()
        return new MemberFindAllResult(members, members.length)
    }

    /**
     * Searches by member ID, return ONE member if found,
     * otherwise returns `null`.
     * @params {number} id Member ID to find
     */
    findById(id) {
        return this._members.find(m => m.id == id)
    }

    /**
     * Checks if there is any member with given ID
     * @params {number} id Member ID to check
     */
    exists(id) {
        return this._members.find(m => m.id == id) != null
    }

    /**
     * Adds new member
     * @params {MemberModel} New member instance
     */
    create(member) {
        member.id = this._nextId()
        this._members.push(member)
        return member
    }

    /**
     * Updates existing member
     * @params {MemberModel} Modified member instance
     */
    update(member) {
        const found = this._members.find(m => m.id == member.id)
        Object.assign(found, member)
    }

    /**
     * Deletes a member, returns true if success, false if failed.
     * @params {number} id Member ID to delete
     */
    delete(id) {
        const index = this._members.findIndex(m => m.id == id)
        if (index < 0) return false
        this._members.splice(index, 1)
        return true
    }

}

module.exports = { MemberLogic }