function rolldX(x)
{
    return Math.floor((Math.random() * x)) + 1;
}

function Aspect(setId, uniqueId, aspectName, approaches, stuntName, stuntDescription, quote)
{
    this.setId = setId;
    this.uniqueId = uniqueId;
    this.aspectName = aspectName;
    this.approaches = approaches;
    this.stuntName = stuntName;
    this.stuntDescription = stuntDescription;
    this.quote = quote;
}

function SituationCard(setId, cardType, drawMore, cardText)
{
    this.setId = setId;
    this.cardType = cardType;
    this.drawMore = drawMore;
    this.cardText = cardText;
}


function drawCard(deck, existing)
{
    var x = deck.length;
    var r;
    var c;
    
    while (true)
    {
        var ok = true;
        r = deck[rolldX(x)-1];
        for (var i = 0; i < existing.length; i++)
        {
            if (existing[i].cardText == r.cardText)
            {
                ok = false;
                break;
            }
        }                            

        if (ok)
        {
            break;        
        }            
    }     
    
    return r;
}

function drawWhere()
{
    var deck = decks[0];
    aWhere = new Array();
        
    var c = drawCard(deck, aWhere)
    aWhere.push(c);
    for (var i = 0; i < c.drawMore; i++)
        aWhere.push(drawCard(deck, aWhere));
}

function drawWhat()
{
    var deck = decks[1];
    aWhat = new Array();
        
    var c = drawCard(deck, aWhat)
    aWhat.push(c);
    for (var i = 0; i < c.drawMore; i++)
        aWhat.push(drawCard(deck, aWhat));
}

function drawHow()
{
    var deck = decks[2];
    aHow = new Array();
        
    var c = drawCard(deck, aHow)
    aHow.push(c);
    for (var i = 0; i < c.drawMore; i++)
        aHow.push(drawCard(deck, aHow));
}

function setCharacterCount()
{
    var e = document.getElementById("countSelect");
    characterCount = e.options[e.selectedIndex].value;
}

function saveSettings()
{
    var c = 0;
    var e;
    setsInPlay = new Array();
    for (var i = 0; i < setNames.length; i++)
    {
        e = document.getElementById("setInPlay" + i);
        if (e)
        {
            setsInPlay[i] = e.checked;
            if (e.checked)
                c++;
        }
        else
        {
            setsInPlay[i] = false;
        }
    }
    if (c == 0)
    {
        alert("Select at least one set.");
        return;
    }
    
    setCharacterCount();        
    buildDecks();
    
    var d = document.getElementById("settingsDiv");
    d.style.display = "none";

    d = document.getElementById("settingsDiv2");
    d.innerHTML = getSettings2HTML();
    d.style.display = "block";
    
    phase = 1;

    clearInsets();
}

function saveSettings2()
{
    var s01 = isSetInPlay(0) && isSetInPlay(1);
    var e;
    human = new Array();
    
    for (var i = 1; i <= characterCount; i++)
    {
        var v = document.getElementById("playerName" + i).value;
        if (v.length == 0)
            v = "Player " + i;
            
        playerNames[i] = v;
        
        if (s01)
        {
            e = document.getElementById("isHuman" + i);
            human[i] = e.checked;
        }
        else
            human[i] = false;
    }

    e = document.getElementById("aspectCountSelect");
    aspectCount = e.options[e.selectedIndex].value;

    e = document.getElementById("mustChoose");
    mustChoose = e.checked;
    
    limitFantastic = false;
    if (s01)
    {
        e = document.getElementById("limitFantastic");
        limitFantastic = e.checked;
    }

    var d = document.getElementById("settingsDiv2");
    d.style.display = "none";
    
    d = document.getElementById("aspectGrid");
    d.innerHTML = getAspectGridHTML();
    rebuildAspectSelect();
    d.style.display = "block";
    
    phase = 2;
    
    clearInsets();
}

function isSetInPlay(n)
{
    return setsInPlay[n];
}

function generate()
{
    if (!checkAspectCount())
    {
        return;
    }
    
    buildCharacters();

    drawWhere();
    drawWhat();
    drawHow();

    var d = document.getElementById("aspectGrid");
    d.style.display = "none";

    displayResults();
    
    phase = 3;
    
    clearInsets();
}

function checkAspectCount()
{
    var aC = new Array();
    var e;
    
    for (var c = 1; c <= characterCount; c++)
    {
        aC[c] = 0;
    }
        
    for (var i = 0; i < aspects.length; i++)
    {
        e = document.getElementById("aspectSelect" + i);
        var v = e.options[e.selectedIndex].value;
        if (v > 0)
        {
            aC[v]++;
            if (aC[v] > 3)
            {
                alert("No character may have more than three Aspects.");
                return false;
            }
        }
    }

    if (mustChoose)
    {
        for (var c = 1; c <= characterCount; c++)
        {
            if (aC[c] != aspectCount)
            {
                var plural = aspectCount == 1 ? "" : "s";
                alert("All characters must choose " + aspectCount + " Aspect" + plural + ".");
                return false;
            }
        }
    }        
    
    return true;
}

