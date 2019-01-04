const { HobbyRepository } = require('../data-access/HobbyRepository')
const { HobbyMapper } = require('../models/mappers/HobbyMapper')

class HobbyProvider {

    constructor() {
        this._repo = new HobbyRepository()
        this._mapper = new HobbyMapper()
    }

    /**
     * Fetches all hobbies
     */
    getAll() {
        const entities = this._repo.findAll()
        const hobbies = this._mapper.fromEntityToHobbyDetail(entities)
        return hobbies
    }

    /**
     * Searches by hobby ID, return ONE hobby if found,
     * otherwise returns `null`.
     * @params {number} id Hobby ID to find
     */
    getDetails(id) {
        const entity = this._repo.findById(id)
        const hobby = this._mapper.fromEntityToHobbyDetail(entity)
        return hobby
    }

    /**
     * Checks if there is any hobby with given ID
     * @params {number} id Hobby ID to check
     */
    exists(id) {
        return this._repo.exists(id)
    }

    /**
     * Adds new hobby
     * @params {NewHobby} New hobby instance
     */
    create(newHobby) {
        let entity = this._mapper.fromHobbyDetailToEntity(newHobby)
        entity = this._repo.create(entity)
        newHobby.id = entity.id
        return newHobby
    }

    /**
     * Updates existing hobby
     * @params {HobbyDetail} Modified hobby instance
     */
    update(modifiedHobby) {
        let entity = this._mapper.fromHobbyDetailToEntity(modifiedHobby)
        this._repo.update(entity)
        return modifiedHobby
    }

    /**
     * Deletes a hobby, returns true if success, false if failed.
     * @params {number} id Hobby ID to delete
     */
    delete(id) {
        return this._repo.delete(id)
    }

}

module.exports = { HobbyProvider }