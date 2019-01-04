const { HobbyRepository } = require('../data-access/HobbyRepository')
const { MemberRepository } = require('../data-access/MemberRepository')
const { MemberMapper } = require('../models/mappers/MemberMapper')

class MemberProvider {

    constructor() {
        this._memRepo = new MemberRepository()
        this._hobRepo = new HobbyRepository()
        this._mapper = new MemberMapper()
    }

    /**
     * Fetches all members
     */
    getAll() {
        const entities = this._memRepo.findAll()
        const members = this._mapper.fromEntityToMemberDetail(entities)
        return members
    }

    /**
     * Searches by member ID, return ONE member if found,
     * otherwise returns `null`.
     * @params {number} id Member ID to find
     */
    getDetails(id) {
        const entity = this._memRepo.findById(id)
        const member = this._mapper.fromEntityToMemberDetail(entity)
        return member
    }

    /**
     * Searches by member ID, return ONE member if found,
     * otherwise returns `null`.
     * @params {number} id Member ID to find
     */
    getSummary(id) {
        const entity = this._memRepo.findById(id)
        const hobbies = this._hobRepo.findByIdMany(entity.hobbyIDs)
        const memSummary = this._mapper.fromEntityToMemberSummary(entity, hobbies)
        return memSummary
    }

    /**
     * Checks if there is any member with given ID
     * @params {number} id Member ID to check
     */
    exists(id) {
        return this._memRepo.exists(id)
    }

    /**
     * Adds new member
     * @params {NewMember} New member instance
     */
    create(newMember) {
        let entity = this._mapper.fromMemberDetailToEntity(newMember)
        entity = this._memRepo.create(entity)
        newMember.id = entity.id
        return newMember
    }

    /**
     * Updates existing member
     * @params {MemberDetail} Modified member instance
     */
    update(modifiedMember) {
        let entity = this._mapper.fromMemberDetailToEntity(modifiedMember)
        this._memRepo.update(entity)
        return modifiedMember
    }

    /**
     * Deletes a member, returns true if success, false if failed.
     * @params {number} id Member ID to delete
     */
    delete(id) {
        return this._memRepo.delete(id)
    }

}

module.exports = { MemberProvider }