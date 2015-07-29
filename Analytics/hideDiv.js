function toutAfficher(){
    divInfo1 = document.getElementById('allVideos');
    divInfo2 = document.getElementById('uniqueVideo');
    if (divInfo.style.display == 'none'){
        divInfo1.style.display = 'block';
        divInfo2.style.display = 'block';
    }
}

function cacherAllVideos(){
    divInfo = document.getElementById('allVideos');
    if (divInfo.style.display == 'none')
        divInfo.style.display = 'block';
    else
        divInfo.style.display = 'none';
    document.getElementById('uniqueVideo').style.display = 'block';
}

function cacherUniqueVideos(){
    divInfo = document.getElementById('uniqueVideo');
    if (divInfo.style.display == 'none')
        divInfo.style.display = 'block';
    else
        divInfo.style.display = 'none';
    document.getElementById('allVideos').style.display = 'block';
}
