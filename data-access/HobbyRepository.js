const { HobbyEntity } = require('../models/entities/Hobby.entity')
const { generateFakeData } = require('./mock-data/hobbies-database')

class HobbyRepository {
    
    constructor() {
        if (HobbyRepository.data == null) {
            HobbyRepository.data = generateFakeData()
        }
        this._hobbies = HobbyRepository.data
        this._maxId = Math.max(...this._hobbies.map(m => m.id))
    }

    /**
     * Fetches all hobbies
     */
    findAll() {
        return this._hobbies
    }

    /**
     * Searches by hobbies ID, return ONE hobbies if found,
     * otherwise returns `null`.
     * @params {number} id hobby ID to find
     */
    findById(id) {
        return this._hobbies.find(m => m.id == id)
    }

    /**
     * Searches by hobbies ID, return ONE hobbies if found,
     * otherwise returns `null`.
     * @params {number[]} ids Array of hobby IDs to find
     */
    findByIdMany(ids) {
        if (!ids || !ids.length) { return [] }
        return this._hobbies.filter(m => ids.includes(m.id))
    }

    /**
     * Checks if there is any hobbies with given ID
     * @params {number} id hobby ID to check
     */
    exists(id) {
        return this._hobbies.find(m => m.id == id) != null
    }

    /**
     * Adds new hobbies
     * @params {NewHobby} New hobbies instance
     */
    create(hobbyEntity) {
        if (! (hobbyEntity instanceof HobbyEntity)) {
            throw new Error('Must be of type HobbyEntity')
        }
        hobbyEntity.id = this._nextId()
        this._hobbies.push(hobbyEntity)
        return hobbyEntity
    }

    /**
     * Updates existing hobbies
     * @params {MemberModel} Modified hobbies instance
     */
    update(hobbyEntity) {
        if (! (hobbyEntity instanceof HobbyEntity)) {
            throw new Error('Must be of type HobbyEntity')
        }
        const found = this._hobbies.find(m => m.id == hobbyEntity.id)
        found && Object.assign(found, hobbyEntity)
        return found
    }

    /**
     * Deletes a hobbies, returns true if success, false if failed.
     * @params {number} id Member ID to delete
     */
    delete(id) {
        const index = this._hobbies.findIndex(m => m.id == id)
        if (index < 0) return false
        this._hobbies.splice(index, 1)
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

module.exports = { HobbyRepository }
