
const { parseQueryString, loadHtml } = require('../common/web-util')
const MEMBERS = require('../data/members.data')
const Hobby = require('../models/Hobby.enum')
const Faculty = require('../models/Faculty.enum')
const { ServersideError } = require('../models/ServersideError')


exports.onDefaultRoute = function (req) {
    return loadHtml('default-mat.html')
}

exports.onMemberListRoute = async function (req) {
    const rowStr = MEMBERS
        .map((mem, i) => `
            <tr>
            <td>${mem.name}</td>
            <td>${mem.age}</td>
            <td><a href="/member-detail?id=${i}">Chi tiết</a></td>
            </tr>
        `)
        .reduce((prev, cur) => prev + cur, '')

    const html = await loadHtml('member-list-mat.html')
    const content = html.replace('{{rows}}', rowStr)
    return content
}



// const buildFacultyList = function (memFaculty) {
//     let faStr = ''
//     // for (let hobby of Hobbies) {
//     for (let fac of Object.values(Faculty)) {
//         const selected = memFaculty == fac.key ? 'checked' : ''
//         faStr += `<input type="radio" value="${fac.key}" name="faculty" id="rad${fac.key}" ${selected}>`
//         faStr += `<label for="rad${fac.key}">${fac.label}</label><br>`
//     }
//     return faStr
// }

const buildFacultyList = function (memFaculty) {
    let faStr = '<select name="faculty" class="form-control">'
    faStr += '<option value="">--Chọn chuyên ngành--</option>'

    // for (let hobby of Faculty) {
    for (let fac of Object.values(Faculty)) {
        const selected = memFaculty == fac.key ? 'selected' : ''
        faStr += `<option value="${fac.key}" ${selected}>${fac.label}</option>`
    }
    faStr += '</select>'
    return faStr
}

const buildHobbyList = function (memHobbies) {
    let hobStr = ''
    // for (let hobby of Hobby) {
    for (let hobby of Object.values(Hobby)) {
        const selected = memHobbies.includes(hobby.key) ? 'checked' : ''
        hobStr += `<input type="checkbox" value="${hobby.key}" name="hobbies" id="cb${hobby.key}" ${selected}>`
        hobStr += `<label for="cb${hobby.key}" class="label-check">${hobby.label}</label><br>`
    }
    return hobStr
}

exports.onMemberDetailRoute = async function (req) {
    const queryObj = parseQueryString(req.url)
    // console.log({
    //     queryObj })
    const id = parseInt(queryObj['id'])
    if (Number.isNaN(id) || !MEMBERS[id]) {
        throw new ServersideError('Mã thành viên không tồn tại')
    }

    const member = MEMBERS[id]

    // Menu => Convert to async function
    const tpl = await loadHtml('member-detail-mat.html')
    
    let content = tpl
        .replace('{{index}}', id)
        .replace('{{hobby_list}}', buildHobbyList(member.hobbies))
        .replace('{{faculty_list}}', buildFacultyList(member.faculty))

    for (let prop in member) {
        // console.log(`@${prop}@`, member[prop])
        // content = content.replace(`@${prop}@`, member[prop]);
        let value
        if (prop === 'isGraduated') {
            value = member[prop] ? 'checked' : ''
        }
        else {
            value = member[prop]
        }
        content = content.replace(new RegExp(`{{${prop}}}`, 'g'), value);
    }

    return content;
}
