const fs = require('fs')
const path = require('path')
const util = require('util')

const { ResponseError } = require('../models/ResponseError')
const Hobby = require('../models/Hobby.enum')
const Faculty = require('../models/Faculty.enum')
const MEMBERS = require('../data/members.data')

const readFileAsync = util.promisify(fs.readFile)
const ROOT = process.cwd()


exports.onDefaultRoute = function (req) {
    return readFileAsync(path.join(ROOT, 'views', 'default.html'), 'utf8')
}

exports.onMemberListRoute = function (req) {
    const rowStr = MEMBERS
        .map((mem, i) => `
            <tr>
            <td>${mem.name}</td>
            <td>${mem.age}</td>
            <td><a href="/member-detail?id=${i}">Chi tiết</a></td>
            </tr>
        `)
        // .map(mem => `
        //     <tr>
        //     <td>${mem.name}</td>
        //     <td>${mem.age}</td>
        //     </tr>
        // `)
        .reduce((prev, cur) => prev + cur, '')

    return readFileAsync(path.join(ROOT, 'views', 'member-list.html'), 'utf8')
        .then(tpl => {
            const content = tpl.replace('@rows@', rowStr)
            return content
        })
}



/**
 * Gets query string from an URL.
 * 
 * Eg: "http://localhost/path?name=codeschool&from=saigon" => { name: 'codeschool' }
 */
const parseQueryString = function (url) {
    if (!(typeof url === 'string')) {
        // return null // ??
        return {}
    }

    const queryStr = url.split('?')[1] // name=codeschool&from=saigon
    // console.log({
    //     url,
    //     queryStr: url.split('?') 
    // })
    if (queryStr.length < 2) {
        return {}
    }

    const queryStrParts = queryStr.split('&') // ['name=codeschool', 'from=saigon']
    // console.log({
    //     queryStrParts: queryStr.split('&')
    // })

    const queryObj = queryStrParts
        .map(part => {
            const pair = part.split('=')
            if (pair.length < 2) {
                return {}
            }
            const key = pair[0],
                value = pair[1]
            // const [key, value] = part.split('=')

            return {
                [key]: value
            }
        }) // [{name: 'codeschool'}, {from: 'saigon'}]
        .reduce((prev, cur) => {
            // return Object.assign(prev, cur)
            return {
                ...prev,
                ...cur,
            }
        }, {})

    return queryObj
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
    let faStr = '<select name="faculty">'
    faStr += '<option>--Chọn chuyên ngành--</option>'

    // for (let hobby of Hobbies) {
    for (let fac of Object.values(Faculty)) {
        const selected = memFaculty == fac.key ? 'selected' : ''
        faStr += `<option value="${fac.key}" ${selected}>${fac.label}</option>`
    }
    faStr += '</select>'
    return faStr
}

const buildHobbyList = function (memHobbies) {
    let hobStr = ''
    // for (let hobby of Hobbies) {
    for (let hobby of Object.values(Hobby)) {
        const selected = memHobbies.includes(hobby.key) ? 'checked' : ''
        hobStr += `<input type="checkbox" value="${hobby.key}" name="hobby" id="cb${hobby.key}" ${selected}>`
        hobStr += `<label for="cb${hobby.key}">${hobby.label}</label><br>`
    }
    return hobStr
}

exports.onMemberDetailRoute = async function (req) {
    const queryObj = parseQueryString(req.url)
    // console.log({
    //     queryObj })
    const id = parseInt(queryObj['id'])
    if (Number.isNaN(id) || !MEMBERS[id]) {
        throw new ResponseError('Mã thành viên không tồn tại')
    }

    const member = MEMBERS[id]

    // Menu => Convert to async function
    const tpl = await readFileAsync(path.join(ROOT, 'views', 'member-detail.html'), 'utf8');
    
    let content = tpl
        .replace('@hobby_list@', buildHobbyList(member.hobbies))
        .replace('@faculty_list@', buildFacultyList(member.faculty))

    for (let prop in member) {
        // console.log(`@${prop}@`, member[prop])
        // content = content.replace(`@${prop}@`, member[prop]);
        let value
        if (prop === 'isGraduated') {
            value = 'checked'
        }
        // if vs else if
        else if (prop === 'hobbies') {
            value = 'checked'
        }
        else {
            value = member[prop]
        }
        content = content.replace(new RegExp(`@${prop}@`, 'g'), value);
    }

    return content;
}
