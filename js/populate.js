// ===============================
// 🏳️ FLAG + UTILITY FUNCTIONS
// ===============================

// Converts a 2-letter country code (like "us") into a flag emoji (🇺🇸)
function getflag(countryCode) {
    if (countryCode == null) return ''
    return countryCode.toUpperCase().replace(/./g, char =>
        String.fromCodePoint(127397 + char.charCodeAt()) // offset to regional indicator symbols
    );
}

// Rounds a number to a specified number of decimal places, handling scientific notation
function roundnumber(num, scale) {
    if (!("" + num).includes("e")) {
        // Standard rounding for normal numbers
        return +(Math.round(num + "e+" + scale) + "e-" + scale)
    } else {
        // Handle numbers in exponential form (e.g., 1e-7)
        var arr = ("" + num).split("e")
        var sig = ""
        if (+arr[1] + scale > 0) sig = "+"
        return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale)
    }
}

// Calculates the point value of a level given its rank position
function getpoint(rank) {
    if (rank > 50) {
        return 15 // Ranks past 50 have a flat 15 points
    } else {
        // Uses a custom scaling formula, rounded to 3 decimals
        return roundnumber((100 / Math.sqrt(((rank - 1) / 50) + 0.444444)) - 50, 3)
    }
}

// ===============================
// 🎥 VIDEO DISPLAY HELPERS
// ===============================

// Creates a clickable video thumbnail for a verification video
function listvideo(a) {
    if (a.verificationVid.startsWith('https://youtu') || a.verificationVid.startsWith('https://www.youtu')) {
        // For YouTube links, generate a thumbnail image from i.ytimg.com
        return `<a class="ytimg vidprev vidratio" 
            style="background-image: url(https://i.ytimg.com/vi/${
                a.verificationVid
                    .replace(/www\.youtube\.com\/watch\?v=/gi, '')
                    .replace(/\/youtu\.be/gi, '')
                    .replace(/&t=(.*)s/gi, '')
                    .replace(/https:\/\//gi, '')
            }/mqdefault.jpg);" 
            href="https://www.youtube.com/watch?v=${
                a.verificationVid
                    .replace(/www\.youtube\.com\/watch\?v=/gi, '')
                    .replace(/\/youtu\.be/gi, '')
                    .replace(/&t=d+s/gi, '')
                    .replace(/https:\/\//gi, '')
            }" target="_blank">
            <img src="./src/youtube.png"></a>`
    }
    else if (a.verificationVid.startsWith('https://streamable.com')) {
        // For Streamable videos, use their static .jpg preview
        return `<a class="streamimg vidprev vidratio" 
            style="background-image: url('http://cdn-cf-east.streamable.com/image/${
                a.verificationVid.replace(/streamable\.com\//gi, '').replace(/https:\/\//gi, '')
            }.jpg');" 
            href="${a.verificationVid}" target="_blank"><div></div></a>`
    }
    else {
        // For Discord CDN links or others, directly embed the video
        return `<a class="disimg vidprev vidratio" 
            href="${a.verificationVid.replace(/cdn\.(.*)\.com/gi, 'media.$1.net')}" target="_blank">
            <video src="${a.verificationVid.replace(/cdn\.(.*)\.com/gi, 'media.$1.net')}"></video></a>`
    }
}

// Creates an embedded video player (iframe/video) for a level's verification video
function levelvideo(a) {
    if (a.verificationVid.startsWith('https://youtu') || a.verificationVid.startsWith('https://www.youtu')) {
        // YouTube embedded player
        return `<iframe src="https://www.youtube.com/embed/${
            a.verificationVid
                .replace(/www\.youtube\.com\/watch\?v=/gi, '')
                .replace(/\/youtu\.be/gi, '')
                .replace(/&t=(.*)s/gi, '?start=$1')
                .replace(/https:\/\//gi, '')
        }" title="YouTube video player" frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen></iframe>`
    }
    else if (a.verificationVid.startsWith('https://streamable.com')) {
        // Streamable embedded player
        return `<iframe src="https://streamable.com/e/${
            a.verificationVid.replace(/streamable\.com\//gi, '').replace(/https:\/\//gi, '')
        }" frameborder="0" allowfullscreen></iframe>`
    }
    else {
        // Discord or other video source
        return `<video controls src="${
            a.verificationVid.replace(/cdn\.(.*)\.com/gi, 'media.$1.net')
        }"></video>`
    }
}

// ===============================
// 🧱 LEVEL LIST RENDERING
// ===============================

// Loop through all levels and display them in the main page list
for (let i = 0; i < list.length; i++) {
    $('.levels').append(`
        <div>
            <h1>#${i + 1}</h1>
            ${listvideo(list[i])}
            <a class="text" href="./level/?${i + 1}">
                <h2>${list[i].name}</h2>
                <h3>${list[i].author}</h3>
            </a>
        </div>`)
}

// Run a function (probably resizes or checks window layout)
windowcheck()