function buildCharacters()
{
    var aspectAssignments = new Array();
    var availableAspects;
    var characterAspects = new Array();
    for (var i = 1; i <= characterCount; i++)
        characterAspects[i] = new Array();
    
    for (var i = 0; i < aspects.length; i++)
    {
        e = document.getElementById("aspectSelect" + i);
        var v = e.options[e.selectedIndex].value;
        aspectAssignments[i] = v;
        if (v > 0)
            characterAspects[v].push(i);
    }
    
    for (var i = 1; i <= characterCount; i++)
    {
        while (characterAspects[i].length < 3)
        {
            availableAspects = getAvailableAspectsArray(aspectAssignments, human[i]);
            var j = rolldX(availableAspects.length) - 1;
            characterAspects[i].push(availableAspects[j]);
            aspectAssignments[availableAspects[j]] = i;
        }
    }
    
    characters = characterAspects;
}

function getAvailableAspectsArray(assigned, isHuman)
{
    var availableAspects = new Array();
    for (var i = 0; i < assigned.length; i++)
    {
        if (assigned[i] == 0)
        {
            if (!isHuman || aspects[i].setId != 1)
            {
                availableAspects.push(i);
            }
        }
    }

    return availableAspects;
}

function go()
{
    var d;

    setUnlocks()    
    d = document.getElementById("headerDiv");
    d.innerHTML = getHeaderHTML();

    d = document.getElementById("footerDiv");
    d.innerHTML = getFooterHTML();

    d = document.getElementById("settingsDiv");
    d.innerHTML = getSettingsHTML();
    
    showHelpIcon();
    showLinkIcon();
    showPlayIcon();
    
    preloadImages(0);
}

function showAspectCard(n, e)
{
    var d = document.getElementById("aspectCardDiv");
    d.innerHTML = getAspectCardHTML(n);
    if (mouseInTop(e.clientY))
    {
        d.style.top = "auto";
        d.style.bottom = "3.125rem";
    }
    else
    {
        d.style.top = "3.125rem";
        d.style.bottom = "auto";
    }
    
    if (mouseInLeft(e.clientX))
    {
        d.style.left = "auto";
        d.style.right = "3.125rem";
    }
    else
    {
        d.style.left = "3.125rem";
        d.style.right = "auto";
    }

    d.style.visibility = "visible";
}

function hideAspectCard()
{
    clearDiv("aspectCardDiv");
}

function mouseInTop(mouseY)
{
    if (mouseY < window.innerHeight / 2)
        return true;

    return false;        
}

function mouseInLeft(mouseX)
{
    if (mouseX < window.innerWidth / 2)
        return true;

    return false;        
}

function redraw(cType, cSet, cIndex)
{
    if (redrawMode)
    {
        if (cType == 0)
        {
            redrawCharacter(cSet, cIndex);
        }
        
        if (cType == 1)
        {
            redrawSituation(cSet, cIndex);
        }
        
        displayResults();
    }
}

function redrawCharacter(cCharacter, cAspect)
{
    var aspectAssignments = new Array();
    var availableAspects;

    for (var i = 0; i < aspects.length; i++)
    {
        aspectAssignments[i] = 0;
    }

    for (var c = 1; c <= characterCount; c++)
    {
        for (var a = 0; a < characters[c].length; a++)
            aspectAssignments[characters[c][a]] = c;
    }
    
    availableAspects = getAvailableAspectsArray(aspectAssignments, human[cCharacter]);
    var j = rolldX(availableAspects.length) - 1;
    characters[cCharacter][cAspect] = availableAspects[j];
}

function redrawSituation(cSet, cIndex)
{
    var deck = decks[cSet];
    var aSit;
    switch (cSet)
    {
        case 0:
            aSit = aWhere;
            break;
        case 1:
            aSit = aWhat;
            break;
        case 2:
            aSit = aHow;
            break;
    }
    
    var c = drawCard(deck, aSit)
    var c0 = aSit[cIndex];
    aSit[cIndex] = c;
    for (var i = 0; i < c.drawMore; i++)
        aSit.push(drawCard(deck, aSit));
    aSit.splice(cIndex+1, c0.drawMore);
}


function displayResults()
{
    d = document.getElementById("characterDiv");
    d.innerHTML = getCharacterHTML();
    d.style.display = "block";

    d = document.getElementById("situationDiv");
    d.innerHTML = getSituationHTML();
    d.style.display = "block";

    d = document.getElementById("redrawDiv");
    d.innerHTML = getRedrawHTML();
    d.style.display = "block";
    
    clearInsets();
}

