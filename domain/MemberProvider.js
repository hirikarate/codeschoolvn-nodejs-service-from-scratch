const { MemberRepository } = require('../data-access/MemberRepository')
const { MemberMapper } = require('../models/mappers/MemberMapper')

class MemberProvider {

    constructor() {
        this._repo = new MemberRepository()
        this._mapper = new MemberMapper()
    }

    /**
     * Fetches all members
     */
    findAll() {
        const entities = this._repo.findAll()
        const members = this._mapper.fromEntityToMemberDetail(entities)
        return members
    }

    /**
     * Searches by member ID, return ONE member if found,
     * otherwise returns `null`.
     * @params {number} id Member ID to find
     */
    findById(id) {
        const entity = this._repo.findById(id)
        const member = this._mapper.fromEntityToMemberDetail(entity)
        return member
    }

    /**
     * Checks if there is any member with given ID
     * @params {number} id Member ID to check
     */
    exists(id) {
        return this._repo.exists(id)
    }

    /**
     * Adds new member
     * @params {NewMember} New member instance
     */
    create(newMember) {
        let entity = this._mapper.fromMemberDetailToEntity(newMember)
        entity = this._repo.create(entity)
        newMember.id = entity.id
        return newMember
    }

    /**
     * Updates existing member
     * @params {MemberDetail} Modified member instance
     */
    update(modifiedMember) {
        let entity = this._mapper.fromMemberDetailToEntity(modifiedMember)
        this._repo.update(entity)
        return modifiedMember
    }

    /**
     * Deletes a member, returns true if success, false if failed.
     * @params {number} id Member ID to delete
     */
    delete(id) {
        return this._repo.delete(id)
    }

}

module.exports = { MemberProvider }