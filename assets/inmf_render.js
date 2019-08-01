function getAspectGridHTML()
{
    var s = "<div class='aspectDiv'>";
//    s += "<table class='aspecttable'>";

    var max = aspects.length;
    
    var i = 0;
    var r = 0;
    
    while (i < max)
    {
            s += getAspectCell(i);
            i++;
    }

    s += "<div class='buttontd'><button onClick='generate()'>Continue</button></div>";

    s += "</div>";
    return s;
}

function getAspectCell(n)
{
    var max = aspects.length;

    var s = "";

    if (n < max)
    {
        s += "<div class='aspectCell'><table><tr>";
        s += "<td id='aspectSelectTD" + n + "' class='smallcontrol'>" + getSelect(n) + "</td>";
        s += "<td class='aspecticontd'><img class='aspecticon' src='" + setIcons[aspects[n].setId] + "'></td>";
        s += "<td class='aspectnametd' onMouseOver='showAspectCard(" + n + ", event)' onMouseOut='hideAspectCard()'>" + aspects[n].aspectName + "</td>";
        s += "<td class='approachtd'>" + getApproaches(n) + "</td>";
        s += "</tr></table></div>";
    }
    
    return s;
}

function getApproaches(n)
{
    var s = "";
    var a = 0;
    var approaches = aspects[n].approaches;
    
    for (var i = 0; i < approaches.length; i++)
    {
        if (approaches[i] == 1)
        {
            s += "<div class='approach" + i + "'>" + approachNames[i] + "</div>";
            a++;
        }
    }
    
    return s;
}

function getSelect(n)
{
    var s = "<select onChange='rebuildAspectSelect()' id='aspectSelect" + n + "'>";
    s += "<option selected value='0'></option>";
            
    for (var i = 1; i <= characterCount; i++)
    {
        s += "<option value='" + i + "'>" + i + "</option>";
    }
    s += "</select>";
    
    return s;
}

function getCharacterCountSelect(n)
{
    var c = "";
    var s = "<select id='countSelect'>";
    for (var i = 1; i <= characterMax; i++)
    {
        if (i == characterCount)
            c = " selected";
        else
            c = "";
                        
        s += "<option value='" + i + "'" + c + ">" + i + "</option>";
    }
    s += "</select>";
    
    return s;
}

function getAspectCountSelect(n)
{
    var c = "";
    var s = "<select id='aspectCountSelect'>";
    for (var i = 1; i <= 3; i++)
    {
        if (i == aspectCount)
            c = " selected";
        else
            c = "";
                        
        s += "<option value='" + i + "'" + c + ">" + i + "</option>";
    }
    s += "</select>";
    
    return s;
}

function getHeaderHTML()
{
    return "<a href='index.html'><img alt=\"It's Not My Fault\" title=\"It's Not My Fault\" src='https://www.evilhat.com/inmf/images/title.png'></a>";
}

function getFooterHTML()
{
    return "<table><tr><td class='footerText'>It's Not My Fault and related products " + getCopyright() + "2016 Evil Hat Productions. Used here with their express permission.</td><td class='footerImg'><a href='http://www.evilhat.com' target='_blank'><img alt='Evil Hat Productions' title='Evil Hat Productions' src='https://www.evilhat.com/inmf/images/evilhat.png'></a></td></tr></table>";
}

function getSettingsHTML()
{
    var s = "<div>"
    s += "<table>";
    s += "<tr><td class='smallcontrol'>" + getCharacterCountSelect() + "</td><td>Number of Characters</td></tr>";
    s += "<tr class='headingtr'><td></td><td>Sets In Play</td></tr>";
    for (var i = 0; i < setNames.length; i++)
    {
        if (i == 0)
            s += "<tr><td class='smallcontrol'><input type='checkbox' id='setInPlay" + i + "' checked></td><td>" + setNames[i] + "</td></tr>";
        else 
        {
            if (unlockSets[i])
            {
                s += "<tr><td class='smallcontrol'><input type='checkbox' id='setInPlay" + i + "'></td><td>" + setNames[i] + "</td></tr>";
            }
            else
            {           
                s += "<tr><td class='smallcontrol'><img class='settingslock' src='https://www.evilhat.com/inmf/images/lock.png' onClick='promptSetPassword(" + i + ")'></td><td>" + setNames[i] + "</td></td></tr>";
            }                
        }
    }
    s += "<tr><td colspan=2 class='buttontd'><button onClick='saveSettings()'>Continue</button></td></tr>";
    s += "</table>";
    s += "</div>";
    return s;
}