// ===============================
// 🔍 LEVEL PAGE LOGIC
// ===============================

// Parse URL parameters to get level ID (?1, ?2, etc.)
for (let i = 0; i < location.search.substring(1).split('&').length; i++) {
    if (!isNaN(location.search.substring(1).split('&')[i])) {
        id = location.search.substring(1).split('&')[i].replace(/^[0]+/g, "") - 1
    }
}

try {
    // Base URL for navigation
    url = $(location).attr('href').split('?')[0]

    // Populate level information
    $('#levelname').html(`#${id + 1} - ${list[id].name}`)
    $('#levelauthor').html(`by ${list[id].author.replace(/ \[(.*)\]/gim, ', verified by$1')}`)
    $('#levelvid').html(levelvideo(list[id]))
    $('#levelpass').html(list[id].pass)
    $('#levelid').html(list[id].id)
    $('#levelqualifypointlabel').html(`Points When Completed (${list[id].percentToQualify}%)`)

    // Calculate qualifying and total points
    $('#levelqualifypoint').html((list[id].percentToQualify / 200) * getpoint(id + 1))
    $('#levelpoint').html(getpoint(id + 1))

    // Fetch additional level info from GDBrowser API
    $.get(`https://gdbrowser.com/api/level/${list[id].id}`)
        .then(level => {
            $('#leveldesc').html(level.description)
            $('#levellen').html(level.length)
            $('#levelobj').html(level.objects)
            $('#levelsong').html(`<p>${level.songName} by ${level.songAuthor} (${!Number.isInteger(level.songID) ? '' : 'ID '}${level.songID})${!Number.isInteger(level.songID) ? '' : ' <i class="bi bi-box-arrow-up-right"></i></p>'}`)
            if (!Number.isInteger(level.songID)) {
                $('#levelsong').toggleClass('hoverlink')
            } else {
                $('#levelsong').attr('href', `https://newgrounds.com/audio/listen/${level.songID}`)
            }
        })

    // Disable navigation buttons if at start or end
    if (id == 0) $('.left').toggleClass('disabled')
    if (id == list.length - 1) $('.right').toggleClass('disabled')

    // Hide extra points section if qualification = 100%
    if (list[id].percentToQualify == 100) $('#otherpoint').hide()

    // Navigation buttons
    $('.left').on('click', function () {
        if (id == 0) return
        $(location).attr('href', `${url}?${id}`)
    })
    $('.right').on('click', function () {
        if (id == list.length - 1) return
        $(location).attr('href', `${url}?${id + 2}`)
    })

    // ===============================
    // 🧍 PLAYER RECORDS TABLE
    // ===============================
    let records = []
    for (let i = 0; i < list[id].vids.length; i++) {
        // Detect video source type
        if (list[id].vids[i].link.includes('youtu')) source = 'YouTube'
        else if (list[id].vids[i].link.includes('discordapp')) source = 'Discord'
        else source = 'Video'

        // Bold text if 100% completion
        if (list[id].vids[i].percent == 100) var bold = 'font-weight: bold;'
        else var bold = ''

        // Build record row HTML
        records.push(`
            <tr style="${bold}">
                <td title="${country[list[id].vids[i].user]}" class="country">${getflag(country[list[id].vids[i].user])}</td>
                <td><a class="hoverlink" href="https://gdbrowser.com/u/${list[id].vids[i].user}" target="_blank">${list[id].vids[i].user}</a></td>
                <td>${list[id].vids[i].percent}%</td>
                <td class="hz">${list[id].vids[i].hz}</td>
                <td><a class="hoverlink" href="${list[id].vids[i].link.replace('cdn.discordapp.com', 'media.discordapp.net')}" target="_blank">${source} <i class="bi bi-box-arrow-up-right"></i></a></td>
            </tr>`)
    }

    // Display record stats
    $('#levelrecordspercent').html(`${list[id].percentToQualify}% or better required to qualify`)
    $('#levelrecordsregistered').html(`${list[id].vids.length} records registered`)
    $('#levelrecordslist').html(records.toString().replace(/,/g, ''))

    // Hide record section if no entries
    if (records.length == 0) $('#levelrecords').hide()

    windowcheck()
} catch (e) {
    console.warn('Populating level text failed. Maybe missing ID?')
    console.error(e)
}

// ===============================
// 🧮 RANKING & POINTS AGGREGATION
// ===============================

var rank_data = []
var verify_data = []

// Loop through levels and collect both record and verification data
for (var i = 0; i < list.length; i++) {
    for (var a = 0; a < list[i].vids.length; a++) {
        // BUG NOTE: This condition should probably be (list[i].vids[a].user != '')
        if (!list[i].vids[a].user == '') {
            // Calculate player’s points based on percent or full completion
            rank_data.push({
                link: list[i].vids[a].link,
                level: list[i].name,
                rank: i,
                name: list[i].vids[a].user,
                point: list[i].vids[a].percent == 100 ? getpoint(i + 1) : (list[i].vids[a].percent / 150) * getpoint(i + 1),
                percent: list[i].vids[a].percent
            })
        }
    }
    // Collect data about verifiers
    if (list[i].author.includes('[')) list[i].author = list[i].author.split('[')[1].replace(']', '');
    verify_data.push({
        level: list[i].name,
        rank: i,
        name: list[i].author,
        link: list[i].verificationVid,
        point: getpoint(i + 1)
    })
}

