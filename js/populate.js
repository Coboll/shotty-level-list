//how many points the top level can have
var shottypoints = 100

// ===============================
// 🌍 Convert a 2-letter country code to a flag emoji
// ===============================
function getflag(countryCode) {
    // If input is null or undefined, return empty string
    if (countryCode == null) return ''
    // Converts letters to Unicode regional indicators to form flag emojis
    return countryCode.toUpperCase().replace(/./g, char =>
        String.fromCodePoint(127397 + char.charCodeAt())
    );
}

// ===============================
// 🎥 Generate preview thumbnail links for videos
// ===============================
function listvideo(a) {
    // YouTube video preview
    if (a.verificationVid.startsWith('https://youtu') || a.verificationVid.startsWith('https://www.youtu')) {
        return `<a class="ytimg vidprev vidratio" style="background-image: url(https://i.ytimg.com/vi/${a.verificationVid.replace(/www\.youtube\.com\/watch\?v=/gi, '').replace(/\/youtu\.be/gi, '').replace(/&t=(.*)s/gi, '').replace(/https:\/\//gi, '')}/mqdefault.jpg);" href="https://www.youtube.com/watch?v=${a.verificationVid.replace(/www\.youtube\.com\/watch\?v=/gi, '').replace(/\/youtu\.be/gi, '').replace(/&t=d+s/gi, '').replace(/https:\/\//gi, '')}" target="_blank"><img src="./src/youtube.png"></a>`
    }
    // Streamable preview
    else if (a.verificationVid.startsWith('https://streamable.com')) {
        return `<a class="streamimg vidprev vidratio" style="background-image: url('http://cdn-cf-east.streamable.com/image/${a.verificationVid.replace(/streamable\.com\//gi, '').replace(/https:\/\//gi, '')}.jpg');" href="${a.verificationVid}" target="_blank"><div></div></a>`
                }
                // Discord CDN direct video preview
                else {
                    return `<a class="disimg vidprev vidratio" href="${a.verificationVid.replace(/cdn\.(.*)\.com/gi, 'media.$1.net')}" target="_blank"><video src="${a.verificationVid.replace(/cdn\.(.*)\.com/gi, 'media.$1.net')}"></video></a>`
        }
    }
