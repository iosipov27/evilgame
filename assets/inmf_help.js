function formatHelpPage(tHeading, aText)
{
    var s = "<h1>" + tHeading + "</h1>";
    for (var i = 0; i < aText.length; i++)
    {
        s += "<h2>" + aText[i][0] + "</h2>";
        s += "<p>" + aText[i][1] + "</p>";
    }
    
    return s;
}

function populateHelpPage(hPhase)
{
    var tHeading;
    var aText = new Array();
    var s01 = isSetInPlay(0) && isSetInPlay(1);

    var s = "<div class='helpInnerDiv' onClick='toggleHelp()'>";
    
    switch (hPhase)
    {
        case 0:
            tHeading = "Main Settings";
            aText.push(["Number of Players", "Select how many characters to generate."]);
            aText.push(["Sets In Play", "Choose which decks are included to generate Aspects and Situations."]);
            aText.push(["Locked Set", "The base <em>It's Not My Fault</em> set is available to everyone. Expansion sets require a code acquired with the purchase of the PDF or physical deck. The <b>Links</b> button at top right provides links to the product range at DriveThruRPG."]);
            aText.push(["Play", "The <b>Play</b> button at top left links to the interactive Play Screen."]);
            s += formatHelpPage(tHeading, aText);
            break;
        case 1:
            tHeading = "Additional Settings";
            aText.push(["Player Name", "Allocate a player to each character. (This is not the character name, which is likely dependent on the cards drawn.)"]);
            if (s01)
            {
                aText.push(["Human?", "If this is checked, <img class='settingsicon' src='" + setIcons[1] + "'> Aspects will not be randomly selected for this character."]);
            }
            aText.push(["Aspects Chosen", "Maximum number of Aspects a player can pre-select for a character."]);
            aText.push(["Must Choose?", "If this is checked, a player cannot choose fewer than the nominated number of Aspects. If unchecked, the player can allow random selection of some or all Aspects."]);
            if (s01)
            {
                aText.push(["Limit of 1 <img class='settingsicon' src='" + setIcons[1] + "'>?", "If this is checked, a player may not pre-select more than one Fantastic Aspect. (Hybrid characters can still result from random draws."]);
            }
            s += formatHelpPage(tHeading, aText);
            break;
        case 2:
            tHeading = "Aspect Pre-Selection";
            aText.push(["Drop-Downs", "If a player wishes to pre-select an Aspect, choose their player number from the drop-down list. If their number does not appear, they have already met their limit for Aspects" + (s01 ? " (or Fantastic Aspects)." : ".")]);
            aText.push(["Aspect Cards", "Hovering over the Aspect name will reveal more detail about the Aspect in an inset window."]);
            s += formatHelpPage(tHeading, aText);
            break;
        case 3:
            tHeading = "Results";
            aText.push(["Characters", "Approach totals and stunts for the combination of three Aspects are displayed for each player."]);
            aText.push(["Situation", "The randomly-selected Where, What, and How cards are displayed."]);
            aText.push(["Redraw?", "When the <b>Redraw</b> button in the top menu is red, results are locked. Clicking to turn it green will permit redrawing of individual Aspect or Situation cards: clicking an Aspect name or Situation card will replace that card with a fresh draw."]);
            aText.push(["Play Link", "The top right of each character card has a <b>Link</b> icon which will display a code. A player can input this code on the <a target='_blank' href='" + getPlayURL() + "'>Play Screen</a> for an interactive view of their character."]);
            s += formatHelpPage(tHeading, aText);
            break;
        case 4:
            tHeading = "Play Screen";
            aText.push(["Character Name", "Clicking the <b>Edit</b> icon allows you to alter the character's name."]);
            aText.push(["Rolling Fate Dice", "Clicking the <b>Roll</b> button will roll 4dF. Clicking an Approach will automatically add the Approach bonus to a roll."]);
            aText.push(["Stress", "Clicking a Stress box will toggle it from filled to unfilled."]);
            aText.push(["Fate Points", "Fate Point total can be adjusted with the <b>+</b> and <b>-</b> buttons."]);
            aText.push(["Consequences", "Clicking the Consequence name allows it to be edited or cleared. The Bullseye checkbox records if opponents have used a Free Invoke on this Consequence already; the Heart checkbox records whether treatment of this Consequence has begun."]);
            aText.push(["Character Management", "The Options icon at top left shows a list of stored characters. Up to 15 characters can be stored.<BR>Clicking on a character will select it. <b>Load</b> will load the selected PC into the Play Screen. <b>Export</b> will provide a link to transfer the selected character to another device. <b>Delete</b> removes a PC from storage. <b>New PC</b> will prompt for a 6-character code."]);
            s += formatHelpPage(tHeading, aText);
            break;
        case 5:
            tHeading = "Character Code?";
            aText.push(["What's that?", "When your GM generates a scenario, they will obtain a six-letter code for each PC. When they provide you your code, either refresh this page or press the <b>Character Maintenance</b> button and select <b>New PC</b>, then enter your code at the prompt."]);
            s += formatHelpPage(tHeading, aText);
            break;
    }

    s += "</div>";
    
    return s;
}