function getSettings2HTML()
{
    var s = "<div>"
    s += "<table>";
    for (var i = 1; i <= characterCount; i++)
    {
        var human = "<td></td><td></td>";
        if (isSetInPlay(0) && isSetInPlay(1))
        {
            human = "<td class='smallcontrol2'><input type='checkbox' id='isHuman" + i + "'></td><td class='smalllabel'>Human?</td>";
        }
        s += "<tr><td class='playerTextTD'><input class='playerText' type='text' id='playerName" + i + "' value='Player " + i + "'></td><td class='playerTextLabel'>Player " + i + " Name</td>" + human + "</tr>";
    }
    s += "<tr><td class='smallcontrol'>" + getAspectCountSelect() + "</td><td>Aspects Chosen</td><td></td><td></td></tr>";
    s += "<tr><td class='smallcontrol'><input type='checkbox' id='mustChoose'></td><td>Must Choose?</td><td></td><td></td></tr>";
    if (isSetInPlay(0) && isSetInPlay(1))
    {
        s += "<tr><td class='smallcontrol'><input type='checkbox' id='limitFantastic'></td><td class='playerTextLabel'>Limit of 1 <img class='settingsicon' src='" + setIcons[1] + "'>" + "?</td><td></td><td></td></tr>";
    }
    s += "<tr><td colspan=4 class='buttontd'><button onClick='saveSettings2()'>Continue</button></td></tr>";
    s += "</table>";
    s += "</div>";
    return s;
}

function getCharacterHTML()
{
    var s = "<div>";
    var c;

    for (var i = 1; i <= characterCount; i++)
    {
        s += "<div class='charactercard'>";
        s += "<table>";
        c = characters[i];
        s += "<tr><td colspan=2 class='charactercardplayer'>" + getPlayerNameHTML(i) + "</td></tr>";
        s += "<tr><td colspan=2 class='charactercardaspects'>";
        s += "<span onClick='redraw(0," + i + ",0)'>" + aspects[c[0]].aspectName + "</span>";
        s += getBullet();
        s += "<span onClick='redraw(0," + i + ",1)'>" + aspects[c[1]].aspectName + "</span>";
        s += getBullet();
        s += "<span onClick='redraw(0," + i + ",2)'>" + aspects[c[2]].aspectName + "</span>";
        s += "</td></tr>";

        s += "<tr>";
        s += "<td class='charactercarddiceouter'><table>";

        for (var j = 0; j < approachNames.length; j++)
        {
            var diceImage = "";
            var approachClass = "approachgrey";
            var x = 0;
            for (var k = 0; k < c.length; k++)
            {
                x += aspects[c[k]].approaches[j];
            }


            if (x > 0)
            {   
                for (var m = 0; m < x; m++)
                {
                    diceImage += "<img class='charactercarddice' src='" + diceIcons[j][1] + "'>";
                }                    
                approachClass = "approach" + j;
            }
            s += "<tr><td class='charactercarddicetd'>" + diceImage + "</td><td class='charactercardapproach " + approachClass + "'>" + approachNames[j] + "</td></tr>";
        }
        
        s += "</table></td>";

        s += "<td class='charactercardstunts'>";
        for (var k = 0; k < c.length; k++)
        {
            s += "<div class='charactercardstuntname'>" + aspects[c[k]].stuntName + "</div><div class='charactercardstuntdescription'>" + aspects[c[k]].stuntDescription + "</div>";
        }
        s +="</td></tr>";
        s += "</table>";
        s += "</div>";
    }        

    s += "</div>";
    return s;
}

function getSituationHTML()
{
    var s = "<div class='situation'>";
 
    for (var i = 0; i < aWhere.length; i++)
    {
        s += "<div onClick='redraw(1,0," + i + ")' class='situationcard'><div class='situationtitle tWhere'>Где вы сейчас?</div><div class='situationtext'>" + aWhere[i].cardText + "</div></div>";
    }
    for (var i = 0; i < aWhat.length; i++)
    {
        s += "<div onClick='redraw(1,1," + i + ")' class='situationcard'><div class='situationtitle tWhat'>Как вы здесь оказались?</div><div class='situationtext'>" + aWhat[i].cardText + "</div></div>";
    }
    for (var i = 0; i < aHow.length; i++)
    {
        s += "<div onClick='redraw(1,2," + i + ")' class='situationcard'><div class='situationtitle tHow'>Куда уж хуже?</div><div class='situationtext'>" + aHow[i].cardText + "</div></div>";
    }

    s += "</div>";
    return s;
}

