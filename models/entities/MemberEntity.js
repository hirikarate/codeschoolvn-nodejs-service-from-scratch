
/**
 * Properties from `MemberModel`
 */
class MemberEntity {

    static from(source = {}) {
        const mem = new MemberEntity()
        mem.id = source.id
        mem.name = source.name
        mem.age = source.age
        mem.address = source.address
        mem.isGraduated = source.isGraduated
        mem.faculty = source.faculty
        mem.hobbies = source.hobbies
        return mem
    }

    constructor() {
        this.id = 0
        this.name = ''
        this.age = ''
        this.address = ''
        this.isGraduated = false
        this.faculty = ''
        this.hobbies = []
    }
}

exports.MemberEntity = MemberEntity