// Combine records by player, summing their total points
const result_rank = Object.values(rank_data.reduce((r, { name, point }) => {
    if (!r[name]) r[name] = { name, point }
    else r[name].point += point
    return r
}, {})).sort((a, b) => b.point - a.point)

// Combine verifier data
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

// Sort players by total points
result_rank.sort((a, b) => b.point - a.point)

// Render leaderboard table
record_list = []
for (let i = 0; i < result_rank.length; i++) {
    record_list.push(`
        <tr userid="${i}" class="userrecord">
            <td title="${country[result_rank[i].name]}" class="country">${getflag(country[result_rank[i].name])}</td>
            <td class="rank">${i + 1}</td>
            <td>${result_rank[i].name}</td>
            <td>${roundnumber(result_rank[i].point, 3)}</td>
        </tr>`)
}
$('#recordslist').html(record_list.toString().replace(/,/g, ''))

// ===============================
// 🧾 PLAYER DETAIL POPUP (MODAL)
// ===============================

$('.userrecord').on('click', function () {
    user_list = []
    hardestsearch = true

    // Find all levels completed by this player
    for (let i = 0; i < rank_data.length; i++) {
        if (rank_data[i].name == result_rank[$(this).attr('userid')].name) {
            if (rank_data[i].link.includes('youtu')) source = 'YouTube'
            else if (rank_data[i].link.includes('discordapp')) source = 'Discord'
            else source = 'Video'

            if (rank_data[i].rank < 50) var bold = 'font-weight: bold;'
            else var bold = ''

            user_list.push(`
                <tr style="${bold}">
                    <td class="rank">${rank_data[i].rank + 1}</td>
                    <td><a class="hoverlink level" href="../level?${rank_data[i].rank + 1}" >${rank_data[i].level}</a></td>
                    <td class="points">${rank_data[i].point}</td>
                    <td><a class="hoverlink" href="${rank_data[i].link.replace('cdn.discordapp.com', 'media.discordapp.net')}" target="_blank">${source} <i class="bi bi-box-arrow-up-right"></i></a></td>
                </tr>`)

            if (hardestsearch && rank_data[i].percent == 100) hardest = rank_data[i]
            hardestsearch = false
        }
    }

    // Find levels verified by this player
    user_verify = []
    for (let i = 0; i < verify_data.length; i++) {
        if (verify_data[i].name == result_rank[$(this).attr('userid')].name) {
            if (verify_data[i].link.includes('youtu')) source = 'YouTube'
            else if (verify_data[i].link.includes('discordapp')) source = 'Discord'
            else source = 'Video'

            if (verify_data[i].rank < 50) var bold = 'font-weight: bold;'
            else var bold = ''

            user_verify.push(`
                <tr style="${bold}">
                    <td class="rank">${verify_data[i].rank + 1}</td>
                    <td><a class="hoverlink level" href="../level?${verify_data[i].rank + 1}" >${verify_data[i].level}</a></td>
                    <td class="points">${verify_data[i].point}</td>
                    <td><a class="hoverlink" href="${verify_data[i].link.replace('cdn.discordapp.com', 'media.discordapp.net')}" target="_blank">${source} <i class="bi bi-box-arrow-up-right"></i></a></td>
                </tr>`)
        }
    }

    // Disable background scroll during modal
    $('body').css('overflow', 'hidden')

    // Display SweetAlert modal with player stats and record lists
    Swal.fire({
        title: `<span title="${country[result_rank[$(this).attr('userid')].name]}">${getflag(country[result_rank[$(this).attr('userid')].name])}</span> ${result_rank[$(this).attr('userid')].name}`,
        html: `
        <div class="info">
            <span><h4>Score</h4><p>${roundnumber(result_rank[$(this).attr('userid')].point, 3)}</p></span>
            <span><h4>Hardest</h4><p>${hardest.level}</p></span>
            <span><h4>Completed</h4><p>${user_list.length} level${user_list.length > 1 ? 's' : ''}</p></span>
            <span style="${user_verify.length == 0 ? 'display: none' : ''}"><h4>Verified</h4><p>${user_verify.length} level${user_verify.length > 1 ? 's' : ''}</p></span>
            <span style="${user_verify.length == 0 ? 'display: none' : ''}"><h4>Total</h4><p>${user_verify.length + user_list.length} levels</p></span>
        </div>
        <divider></divider>
        <h2>Records</h2>
        <table>
            <thead><tr><th class="rank">Rank</th><th>Level</th><th class="points">Points</th><th>Video</th></tr></thead>
            <tbody>${user
```