function getAspectCardHTML(n)
{
    var a = aspects[n];
    var s = "<div class='aspectcard' onClick='hideAspectCard()'>";
    s += "<table>";
    s += "<tr><td class='aspectcardicontd'><img class='aspectcardicon' src='" + setIcons[a.setId] + "'></td><td colspan=2 class='aspectcardname'>" + a.aspectName + "</td></tr>";
    
    s += "<tr>";

    s += "<td><table>";
    for (var i = 0; i < a.approaches.length; i++)
    {
        var diceImage = "";
        var approachClass = "approachgrey";
        if (a.approaches[i] == 1)
        {
            diceImage = "<img class='aspectcarddice' src='" + diceIcons[i][1] + "'>";
            approachClass = "approach" + i;
        }
        s += "<tr><td>" + diceImage + "</td><td class='aspectcardapproach " + approachClass + "'>" + approachNames[i] + "</td></tr>";
    }
    s += "</table></td>";

    s += "<td class='aspectcardstunt'><div class='aspectcardquote'>" + a.quote+ "</div>";
    s += "<div class='aspectcardstuntname'>" + a.stuntName + "</div>";
    s += "<div class='aspectcardstuntdescription'>" + a.stuntDescription + "</div></td>";

    s += "</tr>";
    
    s += "</table>";
    s += "</div>";

    return s;
}

function rebuildAspectSelect()
{
    var currentAspects = new Array();
    var characterAspectCount = new Array();
    var characterFantasticCount = new Array();

    for (var c = 1; c <= characterCount; c++)
    {
        characterAspectCount[c] = 0;
        characterFantasticCount[c] = 0;
    }

    for (var i = 0; i < aspects.length; i++)
    {
        var e = document.getElementById("aspectSelect" + i);
        var v = e.options[e.selectedIndex].value;
        
        currentAspects[i] = v;
        if (v > 0)
        {
            characterAspectCount[v]++;
            if (aspects[i].setId == 1)
                characterFantasticCount[v]++;
        }
    }

    for (var i = 0; i < aspects.length; i++)
    {
        var selected = currentAspects[i] == 0 ? "selected" : "";
        
        var s = "<select onChange='rebuildAspectSelect()' id='aspectSelect" + i + "'>";
        s += "<option " + selected + " value='0'></option>";
            
        for (var c = 1; c <= characterCount; c++)
        {
            var inc = true;
            if (currentAspects[i] == c)
            {
                selected = "selected";
            }
            else
            {
                selected = "";
                if (characterAspectCount[c] >= aspectCount)
                {
                    inc = false;
                }
                    
                if (characterFantasticCount[c] >= 1 && aspects[i].setId == 1 && limitFantastic) 
                {
                    inc = false;
                }
            }
            
            if (inc)
            {
                s += "<option " + selected + " value='" + c + "'>" + c + "</option>";
            }
        }
        s += "</select>";
    
        var d = document.getElementById("aspectSelectTD" + i);
        d.innerHTML = s;
    }
}

function getRedrawHTML()
{
    var src = "https://www.evilhat.com/inmf/images/icon_redraw0.png";
    if (redrawMode)
        src = "https://www.evilhat.com/inmf/images/icon_redraw1.png";
        
    var s = "<img alt='Redraw Cards' title='Redraw Cards' id='redrawIcon' src='" + src + "' onClick='toggleDiscard()'>";
    return s;
}

function showHelpIcon()
{
    var d = document.getElementById("helpIconDiv");
    d.innerHTML = getHelpIconHTML();
}

function getHelpIconHTML()
{
    var src = "https://www.evilhat.com/inmf/images/icon_help.png";
    var s = "<img alt='Help' title='Help' id='helpIcon' src='" + src + "' onClick='toggleHelp()'>";
    return s;
}

function showLinkIcon()
{
    var d = document.getElementById("linkIconDiv");
    d.innerHTML = getLinkIconHTML();
}

function getLinkIconHTML()
{
    var src = "https://www.evilhat.com/inmf/images/icon_link.png";
    var s = "<img alt='Links' title='Links' id='linkIcon' src='" + src + "' onClick='toggleLink()'>";
    return s;
}

function showPlayIcon()
{
    var d = document.getElementById("playIconDiv");
    d.innerHTML = getPlayIconHTML();
}

function getPlayIconHTML()
{
    var src = "https://www.evilhat.com/inmf/images/icon_play.png";
    var s = "<a href='" + getPlayURL() + "'><img alt='Interactive Play Screen' title='Interactive Play Screen' id='playIcon' src='" + src + "'></a>";
    return s;
}

function getHelpHTML()
{
    var s = populateHelpPage(phase);
    return s;
}

function getLinkHTML()
{
    var s = populateLinkPage();
    return s;
}

function getPlayerNameHTML(n)
{
    var s = "<div class='playerName'>" + playerNames[n] + "</div><div class='characterLink'><img alt='Character Link' title='Character Link' src='https://www.evilhat.com/inmf/images/hyperlink.png' onClick='showCharLink(" + n + ")'></div>";
    return s;
}

function getBullet()
{
    var s = " <span class='bullet'>&bull;</span> ";
    return s;
}

function getCopyright()
{
    var s = " <span class='bullet'>&copy;</span> ";
    return s;
}