// ===============================
// 🎬 Generate embedded playable videos for level pages
// ===============================
function levelvideo(a) {
        // YouTube embed
        if (a.verificationVid.startsWith('https://youtu') || a.verificationVid.startsWith('https://www.youtu')) {
            return `<iframe src="https://www.youtube.com/embed/${a.verificationVid.replace(/www\.youtube\.com\/watch\?v=/gi, '').replace(/\/youtu\.be/gi, '').replace(/&t=(.*)s/gi, '?start=$1').replace(/https:\/\//gi, '')}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
        }
        // Streamable embed
        else if (a.verificationVid.startsWith('https://streamable.com')) {
            return `<iframe src="https://streamable.com/e/${a.verificationVid.replace(/streamable\.com\//gi, '').replace(/https:\/\//gi, '')}" frameborder="0" allowfullscreen></iframe>`
        }
         // Discord video
        else {
            return `<video controls src="${a.verificationVid.replace(/cdn\.(.*)\.com/gi, 'media.$1.net')}"></video>`
        }
}

// ===============================
// 🔢 Utility: round a number to given decimal places
// Handles both normal and scientific notation
// ===============================
function roundnumber(num, scale) {
    if (!("" + num).includes("e")) {
        return +(Math.round(num + "e+" + scale) + "e-" + scale)
    } else {
        // Regular case
        var arr = ("" + num).split("e")
        var sig = ""
        if (+arr[1] + scale > 0) {
            sig = "+"
        }
        return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale)
    }
}

// ===============================
// ⭐ Calculate points for a level based on its rank
// ===============================
function getpoint(rank) {
    // Levels below rank 50 are capped at 15 points
    if (rank > 50) {
        return 15
        // Formula for higher-ranked levels
    } else {
        return roundnumber((shottypoints / Math.sqrt(((rank - 1) / 50) + 0.444444)) - 50, 3)
    }
}

// ===============================
// 🧱 Render all levels on the main list
// ===============================
for (let i = 0; i < list.length; i++) {
    // Append level HTML with video thumbnail and info
    $('.levels').append(`<div><h1>#${i + 1}</h1>${listvideo(list[i])}<a class="text" href="./level/?${i + 1}"><h2>${list[i].name}</h2><h3>${list[i].author}</h3></a></div>`)
}

windowcheck() // Recalculate layout or responsiveness (custom function)


// ===============================
// 🔍 Check URL for ?id to determine selected level page
// ===============================
for (let i = 0; i < location.search.substring(1).split('&').length; i++) {
    if (!isNaN(location.search.substring(1).split('&')[i])) {
        id = location.search.substring(1).split('&')[i].replace(/^[0]+/g, "") - 1
    }
}

try {
    // Get base URL for navigation buttons
    url = $(location).attr('href').split('?')[0]
    
    // Populate level info
    $('#levelname').html(`#${id + 1} - ${list[id].name}`)
    $('#levelauthor').html(`by ${list[id].author.replace(/ \[(.*)\]/gim, ', verified by$1')}`)
    $('#levelvid').html(levelvideo(list[id]))
    $('#levelpass').html(list[id].pass)
    $('#levelid').html(list[id].id)
    $('#levelqualifypointlabel').html(`Points When Completed (${list[id].percentToQualify}%)`)
    //function to calculate points given when reaching list %
    $('#levelqualifypoint').html( Math.pow(shottypoints - (2 * id), list[id].percentToQualify / 100) )
    
    $('#levelpoint').html(getpoint(id + 1))

     // Fetch more details about the level from GDBrowser API
    $.get(`https://gdbrowser.com/api/level/${list[id].id}`)
        .then(level => {
            $('#leveldesc').html(level.description)
            $('#levellen').html(level.length)
            $('#levelobj').html(level.objects)
            $('#levelsong').html(`<p>${level.songName} by ${level.songAuthor} (${!Number.isInteger(level.songID) ? '' : 'ID '}${level.songID})${!Number.isInteger(level.songID) ? '' : ' <i class="bi bi-box-arrow-up-right"></i></p>'}`)
            // Make Newgrounds song clickable if ID exists
            if (!Number.isInteger(level.songID)) {
                $('#levelsong').toggleClass('hoverlink')
            }
            else {
                $('#levelsong').attr('href', `https://newgrounds.com/audio/listen/${level.songID}`)
            }
        })

    // Disable navigation arrows when at edges
    if (id == 0) {
        $('.left').toggleClass('disabled')
    }
    if (id == list.length - 1) {
        $('.right').toggleClass('disabled')
    }
    if (list[id].percentToQualify == 100) {
        $('#otherpoint').hide()
    }
    // Navigation buttons
    $('.left').on('click', function () {
        if (id == 0) return
        $(location).attr('href', `${url}?${id}`)
    })

    $('.right').on('click', function () {
        if (id == list.length - 1) return
        $(location).attr('href', `${url}?${id + 2}`)
    })
    
     // Build record list table
    let records = []
    for (let i = 0; i < list[id].vids.length; i++) {
        // Detect source type (YouTube, Discord, etc.)
        if (list[id].vids[i].link.includes('youtu')) source = 'YouTube'
        else if (list[id].vids[i].link.includes('discordapp')) source = 'Discord'
        else source = 'Video'

        // Bold full completions (100%)
        if (list[id].vids[i].percent == 100) var bold = 'font-weight: bold;'
        else var bold = ''
         // Create record table row
        records.push(`<tr style="${bold}"><td title="${country[list[id].vids[i].user]}" class="country">${getflag(country[list[id].vids[i].user])}</td><td><a class="hoverlink" href="https://gdbrowser.com/u/${list[id].vids[i].user}" target="_blank">${list[id].vids[i].user}</a></td><td>${list[id].vids[i].percent}%</td><td class="hz">${list[id].vids[i].hz}</td><td><a class="hoverlink" href="${list[id].vids[i].link.replace('cdn.discordapp.com', 'media.discordapp.net')}" target="_blank">${source} <i class="bi bi-box-arrow-up-right"></i></a></td></tr>`)
    }
    
    // Inject record data into DOM
    $('#levelrecordspercent').html(`${list[id].percentToQualify}% or better required to qualify`)
    $('#levelrecordsregistered').html(`${list[id].vids.length} records registered`)
    $('#levelrecordslist').html(records.toString().replace(/,/g, ''))
    if (records.length == 0) {
        $('#levelrecords').hide()
    }
    windowcheck()
} catch (e) {
    console.warn('Populating level text failed. Maybe missing ID?')
    console.error(e)
}

// ===============================
// 📊 Rank and verification data aggregation
// ===============================
var rank_data = []
var verify_data = []
// Skip empty user fields
for (var i = 0; i < list.length; i++) {
    for (var a = 0; a < list[i].vids.length; a++) {
        // Calculate points per record
        if (!list[i].vids[a].user == '') {
                                                                                                                                                                         //function to calculate points given to player based on their record
            rank_data.push({ link: list[i].vids[a].link, level: list[i].name, rank: i, name: list[i].vids[a].user, point: list[i].vids[a].percent == 100 ? getpoint(i + 1) : roundnumber(Math.pow(shottypoints - (2 * i ), list[i].vids[a].percent / 100) , 3), percent: list[i].vids[a].percent })
        }
    }
    // Extract verifier name and award verification points
    if (list[i].author.includes('[')) list[i].author = list[i].author.split('[')[1].replace(']', '');
    verify_data.push({ level: list[i].name, rank: i, name: list[i].author, link: list[i].verificationVid, point: getpoint(i + 1) })
}

// ===============================
// 🧮 Combine and total player points
// ===============================
const result_rank = Object.values(rank_data.reduce((r, { name, point }) => {
    if (!r[name]) r[name] = { name, point }
    else r[name].point += point
    return r
}, {})).sort((a, b) => b.point - a.point)

const result_verify = Object.values(verify_data.reduce((r, { name, point }) => {
    if (!r[name]) r[name] = { name, point }
    else r[name].point += point
    return r
}, {}))

// Add verification points to player totals
for (let i = 0; i < result_rank.length; i++) {
    for (let a = 0; a < result_verify.length; a++) {
        if (result_rank[i].name == result_verify[a].name) {
            result_rank[i].point += result_verify[a].point
            break
        }
    }
}

// ===============================
// 🧾 Build player leaderboard table
// ===============================
result_rank.sort((a, b) => b.point - a.point)

record_list = []
for (let i = 0; i < result_rank.length; i++) {
    record_list.push(`<tr userid="${i}" class="userrecord"><td title="${country[result_rank[i].name]}" class="country">${getflag(country[result_rank[i].name])}</td><td class="rank">${i + 1}</td><td>${result_rank[i].name}</td><td>${roundnumber(result_rank[i].point, 3)}</td></tr>`)
}

$('#recordslist').html(record_list.toString().replace(/,/g, ''))

// ===============================
// 🪪 Player record modal popup (SweetAlert)
// ===============================
$('.userrecord').on('click', function () {
    user_list = []
    hardestsearch = true

    // Find player's records
    for (let i = 0; i < rank_data.length; i++) {
        if (rank_data[i].name == result_rank[$(this).attr('userid')].name) {
            if (rank_data[i].link.includes('youtu')) source = 'YouTube'
            else if (rank_data[i].link.includes('discordapp')) source = 'Discord'
            else source = 'Video'
            if (rank_data[i].rank < 50) var bold = 'font-weight: bold;'
            else var bold = ''
            user_list.push(`<tr style="${bold}"><td class="rank">${rank_data[i].rank + 1}</td><td><a class="hoverlink level" href="../level?${rank_data[i].rank + 1}" >${rank_data[i].level}</a></td><td class="points">${rank_data[i].point}</td><td><a class="hoverlink" href="${rank_data[i].link.replace('cdn.discordapp.com', 'media.discordapp.net')}" target="_blank">${source} <i class="bi bi-box-arrow-up-right"></i></a></tr>`)
            if (hardestsearch && rank_data[i].percent == 100) hardest = rank_data[i]
            hardestsearch = false
        }
    }

    // Find player verifications
    user_verify = []
    for (let i = 0; i < verify_data.length; i++) {
        if (verify_data[i].name == result_rank[$(this).attr('userid')].name) {
            if (verify_data[i].link.includes('youtu')) source = 'YouTube'
            else if (verify_data[i].link.includes('discordapp')) source = 'Discord'
            else source = 'Video'
            if (verify_data[i].rank < 50) var bold = 'font-weight: bold;'
            else var bold = ''
            user_verify.push(`<tr style="${bold}"><td class="rank">${verify_data[i].rank + 1}</td><td><a class="hoverlink level" href="../level?${verify_data[i].rank + 1}" >${verify_data[i].level}</a></td><td class="points">${verify_data[i].point}</td><td><a class="hoverlink" href="${verify_data[i].link.replace('cdn.discordapp.com', 'media.discordapp.net')}" target="_blank">${source} <i class="bi bi-box-arrow-up-right"></i></a></tr>`)
        }
    }

    // Prevent scroll while modal is open
    $('body').css('overflow', 'hidden')

    // SweetAlert modal for player stats
    Swal.fire({
        title: `<span title="${country[result_rank[$(this).attr('userid')].name]}">${getflag(country[result_rank[$(this).attr('userid')].name])}</span> ${result_rank[$(this).attr('userid')].name}`,
        html: `
        <div class="info">
            <span>
                <h4>Score</h4>
                <p>${roundnumber(result_rank[$(this).attr('userid')].point, 3)}</p>
            </span>
            <span>
                <h4>Hardest</h4>
                <p>${hardest.level}</p>
            </span>
            <span>
                <h4>Completed</h4>
                <p>${user_list.length} level${user_list.length > 1 ? 's' : ''}</p>
            </span>
            <span style="${user_verify.length == 0 ? 'display: none' : ''}">
                <h4>Verified</h4>
                <p>${user_verify.length} level${user_verify.length > 1 ? 's' : ''}</p>
            </span>
            <span style="${user_verify.length == 0 ? 'display: none' : ''}">
                <h4>Total</h4>
                <p>${user_verify.length + user_list.length} levels</p>
            </span>
        </div>
        <divider></divider>
        <h2>Records</h2>
        <table>
            <thead>
                <tr>
                    <th class="rank">Rank</th>
                    <th>Level</th>
                    <th class="points">Points</th>
                    <th>Video</th>
                </tr>
            </thead>
            <tbody>${user_list.toString().replace(/,/g, '')}</tbody>
        </table>
        <divider class="verifications"></divider>
        <h2 class="verifications">Verifications</h2>
        <table class="verifications">
            <thead>
                <tr>
                    <th class="rank">Rank</th>
                    <th>Level</th>
                    <th class="points">Points</th>
                    <th>Video</th>
                </tr>
            </thead>
            <tbody>${user_verify.toString().replace(/,/g, '')}</tbody>
        </table>`,
        showConfirmButton: false,
        showCloseButton: true,
        scrollbarPadding: false,
        background: 'var(--secondary)',
        color: 'var(--text)',
        customClass: 'recordmodal',
        width: '700px',
        padding: '10px',
        showClass: {
            popup: 'animate__animated animate__fadeInLeft'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutLeft'
        }
    }).then((res) => {
        if (res.isDismissed) $('body').css('overflow', 'auto')
    })
    if (user_verify.length == 0) $('.verifications').hide()
    windowcheck()
})













































