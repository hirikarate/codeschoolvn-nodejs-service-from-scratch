const { MemberEntity } = require('../models/entities/Member.entity')
const { generateFakeData } = require('./mock-data/members-database')

class MemberRepository {
    
    constructor() {
        if (MemberRepository.data == null) {
            MemberRepository.data = generateFakeData()
        }
        this._members = MemberRepository.data
        this._maxId = Math.max(...this._members.map(m => m.id))
    }

    /**
     * Fetches all members
     */
    findAll() {
        return this._members
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
    create(memberEntity) {
        if (! (memberEntity instanceof MemberEntity)) {
            throw new Error('Must be of type MemberEntity')
        }
        memberEntity.id = this._nextId()
        this._members.push(memberEntity)
        return memberEntity
    }

    /**
     * Updates existing member
     * @params {MemberModel} Modified member instance
     */
    update(memberEntity) {
        if (! (memberEntity instanceof MemberEntity)) {
            throw new Error('Must be of type MemberEntity')
        }
        const found = this._members.find(m => m.id == memberEntity.id)
        Object.assign(found, memberEntity)
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

    /**
     * Generates next ID
     * @private
     */
    _nextId() {
        return ++this._maxId
    }
}

module.exports = { MemberRepository }