function toggleHelp()
{
    var d = document.getElementById("helpDiv");

    var tShow = showHelp;
    clearInsets();
    showHelp = !tShow;

    if (showHelp)
    {
        d.innerHTML = getHelpHTML();
        d.style.visibility = "visible";
    }
    else
    {
        clearHelp();
    }
}

function clearHelp()
{
    showHelp = false;
    clearDiv("helpDiv");
}

function showNoCharHelp()
{
    var oldPhase = phase;
    showHelp = false;
    phase = 5;
    toggleHelp();
    phase = oldPhase;
}

function toggleLink()
{
    var d = document.getElementById("linkDiv");

    var tShow = showLink;
    clearInsets();
    showLink = !tShow;
    if (showLink)
    {
        d.innerHTML = getLinkHTML();
        d.style.visibility = "visible";
    }
    else
    {
        clearLink();
    }
}

function clearLink()
{
    showLink = false;
    clearDiv("linkDiv");
}

function populateLinkPage()
{
    var affiliateLink = getAffiliateLink();
    var s = "<div class='linkInnerDiv'>";
    var tHeading = "Links";
    var aText = [];
    s += formatHelpPage(tHeading, aText);
    s += "<div class='linkImgOuter'>";
    s += "<div class='linkImgDiv'><a href='http://www.evilhat.com' target='_blank'><img alt='Evil Hat Productions' title='Evil Hat Productions' src='https://www.evilhat.com/inmf/images/evilhat.png'></a></div>";
    s += "<div class='linkImgDiv'><img src='https://www.evilhat.com/inmf/images/dtrpg.png'></div>";
    s += "</div>";
    s += "<div class='linkImgOuter2'>";
    s += "<p>Find the <em>It's Not My Fault</em> range at DriveThruRPG.</p>";
    s += "<div class='linkImgDiv2'><a href='http://www.drivethrurpg.com/product/162084/Its-Not-My-Fault-A-Fate-Accelerated-Character--Situation-Generator" + affiliateLink + "' target='_blank'><img alt=\"It's Not My Fault\" title=\"It's Not My Fault\" src='https://www.evilhat.com/inmf/images/link_inmf.jpg'></a></div>";
    s += "<div class='linkImgDiv2'><a href='http://www.drivethrurpg.com/product/171228/Its-Not-My-Fault-Im-Fantastic" + affiliateLink + "' target='_blank'><img alt=\"It's Not My Fault I'm Fantastic\" title=\"It's Not My Fault I'm Fantastic\" src='https://www.evilhat.com/inmf/images/link_inmfif.jpg'></a></div>";
    s += "<div class='linkImgDiv2'><a href='http://www.drivethrurpg.com/product/165807/Its-Not-My-Fault-Reference--Character-Record-Cards" + affiliateLink + "' target='_blank'><img alt='Reference and Character Record Cards' title='Reference and Character Record Cards' src='https://www.evilhat.com/inmf/images/link_recs.jpg'></a></div>";
    s += "</div>";
    s += "<p class='attrib'><em>It's Not My Fault</em> adapted for web by Matthew 'Hypersmurf' Breen.</p>";
    s += "</div>";
    return s;
}

function getAffiliateLink()
{
    var s = "";
    if (affiliateID.length > 0)
        s = "?affiliate_id=" + affiliateID;
        
    return s;        
}