function toggleDiscard()
{
    var e = document.getElementById("redrawIcon");
    redrawMode = !redrawMode;
    if (redrawMode)
    {
        e.src = "https://www.evilhat.com/inmf/images/icon_redraw1.png";
    }
    else
    {
        e.src = "https://www.evilhat.com/inmf/images/icon_redraw0.png";
    }
}

function showCharLink(n)
{
    var code = getCodeForAspects(characters[n]);
    
    var playURL = getPlayURL();
    
    var m = "Ask " + playerNames[n] + " to input the code " + code + ", or send them this link:";
    var link = playURL + "?char=" + code;
    
    prompt(m, link);
}

function getPlayURL()
{
    var pathname = window.location.pathname;
    var p = pathname.indexOf("index.html");
    pathname = p == -1 ? pathname : pathname.substring(0, p);
    p = pathname.indexOf("play.html");
    pathname = p == -1 ? pathname : pathname.substring(0, p);
    return window.location.protocol + "//" + window.location.host + pathname + "play.html";
}

function preloadImages(n)
{
    var a = new Array();
    
    switch(n)
    {
        case 0:
            a.push("https://www.evilhat.com/inmf/images/icon0.png");
            a.push("https://www.evilhat.com/inmf/images/icon1.png");
            a.push("https://www.evilhat.com/inmf/images/icon_redraw0.png");
            a.push("https://www.evilhat.com/inmf/images/icon_redraw1.png");
            a.push("https://www.evilhat.com/inmf/images/dtrpg.png");
            a.push("https://www.evilhat.com/inmf/images/link_inmf.jpg");
            a.push("https://www.evilhat.com/inmf/images/link_inmfif.jpg");
            a.push("https://www.evilhat.com/inmf/images/link_recs.jpg");
            for (var i = 0; i < 6; i++)
            {
                a.push("https://www.evilhat.com/inmf/images/dice" + i + "p.png");
            }
            break;
        case 1:
            for (var i = 0; i < 7; i++)
            {
                a.push("https://www.evilhat.com/inmf/images/dice" + i + "p.png");
                a.push("https://www.evilhat.com/inmf/images/dice" + i + "m.png");
                a.push("https://www.evilhat.com/inmf/images/dice" + i + "b.png");
            }
            a.push("https://www.evilhat.com/inmf/images/stress0.png");
            a.push("https://www.evilhat.com/inmf/images/stress1.png");
            break;
    }
    
    preloadImageArray(a);
}

function preloadImageArray(a)
{
    imagePreload = new Array();

    for (var i = 0; i < a.length; i++) {
        imagePreload[i] = new Image();
        imagePreload[i].src = a[i];
    }
}

function saveCookie(k, s)
{
    setCookie(k, s, 365);
}

function setCookie(cname, cvalue, exdays) 
{
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) 
    {
        var c = ca[i];
        while (c.charAt(0)==' ') 
            c = c.substring(1);
        
        if (c.indexOf(name) == 0) 
            return c.substring(name.length,c.length);
    }

    return "";
}

function setUnlocks()
{
    for (var i = 0; i < setNames.length; i++)
    {
        if (i == 0)
        {
            unlockSets[i] = true;
        }
        else
        {
            var userpwd = getCookie("pass" + i);
            unlockSets[i] = checkSetPassword(i, userpwd);
        }
    }
}

function checkSetPassword(n, userpwd)
{
    var encpwd = "";
    switch(n)
    {
        case 1:
            encpwd = "em9tYmll";
            break;
    }

    return userpwd == encpwd;
}

function promptSetPassword(n)
{
    var s = "Enter code to unlock " + setNames[n];
    var p = window.btoa(prompt(s, ""));
    saveCookie("pass" + n, p);
    // if (checkSetPassword(n, p))
    // {
        unlockSets[n] = true;
        redisplaySettings();
    // }
    // else
    // {
        // alert("Invalid Code");
    // }
}

function redisplaySettings()
{
    d = document.getElementById("settingsDiv");
    d.innerHTML = getSettingsHTML();
}

function getCodeForAspects(a)
{
    var code = "";
    
    for (var i = 0; i < a.length; i++)
    {
        code += aspects[a[i]].uniqueId;
    }

    return code;
}

function clearInsets()
{
    clearHelp();
        
    clearLink();
        
    if (typeof clearOptions == "function")
        clearOptions();                

    hideAspectCard();
}

function clearDiv(s)
{
    var d = document.getElementById(s);
    if (d !== undefined && d !== null)
    {
        d.style.visibility = "hidden";
        d.innerHTML = "";
    }
}