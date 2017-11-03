window.onload = function (e) {
    //sjekker om local storage er tilgjengelig i nettleseren
    if (window.localStorage !== 'undefined') {
        document.body.style.backgroundColor = '#E9F1F9';
		document.getElementById("forsidemenyer").style.display = 'none';
        document.getElementById("forside-header").style.display = 'none';
		document.getElementById("sidemeny").style.display = 'none';
		//hvis øvingsobjektene ikke er lagret i local storage vil det si at det er første gang brukeren besøker siden (hvis ikke lagringen er deaktivert...)
        //og funksjoner for å lagre innhold, skjule/vise første gang osv. kjøres
        if (localStorage.getItem('ovinger') === null) {
			forstegang();
            lagplanliste();
            lagovingliste();
            lagevalliste();
            var lydklipp = document.getElementById("lydklipp1");
            lydklipp.addEventListener("timeupdate", fremdriftLyd, false);
            lydklipp.addEventListener("ended", klippSlutt, false);
            antalldager();
            lagtimeliste("plan-time", 'n');
            lagminuttliste("plan-minutt", 'n');
            lagtimeliste("plan-time-oving", 'n');
            setTimeout(lagminuttliste("plan-minutt-oving", 'n'), 100);
            setTimeout(lagaarliste("plan-aar", 0), 200);
            setTimeout(lagmndliste("plan-mnd", "plan-aar", 0), 500);
            setTimeout(lagdagliste("plan-dag", "plan-mnd", "plan-aar", 0), 600);
			opphavsrettdato();
            $.mobile.changePage("#introside");
            /*$('div[data-role="page"]').bind('pageshow', function () {
                document.title = "Oppmerksomhetstrening"
            });*/
        } else {
            //hvis øvingsobjektet finnes, hentes innhold i local storage og funksjoner for å oppdatere innstillinger, lister osv. kjøres
            //localStorage.clear();
			document.getElementById("vennligstvent").innerHTML = '';
			document.getElementById("forsidemenyer").style.display = 'block';
			document.getElementById("forside-header").style.display = 'block';
			document.getElementById("sidemeny").style.display = 'block';
            /*$('div[data-role="page"]').bind('pageshow', function () {
                document.title = "Oppmerksomhetstrening"
            });*/
            var ovingsinstillinger = JSON.parse(localStorage.getItem('ovingsinstillinger'));
            var neste = JSON.parse(localStorage.getItem('neste'));
            var forste = JSON.parse(localStorage.getItem('forste'));

            setverdi("velgsammetid", ovingsinstillinger);
            if (parseInt(ovingsinstillinger) === 0) {
                document.getElementById("plan-sammetid").style.display = 'block';
            } else {
                document.getElementById("plan-sammetid").style.display = 'none';
            }
			setforste();
            var lydklipp = document.getElementById("lydklipp1");
            lydklipp.addEventListener("timeupdate", fremdriftLyd, false);
            lydklipp.addEventListener("ended", klippSlutt, false);

            var lyd = JSON.parse(localStorage.getItem('lydklipp'));
            var lydid="lydvalg" + lyd
			if (parseInt(lyd) === 1) {
                document.getElementById("ovingvalg1").style.display = 'block';
                document.getElementById("ovingvalg0").style.display = 'none';
				document.getElementById(lydid).checked=true;
            } else {
                document.getElementById("ovingvalg0").style.display = 'block';
                document.getElementById("ovingvalg1").style.display = 'none';
				document.getElementById(lydid).checked=true;
            }
			var bruk = JSON.parse(localStorage.getItem('aapnet'));
			var antbruk = +bruk + 1;
			localStorage.setItem('aapnet', JSON.stringify(antbruk));
            statustimer();
            lagplanliste();
            lagovingliste();
            lagevalliste();
            tabreset();
            antalldager();
			graf();
            lagtimeliste("plan-time", 'n');
            lagminuttliste("plan-minutt", 'n');
            lagtimeliste("plan-time-oving", 'n');
            setTimeout(lagminuttliste("plan-minutt-oving", 'n'), 100);
            setTimeout(lagaarliste("plan-aar", 0), 200);
            setTimeout(lagmndliste("plan-mnd", "plan-aar", 0), 500);
            setTimeout(lagdagliste("plan-dag", "plan-mnd", "plan-aar", 0), 900);
            opphavsrettdato();
            nesteoving(neste);
            //sendtilphp();
            if (+forste === 1) {
                $.mobile.changePage("#introside");
            } 
            console.log(forste);
            window.applicationCache.addEventListener('updateready', onUpdateReady);
            if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
                onUpdateReady();
            }
			localStorage.setItem('tilgjknapp',JSON.stringify(0));
			localStorage.setItem('ikketilgjknapp',JSON.stringify(0));
        }

    } else {
        alert("eMeisting Oppmerksomhetstrening vil ikke virke i denne nettleseren. Oppgrader nettleseren eller bruk en annen nettleser");
    }
};

//******************************************************************************************	
//*********************************** Førstegangs visning av forside ***********************
//******************************************************************************************
//hvis sosapp.appcache er endret siden sist gang brukeren åpnet appen,vises en meldingsboks om at en oppdatert versjon av appen er tilgjengelig.
function onUpdateReady() {
    alert("eMeistring Oppmerksomhetstrening vil oppdateres neste gang du laster om siden");

}

//registrerer at brukeren er ferdig med førstegangs-introduksjonen	
function setforste() {
    var forste = 0;
	document.getElementById("forsidemenyer").style.display = 'block';
	document.getElementById("forside-header").style.display = 'block';
	document.getElementById("sidemeny").style.display = 'block';
	document.getElementById("vennligstvent").innerHTML ="";
    localStorage.setItem('forste', JSON.stringify(forste));
	statustimer();
}

//det som skal lagres i local storage blir opprettet første gang brukeren starter appen
function forstegang() {
    "use strict";
    var forste = 1;
    var antall = 0;
    var ovingsinstillinger = 0;
    document.getElementById("plan-sammetid").style.display = 'block';
    var idag = new Date();
    var startdato = idag.toLocaleDateString();
    var time = idag.getHours();
    var minutter = idag.getMinutes();
    var neste = 0;
    var lydklipp = 0;
    var uid = unikid();
    var aapnetapp = 0;
	var tilgjknapp=0;
	var ikketilgjknapp=0;
    var ovinger = [];
    for (var i = 0; i < 7; i++) {
        var nydato = DateAdd(idag, "d", i);
        var dagen = nydato.getDate();
        var maaned = nydato.getMonth();
        var aaret = nydato.getFullYear();

        ovinger[i] = {
            dag: i + 1,
            dato: nydato,
            datodag: dagen,
            datomnd: maaned,
            datoaar: aaret,
            datotime: time,
            datominutter: minutter,
            tid: time + ":" + minutter,
            sted: " ",
            planlagt: 1,
            utfort: 0,
            evalfor: 0,
            evaletter: 0,
            aktivert: 0,
        };
    }
    localStorage.setItem('forste', JSON.stringify(forste));
    localStorage.setItem('antall', JSON.stringify(antall));
    localStorage.setItem('ovingsinstillinger', JSON.stringify(ovingsinstillinger));
    localStorage.setItem('startdato', JSON.stringify(startdato));
	localStorage.setItem('startforbruk', JSON.stringify(startdato));
    localStorage.setItem('neste', JSON.stringify(neste));
    localStorage.setItem('lydklipp', JSON.stringify(lydklipp));
    localStorage.setItem('ovinger', JSON.stringify(ovinger));
    localStorage.setItem('unikid', JSON.stringify(uid));
    localStorage.setItem('aapnet', JSON.stringify(aapnetapp));
	localStorage.setItem('tilgjknapp',JSON.stringify(tilgjknapp));
	localStorage.setItem('ikketilgjknapp',JSON.stringify(ikketilgjknapp));
}

//*******************************************************************************************	
//******************************** Innsamling av brukerdata *********************************
//*******************************************************************************************
//lager en 'unik' id for brukeren, basert på tidspunktet når appen blir brukt første gang
function unikid() {
    var c = 1;
    var d = new Date();
    var m = d.getMilliseconds() + "";
    var unid = ++d + m + (++c === 10000 ? (c = 1) : c);

    return unid;
}

//henter data fra local storage og sender til php-script som lagrer dette i JSON format i en tekst-fil
function sendtilphp() {
    if (navigator.onLine) {
        var uid = JSON.parse(localStorage.getItem('unikid'));
        var antall = JSON.parse(localStorage.getItem('antall'));
		var startdato = JSON.parse(localStorage.getItem('startdato'));
        var startbruk = JSON.parse(localStorage.getItem('startforbruk'));
        var antbruk = JSON.parse(localStorage.getItem('aapnet'));
        var dag = new Date();
        var idag = dag.toLocaleDateString();
        var ovinger = JSON.parse(localStorage.getItem('ovinger'));
        var ovingutf0 = ovinger[0].utfort;
        var evalfor0 = ovinger[0].evalfor;
        var evaletter0 = ovinger[0].evaletter;
        var ovingutf1 = ovinger[1].utfort;
        var evalfor1 = ovinger[1].evalfor;
        var evaletter1 = ovinger[1].evaletter;
        var ovingutf2 = ovinger[2].utfort;
        var evalfor2 = ovinger[2].evalfor;
        var evaletter2 = ovinger[2].evaletter;
        var ovingutf3 = ovinger[3].utfort;
        var evalfor3 = ovinger[3].evalfor;
        var evaletter3 = ovinger[3].evaletter;
        var ovingutf4 = ovinger[4].utfort;
        var evalfor4 = ovinger[4].evalfor;
        var evaletter4 = ovinger[4].evaletter;
        var ovingutf5 = ovinger[5].utfort;
        var evalfor5 = ovinger[5].evalfor;
        var evaletter5 = ovinger[5].evaletter;
        var ovingutf6 = ovinger[6].utfort;
        var evalfor6 = ovinger[6].evalfor;
        var evaletter6 = ovinger[6].evaletter;

        $.post('php/regbrukerstat.php', {
            uid: uid,
            antall: antall,
            startdato: startdato,
			startbruk: startbruk,
            idag: idag,
            antbruk: antbruk,
            ovingutf0: ovingutf0,
            evalfor0: evalfor0,
            evaletter0: evaletter0,
            ovingutf1: ovingutf1,
            evalfor1: evalfor1,
            evaletter1: evaletter1,
            ovingutf2: ovingutf2,
            evalfor2: evalfor2,
            evaletter2: evaletter2,
            ovingutf3: ovingutf3,
            evalfor3: evalfor3,
            evaletter3: evaletter3,
            ovingutf4: ovingutf4,
            evalfor4: evalfor4,
            evaletter4: evaletter4,
            ovingutf5: ovingutf5,
            evalfor5: evalfor5,
            evaletter5: evaletter5,
            ovingutf6: ovingutf6,
            evalfor6: evalfor6,
            evaletter6: evaletter6
        });
    }
}
//*******************************************************************************************
//********************************Skjemavalidering*******************************************
//*******************************************************************************************

function validerskjema(){
	var navn = document.getElementById("avsendernavn").value;
	var mld = document.getElementById("avsendermelding").value;
	var epost = document.getElementById("avsenderepost").value;
	var atpos = epost.indexOf("@");
	var dotpos = epost.lastIndexOf(".");

	//sjekker om epost inneholder @ og .
	if (atpos< 1 || dotpos<atpos+2 || dotpos+2>=epost.length) {
		document.getElementById("skjemamelding").innerHTML ="Vennligst skriv inn en gyldig epostadresse.";
		return false;
		}
	else if (navn == "") {
       document.getElementById("skjemamelding").innerHTML ="Vennligst skriv inn navnet ditt.";
        return false;
    }
	else if (mld == "") {
       document.getElementById("skjemamelding").innerHTML ="Vennligst skriv inn en melding.";
        return false;
    }
	else {
		document.getElementById("skjemamelding").innerHTML ="Meldingen din er sendt til eMeistring. Du vil få svar til epostadressen som du oppga.";
	}
}

//*******************************************************************************************	
//******************************** Introduksjonsanimasjon ***********************************
//*******************************************************************************************
//variabler som brukes av introduksjonen
var intropause = 0;
var introfremdrift = 0;
var introbilde=0;
var introtimeout="";

function startintro() {
    document.getElementById("intro0").style.display = 'none';
	document.getElementById("introspillav").innerHTML="<button id='spillavintro' onClick='pauseintro()' class='ui-btn ui-btn-a ui-mini'><i class='fa fa-pause'></i></button>";
	introbilde=1;
	introvent();
}

function stopintro(){
	clearTimeout(introtimeout);
    for (var i = 0; i < 20; i++) {
        if (i===0) {
           document.getElementById("intro0").style.display = 'block';
        }
		else{
			document.getElementById("intro" + i).style.display = 'none';
		}
    }
	intropause = 0;
	introfremdrift = 0;
	introbilde=0;
	introtimeout=""
	document.getElementById("introspillav").innerHTML="<button id='spillavintro' onClick='pauseintro()' class='ui-btn ui-btn-a ui-mini'><i class='fa fa-pause'></i></button>";
}

function introvent() {
    if (introbilde > 19 && +intropause === 0) {
        document.getElementById("intro0").style.display = 'block';
        $("#intro0").fadeIn();
        $("#intro19").fadeOut();
        document.getElementById("intro19").style.display = 'none';
        document.getElementById("intro-fremdrift").value = "0";
		introTekst();
    } else if (+intropause === 0) {
        document.getElementById("intro" + introbilde).style.display = 'block';
        $("#intro" + introbilde).fadeIn();
        $("#intro" + (introbilde - 1)).fadeOut();
        document.getElementById("intro" + (introbilde - 1)).style.display = 'none';
        introtimeout=setTimeout(function () {
			introbilde=+introbilde + 1
            fortsettintro(introbilde);
			introTekst();
        }, 10000);
    }
}

function fortsettintro() {
    for (var i = introbilde; i < 20; i++) {
        introfremdrift = ((i - 1) / 19) * 100;
        document.getElementById("intro-fremdrift").value = introfremdrift;
        introvent();
        break;
    }
}

function pauseintro() {
	document.getElementById("introspillav").innerHTML="<button id='spillavintro' onClick='introetterpause()' class='ui-btn ui-btn-a ui-mini'><i class='fa fa-play'></i></button>";
	clearTimeout(introtimeout);
	$("#intro-sekvens").append("<img id='intropausebilde' src='images/intro/intro_pause.jpg' onClick='introetterpause()' />");
	for (var i = 0; i < 20; i++) {
		document.getElementById("intro" + i).style.display = 'none';
		document.getElementById("intro-hjelp").innerHTML = "Tykk for å fortsette";
	}
	
    intropause = 1;
}

function introetterpause() {
    $("#intropausebilde").remove();
	document.getElementById("introspillav").innerHTML="<button id='spillavintro' onClick='pauseintro()' class='ui-btn ui-btn-a ui-mini'><i class='fa fa-pause'></i></button>";
    intropause = 0;
	introTekst();
    fortsettintro();
}

function introbakover() {
	document.getElementById("intro" + (introbilde)).style.display = 'none';
	if(introbilde > 0 && introbilde <= 19){
	introbilde=introbilde-1;
	introTekst();
	clearTimeout(introtimeout);
	}
	fortsettintro();
}

function introfremover() {
	document.getElementById("intro" + (introbilde)).style.display = 'none';
	if(introbilde > 0 && introbilde < 19){
		introbilde=introbilde+1;
		introTekst();
		clearTimeout(introtimeout);
	}
	fortsettintro();
}

function introTekst() {
    tekst = "";
	
    if (introbilde === 1) {
        tekst = "eMeistring Oppmerksomhetstrening er en webapp for oppmerksomhets-øving, beregnet på personer med sosial angst som mottar behandling ved eMeistring.";
		document.getElementById("nesteknapp0").style.display='none';
	} else if (introbilde === 2) {
        tekst = "Oppmerksomhetsøvingen varer i ca. 10 minutter og skal utføres en gang per dag i 7 dager.";
    } else if (introbilde === 3) {
        tekst = "Når en person med sosial angst kommer i en sosialt truende situasjon er den automatiske reaksjonen å skifte fokus fra verden rundt til seg selv.";
    } else if (introbilde === 4) {
        tekst = "Ved å ha oppmerksomheten innover mister vi informasjon om hva som faktisk skjer der ute.";
    } else if (introbilde === 5) {
        tekst = "Oppmerksomhetsøvingen hjelper deg med å vende oppmerksomheten utover slik at du kan få denne informasjonen";
    } else if (introbilde === 6) {
        tekst = "Oppmerksomhetsøvingen går ut på at du skal prøve å fokusere oppmerksomheten din på lyder. Lydene kan være fra omgivelsene rundt  deg...";
    } else if (introbilde === 7) {
        tekst = "...eller fra lyd-klippet som følger med denne webappen.";
    } else if (introbilde === 8) {
        tekst = "Øvingene blir automatisk planlagt første gang du bruker appen, og blir tilgjengelig en gang pr. dag i 7 dager f.o.m den dagen du starter. Du kan starte å øve med en gang hvis du vil. ";
		document.getElementById("nesteknapp0").style.display='block';
	} else if (introbilde === 9) {
        tekst = "Hvis du ønsker et annet tidspunkt for øvingene, kan du endre startdato, klokkeslett og evt.sted, på planleggingssiden.";
    } else if (introbilde === 10) {
        tekst = "Du kan også velge om du vil planlegge alle øvingene samlet eller om du vil planlegge hver øving individuelt.";
    } else if (introbilde === 11) {
        tekst = "Når en ny øving blir tilgjengenlig, vil det vises en knapp for å starte øvingen på forsiden.";
    } else if (introbilde === 12 ) {
        tekst = "Øvingen består av 3 deler. I første del evaluerer du oppmerksomheten din før øvingen";
    } else if (introbilde === 13) {
        tekst = "I andre del utfører du øvingen.";
    } else if (introbilde === 14) {
        tekst = "I tredje del evaluerer du oppmerksomheten din etter øvingen";
    } else if (introbilde === 15) {
        tekst = "På fremdriftssiden kan du se hvor mange dager du er ferdig med i 7-dagers programmet";
    } else if (introbilde === 16) {
        tekst = "Du kan også se en graf som viser hvordan oppmerksomheten din endrer seg over tid";
    } else if (introbilde === 17 ) {
        tekst = "Og du kan se dine før/etter evalueringer fra ferdige øvinger";
    } else if (introbilde === 18) {
        tekst = "Hvis du ønsker mer informasjon om øvingen og om hvordan du bruker appen, finner du dette ved å bruke 'Hjelp'-knappen i menyen øverst på sidene.";
    } else if (introbilde === 19) {
        tekst = "Øvingen starter nå";
		ovingnesteknapp(0);
    } 
    document.getElementById("intro-hjelp").innerHTML = tekst;
}

//******************************************************************************************	
//*********************************** Lagre/endre innstillinger ****************************
//******************************************************************************************

//endrer input verdi på et element
function setverdi(elemid, verdi) {
    "use strict";
    var element = document.getElementById(elemid);
    element.value = verdi;
}

//registrerer brukerens valg ang. lydklipp
function lydbryter() {
    "use strict";
	var neste = JSON.parse(localStorage.getItem('neste'));
    var valg = $('input[name="lydvalg"]:checked').val();
    localStorage.setItem('lydklipp', JSON.stringify(valg));
	
    if (parseInt(valg) === 1) {
        document.getElementById("ovingvalg1").style.display = 'block';
        document.getElementById("ovingvalg0").style.display = 'none';
		document.getElementById("valgtlydtekst").innerHTML ="Du har valgt øving med bilde.";
		setTimeout(function(){ $( "#starteoving" ).popup( "open" ); }, 500);
    } else {
        document.getElementById("ovingvalg0").style.display = 'block';
        document.getElementById("ovingvalg1").style.display = 'none';
		document.getElementById("valgtlydtekst").innerHTML ="Du har valgt øving med lyd.";
		setTimeout(function(){ $( "#starteoving" ).popup( "open" ); }, 500);
    }
}

//registrerer brukerens valg ang. planlegging av øvinger
function planbryter() {
    "use strict";
    var valg = document.getElementById("velgsammetid").value;
    var ovingsinstillinger = "";

    if (parseInt(valg) === 0) {
        document.getElementById("plan-sammetid").style.display = 'block';
        ovingsinstillinger = 0;
        localStorage.setItem('ovingsinstillinger', JSON.stringify(ovingsinstillinger));
        lagplanliste();
    } else if (parseInt(valg) === 1) {
        document.getElementById("plan-sammetid").style.display = 'none';
        ovingsinstillinger = 1;
        localStorage.setItem('ovingsinstillinger', JSON.stringify(ovingsinstillinger));
        lagplanliste();
    }
}

//******************************************************************************************	
//*********************************** Dato og tid ******************************************
//******************************************************************************************

//lager automatisk dato for opphavsrett i bunnteksten på siden	
function opphavsrettdato() {
    "use strict";
    var start = 2015;
    var aarnaa = new Date();
    if (start === aarnaa.getFullYear()) {
        aarnaa = aarnaa.getFullYear();
    } else {
        aarnaa = start + '-' + aarnaa.getFullYear();
    }

    for (var i = 0; i < 3; i++) {
        document.getElementById("footerside" + (i + 1)).innerHTML = "<a href='#popup-om-appen' data-transition='pop' style='color:#666666;text-decoration:none;' data-role='none'>" + "<i class='fa fa-copyright' style='font-size:1.3em'></i> <span class='elogo1' style='padding-right:0.1em'>  e</span><span class='elogo2'>Meistring  </span>" + "<span style='font-size:1.3em'>" + aarnaa + " Oppmerksomhetstrening prototype v.0.4</span></a>";
        document.getElementById("footerside" + (i + 1) + "alt").innerHTML = "<a href='#popup-om-appen' data-transition='pop' style='color:#666666;text-decoration:none;' data-role='none'>" + "<i class='fa fa-copyright' style='font-size:1.3em'></i><span class='elogo1' style='padding-right:0.1em'>  e</span><span class='elogo2'>Meistring  </span>" + "<span style='font-size:1.3em'>" + aarnaa + " Oppmerksomhetstrening prototype v.0.4</span></a>";
    }
}

//lager innhold i nedtrekkslisten for år.
function lagaarliste(aarid, autoselect) {
    "use strict";
    var idag = new Date();
    var y = idag.getFullYear();
    var aarliste = "";
    var ovinger = JSON.parse(localStorage.getItem('ovinger'));
    var faar = ovinger[0].datoaar;
    var sela = document.getElementById(aarid);
    for (var i = 0; i < 2; i++) {
        var aar = y + i;
        var sel = "";
        if (aar === faar && +autoselect === 0) {
            sel = "selected='selected'";
        } else {
            sel = "";
        }
        aarliste += "<option value='" + aar + "' " + sel + ">" + aar + "</option>";
    }
    document.getElementById(aarid).innerHTML = aarliste;
}

//lager innhold i nedtrekkslisten for mnd.
function lagmndliste(mndid, aarid, autoselect) {
    "use strict";
    var ovinger = JSON.parse(localStorage.getItem('ovinger'));
    var fmnd = ovinger[0].datomnd;
    var idag = new Date();
    var m = idag.getMonth();
    var y = idag.getFullYear();
    var mndliste = "";
    var sela = document.getElementById(aarid);
    var selaar = sela.options[sela.selectedIndex].value;
    var smnd = document.getElementById(mndid);
    for (var i = 0; i < 12; i++) {
        if (i === fmnd && +autoselect === 0) {
            var sel = "selected='selected'";
        } else if (i === +autoselect && +autoselect > 0) {
            sel = "selected='selected'";
        } else {
            var sel = "";
        }
        var mnd = i;
        mndliste += "<option value='" + mnd + "' " + sel + ">" + talltilmnd(mnd) + "</option>";
    }
    document.getElementById(mndid).innerHTML = mndliste;
}

//lager innhold i nedtrekkslisten for dager.
function lagdagliste(dagid, mndid, aarid, autoselect) {
    "use strict";
    var ovinger = JSON.parse(localStorage.getItem('ovinger'));
    var fdag = (ovinger[0].datodag) - 1;
    var idag = new Date();
    var d = idag.getDate();
    var m = idag.getMonth();
    var y = idag.getFullYear();
    var dagliste = "";
    var sela = document.getElementById(aarid);
    var selaar = sela.options[sela.selectedIndex].value;
    var smnd = document.getElementById(mndid);
    var selm = smnd.options[smnd.selectedIndex].value;
    var selmnd = parseInt(selm);
    var sdg = document.getElementById(dagid);
    var imax = 0;

    if (selmnd === 0 || selmnd === 2 || selmnd === 4 || selmnd === 6 || selmnd === 7 || selmnd === 9 || selmnd === 11) {
        imax = 31;
    } else if (selmnd === 3 || selmnd === 5 || selmnd === 8 || selmnd === 10) {
        imax = 30;
    } else if (selmnd === 1 && ((selaar % 4 === 0) && (selaar % 100 !== 0)) || (selaar % 400 === 0)) {
        imax = 28;
    } else {
        imax = 29;
    }

    for (var i = 0; i < imax; i++) {
        var dag = (i + 1);
        var sel = "";
        if (i === fdag && +autoselect === 0) {
            //startdato-dag er auto valgt
            sel = "selected='selected'";
        } else if (i === +autoselect && +autoselect > 0) {
            sel = "selected='selected'";
        } else {
            sel = "";
        }

        var dagnavn = "";

        if (dag < 10) {
            dagnavn = "0" + dag;
        } else {
            dagnavn = dag;
        }

        dagliste += "<option value='" + dag + "' " + sel + ">" + dagnavn + "</option>";

    }
    document.getElementById(dagid).innerHTML = dagliste;
}

//validering av dato når brukeren trykker på dato-feltene
function sjekkdato(dagid, mndid, aarid) {
    var idag = new Date();
    var d = idag.getDate();
    var m = idag.getMonth();
    var y = idag.getFullYear();
    var sela = document.getElementById(aarid);
    var aar = sela.options[sela.selectedIndex].value;
    var smnd = document.getElementById(mndid);
    var mnd = smnd.options[smnd.selectedIndex].value;
    var sdg = document.getElementById(dagid);
    var dag = sdg.options[sdg.selectedIndex].value;

    var feiltekst = "";
    var feilbakgr = '0px solid #ffffff';

    if (+dag < +idag.getDate() && +mnd === +idag.getMonth() && +aar === +idag.getFullYear()) {
        feiltekst = "<i class='fa fa-times-circle'></i> Datoen er tilbake i tid. Vennligst velg en annen dato.";
        feilbakgr = '2px solid #0C2D82';
    } else if (+mnd < +idag.getMonth() && +aar === +idag.getFullYear()) {
        feiltekst = "<i class='fa fa-times-circle'></i> Datoen er tilbake i tid. Vennligst velg en annen dato.";
        feilbakgr = '2px solid #0C2D82';
    }

    document.getElementById("feildato").innerHTML = "<span class='spantekstfeil'>" + feiltekst + "</span>";
    document.getElementById("datotabell").style.border = feilbakgr;
}

function sjekk_aarfelt(dagid, mndid, aarid, autoselect) {
    var smnd = document.getElementById(mndid);
    var mnd = smnd.options[smnd.selectedIndex].value;

    sjekkdato(dagid, mndid, aarid);
    lagmndliste(mndid, aarid, mnd);
}

function sjekk_mndfelt(dagid, mndid, aarid, autoselect) {
    var sdg = document.getElementById(dagid);
    var dag = sdg.options[sdg.selectedIndex].value;

    sjekkdato(dagid, mndid, aarid);
    lagdagliste(dagid, mndid, aarid, dag);
}

//gjør om mnd nr til mnd navn (kortform)	
function talltilmnd(mndnr) {
    "use strict";
    var mndnavn = "";
    switch (mndnr) {
        case 0:
            mndnavn = "jan";
            break;
        case 1:
            mndnavn = "feb";
            break;
        case 2:
            mndnavn = "mar";
            break;
        case 3:
            mndnavn = "apr";
            break;
        case 4:
            mndnavn = "mai";
            break;
        case 5:
            mndnavn = "jun";
            break;
        case 6:
            mndnavn = "jul";
            break;
        case 7:
            mndnavn = "aug";
            break;
        case 8:
            mndnavn = "sep";
            break;
        case 9:
            mndnavn = "okt";
            break;
        case 10:
            mndnavn = "nov";
            break;
        case 11:
            mndnavn = "des";
            break;
    }
    return mndnavn;
}

//lager innhold i nedtrekkslisten for timer		
function lagtimeliste(timeid, autoselect) {
    "use strict";
    var ovinger = JSON.parse(localStorage.getItem('ovinger'));
    var antall = JSON.parse(localStorage.getItem('antall'));
    var idag = new Date();
    var ftime = idag.getHours();
    var timeliste = "<option value='999' selected>Velg time</option>";

    for (var i = 0; i < 24; i++) {
        var time = "";
        if (i < 10) {
            time = i;
            var timelang = "0" + i;
            timeliste += "<option value='" + time + "' >" + timelang + "</option>";
        } else {
            time = i;
            timeliste += "<option value='" + time + "' >" + time + "</option>";
        }
    }
    document.getElementById(timeid).innerHTML = timeliste;
}

//lager innhold i nedtrekkslisten for minutter	
function lagminuttliste(minuttid, autoselect) {
    "use strict";
    var ovinger = JSON.parse(localStorage.getItem('ovinger'));
    var antall = JSON.parse(localStorage.getItem('antall'));
    var dag = +antall;
    var idag = new Date();
    var fmin = idag.getMinutes();
    var minuttliste = "<option value='999' selected>Velg minutt</option>";

    for (var i = 0; i < 60; i++) {
        var minutt = "";
        if (i < 10) {
            minutt = i;
            var minuttlang = "0" + i;
            minuttliste += "<option value='" + minutt + "' >" + minuttlang + "</option>";
        } else {
            minutt = i;
            minuttliste += "<option value='" + minutt + "' >" + minutt + "</option>";
        }

    }
    document.getElementById(minuttid).innerHTML = minuttliste;
}

//legger til <antall> <type> til <dato>. Brukes for å beregne dato for øvinger utfra startdatoen
function DateAdd(dato, type, antall) {
    "use strict";
    var y = dato.getFullYear(),
        m = dato.getMonth(),
        d = dato.getDate();
    if (type === 'y') {
        y += antall;
    }
    if (type === 'm') {
        m += antall;
    }
    if (type === 'd') {
        d += antall;
    }
    return new Date(y, m, d);
}

function stringToDate(_date,_format,_delimiter){
    var formatLowerCase=_format.toLowerCase();
    var formatItems=formatLowerCase.split(_delimiter);
    var dateItems=_date.split(_delimiter);
    var monthIndex=formatItems.indexOf("mm");
    var dayIndex=formatItems.indexOf("dd");
    var yearIndex=formatItems.indexOf("yyyy");
    var month=parseInt(dateItems[monthIndex]);
    month-=1;
	var formatedDate = new Date(dateItems[yearIndex],month,dateItems[dayIndex]);
	return formatedDate;
}

//*******************************************************************************************	
//*********************************** Dialogbokser ******************************************
//*******************************************************************************************

//setter inn innhold i planleggingsdialog-boksen	
function lagplanleggingspopup(knappid) {
    "use strict";
    var ovinger = JSON.parse(localStorage.getItem('ovinger'));
    document.getElementById("plandagoverskrift").innerHTML = "Planlegg dag " + knappid;
	document.getElementById("label-for-plan-sted").innerHTML = "<label for='plan-sted-oving" + knappid + "'>Skriv inn sted:</label>";
    document.getElementById("plan-oving-dag-knapp").innerHTML = '<a href="#" id="plan-dag' + knappid + '-send" class="ui-btn uit-corner-all ui-shadow ui-btn-a ui-btn-icon-left ui-icon-check" onClick="lagreenplan(' + knappid + ')">Lagre instillinger</a>';
    document.getElementById("plan-dialg-tekstfelt").innerHTML = "<input class='ui-bar ui-body-e' name='plan-sted-oving" + knappid + "' id='plan-sted-oving" + knappid + "' value='" + ovinger[knappid - 1].sted + "' onkeypress='{if (event.keyCode==13)lagreenplan(" + knappid + ")}' type='text' placeholder='f.eks. hjemme...'>";
}

//setter inn innhold i øvingsdialog-boksen	
function lagovingspopup(knappid) {
    $("body").on("pagecontainershow", function (event, ui) {
        if (ui.toPage.prop("id") == "ovingpopup") {
            erbrukeronline();
            document.getElementById("ovingoverskrift").innerHTML = "Øving dag " + knappid;
            //document.getElementById("ferdigknappoving").innerHTML = '<a href="#" data-rel="back" id="ovingferdig' + knappid + '" class="ui-btn uit-corner-all ui-shadow ui-btn-a ui-btn-icon-right ui-icon-check" onClick="lagreOving(' + knappid + ')">Lagre</a>';
			$( "#starteoving" ).popup( "close" );
			$.mobile.changePage("#ovingpopup");
			startintro();
		}
    });
}

//setter inn innhold i evalueringsdialog-boksen	
function lagevalpopup(knappid) {
    "use strict";
    var ovinger = JSON.parse(localStorage.getItem('ovinger'));
    document.getElementById("evaloverskrift").innerHTML = "Evaluering dag " + knappid;
	evalslider(ovinger[knappid - 1].evalfor,3);
	evalslider(ovinger[knappid - 1].evaletter,4);
    //document.getElementById("visevalfor").value = parseInt(ovinger[knappid - 1].evalfor) + 3;
    //document.getElementById("visevaletter").value = parseInt(ovinger[knappid - 1].evaletter) + 3;
}

//*******************************************************************************************	
//*********************************** Øving med lyd *****************************************
//*******************************************************************************************

//hva som skal skje når en trykker på 'neste' knappene i øvingsdialogen
function ovingnesteknapp(knappnr) {
    "use strict";
    var lydklipp = document.getElementById("lydklipp1");
    if (knappnr === 0) {
        document.getElementById("blokk0").innerHTML = "<div class='ui-bar ui-bar-b' style='height:25px;text-align:center;background-color:#0C2D82;color:#ffffff;' id='visdel0'>Intro</div>";
        document.getElementById("blokk1").innerHTML = "<div class='ui-bar ui-bar-b' style='height:25px;text-align:center;background-color:#ffffff;color:#0C2D82;' id='visdel1'>Før</div>";
        document.getElementById("tab1").style.display = 'block';
		document.getElementById("tab0").style.display = 'none';
        document.getElementById("tab2").style.display = 'none';
		document.getElementById("tab3").style.display = 'none';
		stopintro();
	}    
	else if (knappnr === 1) {
        document.getElementById("blokk0").innerHTML = "<div class='ui-bar ui-bar-b' style='height:25px;text-align:center;background-color:#0C2D82;color:#ffffff;' id='visdel0'>Intro</div>";
		document.getElementById("blokk1").innerHTML = "<div class='ui-bar ui-bar-b' style='height:25px;text-align:center;background-color:#0C2D82;color:#ffffff;' id='visdel1'>Før</div>";
        document.getElementById("blokk2").innerHTML = "<div class='ui-bar ui-bar-b' style='height:25px;text-align:center;background-color:#ffffff;color:#0C2D82;' id='visdel2'>Øving</div>";
        document.getElementById("tab2").style.display = 'block';
        document.getElementById("tab0").style.display = 'none';
		document.getElementById("tab1").style.display = 'none';
        document.getElementById("tab3").style.display = 'none';
		var lydvalg = JSON.parse(localStorage.getItem('lydklipp'));
		if (lydvalg==1){
			startoving();
		}
		else{
			spillavLyd();
		}
		$( "#fortsettoving" ).popup( "close" );
		
    } else {
		document.getElementById("blokk0").innerHTML = "<div class='ui-bar ui-bar-b' style='height:25px;text-align:center;background-color:#0C2D82;color:#ffffff;' id='visdel0'>Intro</div>";
        document.getElementById("blokk1").innerHTML = "<div class='ui-bar ui-bar-b' style='height:25px;text-align:center;background-color:#0C2D82;color:#ffffff;' id='visdel1'>Før</div>";
		document.getElementById("blokk2").innerHTML = "<div class='ui-bar ui-bar-b' style='height:25px;text-align:center;background-color:#0C2D82;color:#ffffff;' id='visdel2'>Øving</div>";
        document.getElementById("blokk3").innerHTML = "<div class='ui-bar ui-bar-b' style='height:25px;text-align:center;background-color:#ffffff;color:#0C2D82;' id='visdel3'>Etter</div>";
        document.getElementById("tab3").style.display = 'block';
        document.getElementById("tab2").style.display = 'none';
        document.getElementById("tab1").style.display = 'none';
		document.getElementById("tab0").style.display = 'none';
        lydklipp.pause();

    }
}

//finner ut hvilket klipp brukeren har valgt og legger til eventlistener
function lydvalg(lyd) {
	"use strict";
    var lydklipp = document.getElementById("lydklipp1");
    lydklipp.addEventListener("timeupdate", fremdriftLyd, false);
    lydklipp.addEventListener("ended", klippSlutt, false);
    return lydklipp;
}

//hva som skjer når brukeren spiller av lydklipp
function spillavLyd() {
	"use strict";
    var lydklipp = document.getElementById("lydklipp1");
    //hvis klippet står på pause, setter neste klikk på knappen i gang avspilling
    if (lydklipp.paused) {
		document.getElementById("lyd-ill").innerHTML ="<img src='images/illustrasjon/oving_lyd.jpg' onClick='spillavLyd()'/>"
        document.getElementById("spillav").innerHTML = "<button class='ui-btn ui-btn-a ui-mini' id='spillavlydklipp' onClick='spillavLyd()'><i class='fa fa-pause'></i></button>";
        lydklipp.play();		
    }
    //hvis klippet spiller, setter neste klikk på knappen klippet på pause
    else {
		document.getElementById("lyd-ill").innerHTML ="<img src='images/oving/lydoving_pause.jpg' onClick='spillavLyd()'/>"
        document.getElementById("spillav").innerHTML = "<button class='ui-btn ui-btn-a ui-mini' id='spillavlydklipp' onClick='spillavLyd()'><i class='fa fa-play'></i></button>";
        lydklipp.pause();
    }
}

//hva som skal skje når et lydklipp er ferdig (aktiverer 'neste' knapp, og velgeren for lydklipp)
function klippSlutt() {
	var lydklipp = document.getElementById("lydklipp1");
    document.getElementById("spillav").innerHTML = "<button class='ui-btn ui-btn-a ui-mini'><i class='fa fa-play'></i></button>";
	lydklipp.currenTime=0;
	lydstatus=0;
    document.getElementById("spillerfremdrift").value = 0;
    document.getElementById("spillerfremdrift-etter").innerHTML = "";
	ovingnesteknapp(2);
}

var lydstatus=0;

//lager fremdriftslinje for avspilling av lydklipp
function fremdriftLyd() {
    var lydklipp = document.getElementById("lydklipp1");
    var verdi = 0;
		
    if (lydklipp.currentTime > 0) {
        verdi = Math.floor((100 / lydklipp.duration) * lydklipp.currentTime);
    }
    var lydtotal = (lydklipp.duration / 60).toFixed(2);
    var lydnaa = (lydklipp.currentTime / 60).toFixed(2);
	var lydsek=lydklipp.currentTime;
	
	if (lydsek > 10){
		$('#lyd-bakover').prop("disabled", false);
	}
	
	if (lydsek < lydstatus){
		$('#lyd-fremover').prop("disabled", false);	
	}
	else if(lydsek >= lydstatus){
		$('#lyd-fremover').prop("disabled", true);
		lydstatus=0;
	}
	else if (lydsek === lydklipp.duration){
		$('#lyd-fremover').prop("disabled", true);
		$('#lyd-bakover').prop("disabled", true);
		lydstatus=0;
	}
    document.getElementById("spillerfremdrift").value = verdi;
    //document.getElementById("spillerfremdrift-etter").innerHTML = "Spiller av " + lydnaa + " av " + lydtotal + " minutt";
}

function lydbakover() {
	var lydklipp = document.getElementById("lydklipp1");
	var nylyd=lydklipp.currentTime-5	
	if (nylyd+lydstatus >= 0){
		if (lydstatus===0){
			lydstatus=lydklipp.currentTime;
		}
		lydklipp.currentTime +=-5;
	}
}

function lydfremover() {
	var lydklipp = document.getElementById("lydklipp1");
	var nylyd=lydklipp.currentTime + 5;
	if (nylyd < lydstatus){
		lydklipp.currentTime += 5;
	}
	else if(nylyd === lydstatus){
		lydstatus=0;
		lydklipp.currentTime += 5;
	}
}
//*******************************************************************************************	
//*********************************** Øving med bilde ***************************************
//*******************************************************************************************
//variabler som brukes av bilde-øvingen
var pause = 0;
var fremdrift = 0;
var bildenr=0;
var symbolsynlig = 0;
var ovingbildesekvens="";
var ovingstatus=0;

//Øvingen starter når brukeren klikker på start-bildet
function startoving() {
    document.getElementById("sosoving0").style.display = 'none';
    document.getElementById("animspillav").innerHTML="<button id='spillavanimasjon' onClick='pauseoving()' class='ui-btn ui-btn-a ui-mini'><i class='fa fa-pause'></i></button>";
	$('#anim-bakover').prop("disabled", false);
	bildenr=1;
	bildevent();
}

//Sjekker om øving er ferdig eller satt på pause, viser gif-bildene i 12 sekund hver
function bildevent() {
	if (+pause === 0 && bildenr < 44) {
        document.getElementById("sosoving" + bildenr).style.display = 'block';
        $("#sosoving" + bildenr).fadeIn();
        $("#sosoving" + (bildenr - 1)).fadeOut();
        document.getElementById("sosoving" + (bildenr - 1)).style.display = 'none';
        hjelpetekst();
        ovingbildesekvens=setTimeout(function () {
			bildenr=(+bildenr + 1);
            fortsettoving(bildenr);
        }, 12000);
    }
}

//fortsette etter pause 
function fortsettoving() {
    if (bildenr <= 44 && pause===0) {
        fremdrift = (bildenr / 44) * 100;
        document.getElementById("ov-fremdrift").value = fremdrift;
		bildevent();
		if(ovingstatus===bildenr || ovingstatus===0){
			$('#anim-fremover').prop("disabled", true);
		}
		else {
			$('#anim-fremover').prop("disabled", false);
		}
	}
}

//øving satt på pause når brukeren trykker på animasjonen
function pauseoving() {
	clearTimeout(ovingbildesekvens);
	for (var i = 0; i < 44; i++) {
		document.getElementById("sosoving" + i).style.display = 'none';
	}
    $("#oving-sekvens").append("<img id='pausebilde' src='images/oving/sosoving_pause.jpg' onClick='startetterpause()' />");
	$('#anim-fremover').prop("disabled", true);
	$('#anim-bakover').prop("disabled", true);
    document.getElementById("hjelp").innerHTML = "Øvingen er satt på pause.";
	document.getElementById("animspillav").innerHTML="<button id='spillavanimasjon' onClick='startetterpause()' class='ui-btn ui-btn-a ui-mini'><i class='fa fa-play'></i></button>";
    pause = 1;
	
}

//stopper øvingen når brukeren går vekk fra skjermbildet
function stoppoving() {
	clearTimeout(ovingbildesekvens);
    for (var i = 0; i < 44; i++) {
        if (i===0) {
           document.getElementById("sosoving0").style.display = 'block';
        }
		else{
			document.getElementById("sosoving" + i).style.display = 'none';
		}
    }
	ovingnesteknapp(2);
    document.getElementById("animspillav").innerHTML ="<button id='spillavanimasjon' onClick='startoving()' class='ui-btn ui-btn-a ui-mini'><i class='fa fa-play'></i></button>";
    document.getElementById("hjelp").innerHTML = "";
	document.getElementById("ov-fremdrift").value = "0";
    pause = 0;
    fremdrift = 0;
	bildenr=0;
	ovingstatus=0;
	ovingbildesekvens=""
	$('#anim-fremover').prop("disabled", true);
	$('#anim-bakover').prop("disabled", true);
}

//når bruker trykker på pausebildet
function startetterpause() {
    $("#pausebilde").remove();
    pause = 0;
	$('#anim-fremover').prop("disabled", false);
	$('#anim-bakover').prop("disabled", false);
	document.getElementById("animspillav").innerHTML="<button id='spillavanimasjon' onClick='pauseoving()' class='ui-btn ui-btn-a ui-mini'><i class='fa fa-pause'></i></button>";
    fortsettoving();
    hjelpetekst();
}

function animbakover() {
	var i=bildenr-1;
	if(i > 0){
		if (ovingstatus===0){
			ovingstatus=bildenr;
		}
		bildenr=i;
		pauseoving();
		startetterpause();
	}
}

function animfremover() {
	var j=bildenr+1;
	if(j < ovingstatus){
	bildenr=j;	
	pauseoving();
	startetterpause();
	}
	else if(j===ovingstatus){
	bildenr=j;
	ovingstatus=0;
	pauseoving();
	startetterpause();
	$('#anim-fremover').prop("disabled", true);
	}
}

//hjelpeteksten som vises under øvingsanimasjon
function hjelpetekst() {
    tekst = "";
    if (bildenr === 1) {
        tekst = "Velkommen til dagens oppmerksomhetsøving. I denne øvingen skal du fokusere på forskjellige typer lyder rundt deg. Bildene og teksten på skjermen viser hvilke typer lyder og hvilken retning du skal fokusere på.";
    }
    if (bildenr === 2) {
        tekst = "Dersom du ikke får til øvingen til å begynne med, er det viktig at du ikke gir opp men fortsetter å øve. Lykke til!";
    }
    if (bildenr === 3 || bildenr === 23) {
        tekst = "Fokuser på alle typer lyder foran deg";
    } else if (bildenr === 4 || bildenr === 24) {
        tekst = "Fokuser på alle typer lyder til høyre for deg";
    } else if (bildenr === 5 || bildenr === 25) {
        tekst = "Fokuser på alle typer lyder til venstre for deg";
    } else if (bildenr === 6 || bildenr === 26) {
        tekst = "Fokuser på alle typer lyder bak deg";
    } else if (bildenr === 7 || bildenr === 27) {
        tekst = "Fokuser på alle typer lyder i alle retninger rundt deg";
    } else if (bildenr === 8 || bildenr === 28) {
        tekst = "Fokuser på lyder fra natur foran deg (dyr, vind, regn...)";
    } else if (bildenr === 9 || bildenr === 29) {
        tekst = "Fokuser på lyder fra natur til høyre for deg (dyr, vind, regn...)";
    } else if (bildenr === 10 || bildenr === 30) {
        tekst = "Fokuser på lyder fra natur til venstre for deg (dyr, vind, regn...)";
    } else if (bildenr === 11 || bildenr === 31) {
        tekst = "Fokuser på lyder fra natur bak deg (dyr, vind, regn...)";
    } else if (bildenr === 12 || bildenr === 32) {
        tekst = "Fokuser på lyder fra natur i alle retninger rundt deg (dyr, vind, regn...)";
    } else if (bildenr === 13 || bildenr === 33) {
        tekst = "Fokuser på mekaniske lyder foran deg (biler, maskiner...)";
    } else if (bildenr === 14 || bildenr === 34) {
        tekst = "Fokuser på mekaniske lyder til høyre for deg (biler, maskiner...)";
    } else if (bildenr === 15 || bildenr === 35) {
        tekst = "Fokuser på mekaniske lyder til venstre for deg (biler, maskiner...)";
    } else if (bildenr === 16 || bildenr === 36) {
        tekst = "Fokuser på mekaniske lyder bak deg (biler, maskiner...)";
    } else if (bildenr === 17 || bildenr === 37) {
        tekst = "Fokuser på mekaniske lyder i alle retninger rundt deg (biler, maskiner...)";
    } else if (bildenr === 18 || bildenr === 38) {
        tekst = "Fokuser på lyder fra andre mennesker foran deg (stemmer, fottrinn..)";
    } else if (bildenr === 19 || bildenr === 39) {
        tekst = "Fokuser på lyder fra andre mennesker til høyre for deg (stemmer, fottrinn..)";
    } else if (bildenr === 20 || bildenr === 40) {
        tekst = "Fokuser på lyder fra andre mennesker til venstre for deg (stemmer, fottrinn..)";
    } else if (bildenr === 21 || bildenr === 41) {
        tekst = "Fokuser på lyder fra andre mennesker bak deg (stemmer, fottrinn..)";
    } else if (bildenr === 22 || bildenr === 42) {
        tekst = "Fokuser på lyder fra andre mennesker i alle retninger rundt deg (stemmer, fottrinn..)";
    } else if (bildenr === 43) {
        tekst = "Flott! Du er nå ferdig med dagens oppmersomhetsøving. Om noen sekunder blir du sendt videre til etter-evalueringen. Velkommen tilbake i morgen! ";
       	ovingbildesekvens=setTimeout(function () {
			stoppoving();
			
        }, 12000);
		
    }
    document.getElementById("hjelp").innerHTML = tekst;
}

//Evaluering øving:
//bilde + tekst som endres når en bruker slideren for evaluering før/etter øving	
function evalnrtiltekst(evalnr) {
    "use strict";
    var evaltekst = "";
	var evalbakgrunn="";
    switch (evalnr) {
        case '-3':
            evaltekst = "<div class='evaltekst' style='color:#ffffff;background-color:#4d4d4d;'>Oppmerksomheten min er helt fokusert på mine egne tanker</div>";
            evalbakgrunn="<div style='background-color:#4d4d4d;padding-left:0.5em;padding-right:0.3em;padding-bottom:0.5em;'>";
			break;
        case '-2':
            evaltekst = "<div class='evaltekst' style='color:#ffffff;background-color:#8c8c8c;'>Oppmerksomheten min er mest fokusert på mine egne tanker og bare litt på det som foregår rundt meg</div>";
			evalbakgrunn="<div style='background-color:#8c8c8c;padding-left:0.5em;padding-right:0.3em;padding-bottom:0.5em;'>";
			break;
        case '-1':
            evaltekst = "<div class='evaltekst' style='color:#333333;background-color:#cccccc;'>Oppmerksomheten min er litt mer fokusert på egne tanker enn på det som foregår rundt meg</div>";
			evalbakgrunn="<div style='background-color:#cccccc;padding-left:0.5em;padding-right:0.3em;padding-bottom:0.5em;'>";
			break;
        case '0':
            evaltekst = "<div class='evaltekst' style='color:#333333;background-color:#e6e6e6;'>Oppmerksomheten min er likt fordelt mellom mine egne tanker og det som foregår rundt meg</div>";
			evalbakgrunn="<div style='background-color:#e6e6e6;padding-left:0.5em;padding-right:0.3em;padding-bottom:0.5em;'>";
			break;
        case '1':
            evaltekst = "<div class='evaltekst' style='color:#333333;background-color:#c9dbf1;'>Oppmerksomheten min er litt mer fokusert på det som foregår rundt meg enn på mine egne tanker</div>";
			evalbakgrunn="<div style='background-color:#c9dbf1;padding-left:0.5em;padding-right:0.3em;padding-bottom:0.5em;'>";
			break;
        case '2':
            evaltekst = "<div class='evaltekst' style='color:#333333;background-color:#bdcee3;'>Oppmerksomheten min er mest fokusert på det som foregår rundt meg og bare litt på mine egne tanker</div>";
			evalbakgrunn="<div style='background-color:#bdcee3;padding-left:0.5em;padding-right:0.3em;padding-bottom:0.5em;'>";
			break;
        case '3':
            evaltekst = "<div class='evaltekst' style='color:#ffffff;background-color:#88beff;'>Oppmerksomheten min er helt fokusert på det som foregår rundt meg</div>";
			evalbakgrunn="<div style='background-color:#88beff;padding-left:0.5em;padding-right:0.3em;padding-bottom:0.5em;'>";
			break;
    }
	var bildeogtekst=evalbakgrunn+evaltekst+'</div>';
    return bildeogtekst;
}

function evalslider(evalnr,boksid){
	var bildeogtekst=evalnrtiltekst(evalnr);
	var boks='evalforklaring'+boksid;
	document.getElementById(boks).innerHTML=bildeogtekst;
	//ovingnesteknapp(1);
}
function evalradiofor(verdi){
	var bildeogtekst=evalnrtiltekst(verdi);
	document.getElementById("valgoppmfor").innerHTML=bildeogtekst;
	document.getElementById("valglagre").innerHTML="Vil du fortsette med øvingen nå?";
	document.getElementById("valgforovingpop").style.display = 'block';
	document.getElementById("valgetterovingpop").style.display = 'none';
	setTimeout(function(){ $( "#fortsettoving" ).popup( "open" ); }, 500);
	}

function evalradioetter(verdi){
	var bildeogtekst=evalnrtiltekst(verdi);
	document.getElementById("valgoppmfor").innerHTML=bildeogtekst;
	document.getElementById("valglagre").innerHTML="Vil du lagre og avslutte øvingen nå?";
	document.getElementById("valgforovingpop").style.display = 'none';
	document.getElementById("valgetterovingpop").style.display = 'block';	
	setTimeout(function(){ $( "#fortsettoving" ).popup( "open" ); }, 500);
	}
	
//DEAKTIVERT
//Vis/skjul symbolforklaring
/*<--FJERN DENNE KOMMENTAREN FOR Å BRUKE 1/2
function visskjulsymbol(){
if (+symbolsynlig===0){
document.getElementById("symbol").style.display='block';
document.getElementById("visskjul").innerHTML="Skjul symbolforklaring";
symbolsynlig=1;
}
else {
document.getElementById("symbol").style.display='none';
document.getElementById("visskjul").innerHTML="Vis symbolforklaring";
symbolsynlig=0;
}
}
 FJERN DENNE KOMMENTAREN FOR Å BRUKE 2/2 --> */

//*******************************************************************************************	
//*********************************** Lister ************************************************
//*******************************************************************************************

//lager liste for planleggingssiden	
function lagplanliste() {
    "use strict";
    var ovinger = JSON.parse(localStorage.getItem('ovinger'));
    var ovingsinstillinger = JSON.parse(localStorage.getItem('ovingsinstillinger'));
    var antall = JSON.parse(localStorage.getItem('antall'));

    var planliste1 = "";
    var planliste2 = "";
	var planfremdriftsside= "";
	var kal="";
	
    for (var i = 0; i < ovinger.length; i++) {
        var m = ovinger[i].datomnd;
        var mnd = talltilmnd(parseInt(m));
        if (m < 10) {
			m = "0" + m;
		}
		var d = ovinger[i].datodag;
        var y = ovinger[i].datoaar;
        if (d < 10) {
            d = "0" + d;
        }
        var dato = d + ". " + mnd + " " + y;
        var t = ovinger[i].datotime;
        if (t < 10) {
            t = "0" + t;
        }
        var minutt = ovinger[i].datominutter;
        if (minutt < 10) {
            minutt = "0" + minutt;
        }
        var tid = t + ":" + minutt;
        
		 if (ovinger[i].utfort === 0 && ovinger[i].aktivert===0) {
			planfremdriftsside += "<li><a href='#planpopup' onClick='lagplanleggingspopup(" + ovinger[i].dag + ")' id='popup-planlegg" + ovinger[i].dag + "' data-transition='pop' class='ui-btn ui-btn-c ui-icon-carat-r ui-btn-icon-right'><h2>Dag "+ovinger[i].dag+"</h2><p><strong>" + dato + " kl: " + tid + " " + ovinger[i].sted + "</strong></p><p class='ui-li-aside'>Trykk for å endre tid/sted</p></a></li>";

		 } 
		 
		 
	   //legger til øvinger i listen dersom de ikke er utførte og brukeren har valgt å planlegge øvingene individuelt
        if (ovinger[i].utfort === 0 && ovingsinstillinger === 1) {
            planliste1 += "<li><a href='#planpopup' onClick='lagplanleggingspopup(" + ovinger[i].dag + ")' id='popup-planlegg" + ovinger[i].dag + "' data-transition='pop' class='ui-btn ui-btn-c ui-icon-carat-r ui-btn-icon-right'><h2>Dag "+ovinger[i].dag+"</h2><p><strong>" + dato + " kl: " + tid + " " + ovinger[i].sted + "</strong></p><p class='ui-li-aside'>Trykk for å endre tid/sted</p></a></li>";
            planliste2 += "";
		}
        //legger til øvinger som deaktiverte i listen dersom de ikke er utførte og brukeren har valgt å planlegge alle øvinger samtidig
        else if (ovinger[i].utfort === 0 && ovingsinstillinger === 0) {
            planliste1 += "<li><a href='#planpopup' id='popup-planlegg" + ovinger[i].dag + "' class='ui-btn ui-btn-c ui-icon-carat-r ui-btn-icon-right ui-state-disabled'><h2>Dag "+ovinger[i].dag+"</h2><p><strong>" + dato + " kl: " + tid + " " + ovinger[i].sted + "</strong></p></a></li>";
            planliste2 += "";
        }
        //legger til øvinger som deaktiverte nederst i listen dersom de er utførte
        else if (ovinger[i].utfort === 1) {
            planliste2 += "<li><a href='' id='popup-planlegg" + ovinger[i].dag + "' class='ui-btn ui-btn-d ui-icon-? ui-nodisc-icon ui-state-disabled''><h2>Dag "+ovinger[i].dag+"</h2><p><strong>" + dato + " kl: " + tid + " " + ovinger[i].sted + "</strong></p><p class='ui-li-aside'>Øvingen er fullført</p></a></li>";
            planliste1 += "";

        } else {
            planliste1 += "";
            planliste2 += "";

        }
    }
    if (+antall >= 1) {
        document.getElementById("plan-aar").disabled = true;
        document.getElementById("plan-mnd").disabled = true;
        document.getElementById("plan-dag").disabled = true;
    }
    document.getElementById("planliste").innerHTML = planliste1 + planliste2;
	//document.getElementById("planliste2").innerHTML = "<li data-role='list-divider'>Planlagte øvinger</li>"+planfremdriftsside;
}

//lager liste for øvingssiden
function lagovingliste() {
    "use strict";
    var idag = new Date();
    var ovinger = JSON.parse(localStorage.getItem('ovinger'));
    var ovingliste1 = "";
    var ovingliste2 = "";
    var forrigeovingferdig = 0;

    for (var i = 0; i < ovinger.length; i++) {
        var m = ovinger[i].datomnd;
        var mnd = talltilmnd(parseInt(m));
        var d = ovinger[i].datodag;
        var y = ovinger[i].datoaar;
        var aktivert = ovinger[i].aktivert;
        if (d < 10) {
            d = "0" + d;
        }
        var dato = d + ". " + mnd;
        var t = ovinger[i].datotime;
        if (t < 10) {
            t = "0" + t;
        }
        var minutt = ovinger[i].datominutter;
        if (minutt < 10) {
            minutt = "0" + minutt;
        }
        var tid = t + ":" + minutt;
        if (ovinger[i].dag > 1) {
            forrigeovingferdig = ovinger[i - 1].utfort;
        } else {
            forrigeovingferdig = 1;
        }

        //legger til øving i listen dersom øvingen er aktivert og forrige øving er ferdig	
        if (+aktivert === 1 && +forrigeovingferdig === 1 && ovinger[i].utfort === 0) {
            ovingliste1 += "<li><a href='#ovingpopup' onClick='lagovingspopup(" + ovinger[i].dag + ")' id='popup-oving" + ovinger[i].dag + "' data-transition='pop' class='ui-btn ui-btn-a ui-icon-carat-r ui-btn-icon-right'><div class='ovingdag'><div class='dag'>Dag</div><div class='dagnr'>" + ovinger[i].dag + "</div></div><div class='ovinginfo'><div class='ovinginfo-oppe'> " + dato + " kl: " + tid + " </div><div class='ovinginfo-nede'>Start øving</div></div></a></li>";
        }
        //legger til øving som deaktivert punkt i listen dersom den er utført
        else if (ovinger[i].utfort === 1) {
            ovingliste2 += "<li><a href='#' id='popup-oving" + ovinger[i].dag + "' class='ui-btn ui-btn-d ui-icon-? ui-nodisc-icon ui-state-disabled'><div class='ovingdag'><div class='dag'>Dag</div><div class='dagnr'>" + ovinger[i].dag + "</div></div><div class='ovinginfo'><div class='ovinginfo-oppe'></div><div class='ovinginfo-nede'>Fullført øving</div></div></a></li>";

        } else {
            ovingliste1 += "";
            ovingliste2 += "";
        }
    }
    //document.getElementById("ovingsliste").innerHTML = ovingliste1;
}

//lager liste for evalueringssiden
function lagevalliste() {
    "use strict";
    var ovinger = JSON.parse(localStorage.getItem('ovinger'));
    ovinger.reverse();

    var evalliste = "";

    for (var i = 0; i < ovinger.length; i++) {
        //legger til øving i listen dersom øvingen er utført
        if (ovinger[i].utfort === 1) {
            evalliste += "<li><a href='#evalpopup' onClick='lagevalpopup(" + ovinger[i].dag + ")' id='popup-eval" + ovinger[i].dag + "' data-transition='pop' class='ui-btn ui-btn-d ui-icon-carat-r ui-btn-icon-right'><h2>Dag " + ovinger[i].dag + "</h2><p>Fullført øving</p><p class='ui-li-aside'>Vis min egen-evaluering</p></a></li>";
        } else {
            evalliste += "";
        }
    }
    document.getElementById("evalliste").innerHTML = evalliste;
}

//*******************************************************************************************	
//******************************** Lagring av plan/øvings data fra bruker *******************
//*******************************************************************************************	

//lagrer plan for alle øvinger	
function lagreplanalle() {
    "use strict";
    var idag = new Date();
    var ovingsinstillinger = JSON.parse(localStorage.getItem('ovingsinstillinger'));
    var ovinger = JSON.parse(localStorage.getItem('ovinger'));
    var time = document.getElementById("plan-time").value;
    var minutter = document.getElementById("plan-minutt").value;
    var sted = document.getElementById("plan-sted").value;
    var neste = JSON.parse(localStorage.getItem('neste'));
    var antall = JSON.parse(localStorage.getItem('antall'));
    var dag = document.getElementById("plan-dag").value;
    var mnd = document.getElementById("plan-mnd").value;
    var aar = document.getElementById("plan-aar").value;
    var dato = new Date(aar, mnd, dag);
    var feiltekst1 = "";
    var feiltekst2 = "";
    /*var feilt=0;*/
    var feild = 0;
    if (+dag < +idag.getDate() && +mnd === +idag.getMonth() && +aar === +idag.getFullYear()) {
        feild = 1;
    } else if (+mnd < +idag.getMonth() && +aar === +idag.getFullYear()) {
        feild = 1;
    } else {
        feild = 0;
    }

    for (var i = 0; i < ovinger.length; i++) {
		//hvis første øving ikke er utført enda, lagres informasjon om startdato i tillegg
        if (+antall === 0 && +ovingsinstillinger === 0 && ovinger[i].utfort === 0 && +feild === 0) {
            var nydato = DateAdd(dato, "d", i);
            ovinger[i].dato = nydato;
            ovinger[i].datodag = nydato.getDate();
            ovinger[i].datomnd = nydato.getMonth();
            ovinger[i].datoaar = nydato.getFullYear();
            if (time < 999 && minutter < 999){
				ovinger[i].datotime = time;
				ovinger[i].datominutter = minutter;
				ovinger[i].tid = time + ":" + minutter;
			}
			if (sted.length > 0){
				ovinger[i].sted = sted;
			}
            ovinger[i].planlagt = 1;
            ovinger[i].aktivert = 0;
            localStorage.setItem('ovinger', JSON.stringify(ovinger));
            document.getElementById("feildato").innerHTML = "";
            document.getElementById("erlagret").innerHTML = "<p>Endringene er lagret.</p>";
            lagplanliste();
            lagovingliste();
        }
        //hvis første øving ikke er utført enda, og brukeren har valgt å planlegge øvinger individuelt, lagres bare startdatoen
        else if (+antall === 0 && +ovingsinstillinger === 1 && ovinger[i].utfort === 0 && +feild === 0) {
            var nydato = DateAdd(dato, "d", i);
            ovinger[i].dato = nydato;
            ovinger[i].datodag = nydato.getDate();
            ovinger[i].datomnd = nydato.getMonth();
            ovinger[i].datoaar = nydato.getFullYear();
            ovinger[i].planlagt = 1;
            ovinger[i].aktivert = 0;
            localStorage.setItem('ovinger', JSON.stringify(ovinger));
            document.getElementById("feildato").innerHTML = "";
            document.getElementById("erlagret").innerHTML = "<p>Endringene er lagret.</p>";
            lagplanliste();
            lagovingliste();
        }
        //hvis første øving er utført, lagres bare tid og sted
        else if (+antall > 0 && +ovinger[i].utfort === 0 && +ovingsinstillinger === 0) {
            if (time < 999 && minutter < 999){
				ovinger[i].datotime = time;
				ovinger[i].datominutter = minutter;
				ovinger[i].tid = time + ":" + minutter;
			}
            if (sted.length > 0){
				ovinger[i].sted = sted;
			}
            ovinger[i].planlagt = 1;
            ovinger[i].aktivert = 0;
            document.getElementById("feildato").innerHTML = "";
            localStorage.setItem('ovinger', JSON.stringify(ovinger));
            document.getElementById("erlagret").innerHTML = "<p>Endringene er lagret.</p>";
            lagplanliste();
            lagovingliste();
        } else if (+antall === 0 && +feild > 0) {
            document.getElementById("erlagret").innerHTML = "Datoen er tilbake i tid. Vennligst velg en annen dato. Ingen endringer ble lagret";
        }
    }
    setTimeout(function () {
        document.getElementById("erlagret").innerHTML = "";
    }, 5000);
    nesteoving(neste);
}

//lagrer informasjon om en planlagt øving når bruker velger å planlegge øvinger individuelt	
function lagreenplan(knappid) {
    var idag = new Date();
    var ovinger = JSON.parse(localStorage.getItem('ovinger'));
    var time = document.getElementById("plan-time-oving").value;
    var minutter = document.getElementById("plan-minutt-oving").value;
    var sted = document.getElementById("plan-sted-oving" + knappid).value;
    var neste = JSON.parse(localStorage.getItem('neste'));
	if (time < 999 && minutter < 999){
		ovinger[knappid - 1].datotime = time;
		ovinger[knappid - 1].datominutter = minutter;
		ovinger[knappid - 1].tid = time + ":" + minutter;
	}
	if (sted.length > 0){
		ovinger[knappid - 1].sted = sted;
	}
	ovinger[knappid - 1].planlagt = 1;
	ovinger[knappid - 1].aktivert = 0;
	localStorage.setItem('ovinger', JSON.stringify(ovinger));
	/*document.getElementById("feiltid2").innerHTML = "";*/
	document.getElementById("erlagret2").innerHTML = "<p>Endringene er lagret.</p>";
    lagplanliste();
    lagovingliste();
    nesteoving(neste);  
    setTimeout(function () {
        document.getElementById("erlagret2").innerHTML = "";
    }, 5000);
    $(".ui-dialog-page").dialog("close");
}

//lagrer informasjon om utført øving
function lagreOving(knappid) {
    "use strict";
    var ovinger = JSON.parse(localStorage.getItem('ovinger'));
    var neste = JSON.parse(localStorage.getItem('neste'));
    for (var i = 0; i < ovinger.length; i++) {
        if (ovinger[i].dag === knappid) {
            ovinger[i].evalfor = $('input[name="oppmfor"]:checked').val();
            ovinger[i].evaletter = $('input[name="oppmetter"]:checked').val();
            ovinger[i].utfort = 1;
            ovinger[i].aktivert = 0;
            neste = i + 1;
			console.log(ovinger[i].dag); 
			console.log(ovinger[i].evalfor);
			console.log(ovinger[i].evaletter);
            break;
        }
    }
    localStorage.setItem('ovinger', JSON.stringify(ovinger));
    localStorage.setItem('neste', JSON.stringify(neste));
    lagplanliste();
    lagovingliste();
    lagevalliste();
    antalldager();
    nesteoving(neste);
    graf();
	setforste();
	setTimeout(function(){
		tabreset();
		tvingOmlasting();
	},1)
    //sendtilphp();
    $(".ui-dialog-page").dialog("close");
}


//*******************************************************************************************	
//******************************** Status for øvinger og meldinger til bruker ***************
//*******************************************************************************************	

//timer som kjører funksjonen for å sjekke om øvinger skal aktiveres	
function statustimer() {
    setInterval(sjekkstatus, 1000);
}

//finner antall øvinger/dager som er utførte. Antall brukes bla. på forsiden og evalueringssiden
function antalldager() {
    "use strict";
    var ovinger = JSON.parse(localStorage.getItem('ovinger'));
    var dager = 0;
    var m1 = ovinger[0].datomnd;
    var mnd1 = talltilmnd(parseInt(m1));
    var y1 = ovinger[0].datoaar;
    var d1 = ovinger[0].datodag;
	var startdato = d1 + "." + mnd1;
	var m6 = ovinger[6].datomnd;
    var mnd6 = talltilmnd(parseInt(m6));
    var y6 = ovinger[6].datoaar;
    var d6 = ovinger[6].datodag;
	var sluttdato = d6 + "." + mnd6;
	var deskfremdrift=document.getElementsByClassName("fremdrift-top-desktop");
	var deskplan=document.getElementsByClassName("plan-top-desktop");
	var mobilfremdrift=document.getElementsByClassName("fremdrift-top-mobil");
	var mobilplan=document.getElementsByClassName("plan-top-mobil");
	var fremdriftikon=document.getElementsByClassName("knapp-fremdrift-ikon");
	var tilgj=document.getElementsByClassName("tilgj-ant");
	var plan=document.getElementsByClassName("plan-ant");
	var ferdig=document.getElementsByClassName("full-ant");
	var aktiv=0;
    for (var i = 0; i < ovinger.length; i++) {
        aktiv=+aktiv+ovinger[i].aktivert;
		if (ovinger[i].utfort === 1) {
            dager += 1;
        }
    }
	
	var planlgt=7-dager;
	var utfrt=dager;
    localStorage.setItem('antall', JSON.stringify(dager));
	if (dager === 0 ){
		document.getElementById("ovingside-utforte").innerHTML = "Du har ikke fullført noen øvinger enda. Etter at du har utført øvinger vil de vises i en liste her, og du vil kunne se på din egen-evaluring for hver øving.";
	}
	else if (dager === 7){
		document.getElementById("ovingside-utforte").innerHTML = "Du har fullført 7 av 7 dager og er ferdig med 7-dagers programmet.";
	}
	else {
		document.getElementById("ovingside-utforte").innerHTML = "Jeg har fullført " + dager + " av 7 dager";
	}
	//document.getElementById("dlg-ov-dag-nr").innerHTML = dager+1;
	
	for (i = 0; i < tilgj.length; i++) {
		tilgj[i].innerHTML = aktiv;
	}
	
	for (i = 0; i < plan.length; i++) {
		plan[i].innerHTML = planlgt;
	}
	
	for (i = 0; i < ferdig.length; i++) {
		ferdig[i].innerHTML = utfrt;
	}
	
	for (i = 0; i < deskfremdrift.length; i++) {
		deskfremdrift[i].innerHTML = dager + " av 7 dager";
	}
	
	for (i = 0; i < deskplan.length; i++) {
		if (dager === 7){
		deskplan[i].innerHTML = "Jeg har fullført alle planlagte øvinger";	
		}
		else {
		deskplan[i].innerHTML = "Jeg skal øve fra " + startdato + " til " + sluttdato;
		}
	}
	
	for (i = 0; i < mobilfremdrift.length; i++) {
		mobilfremdrift[i].innerHTML = dager + " av 7 dager fullført";
	}
	
	for (i = 0; i < mobilplan.length; i++) {
		mobilplan[i].innerHTML = "Jeg skal øve fra " + startdato;
	}
	
	for (i = 0; i < fremdriftikon.length; i++) {
		fremdriftikon[i].innerHTML = "<img class='knapp-bilde' src='images/ikoner/ikon-liste" + dager +".png' alt='Vis fremdrift' />";
	}
	
	if (+dager === 7) {
        document.getElementById("7dagerferdig").innerHTML = "Du har nå gjennomført 7 dager med oppmerksomhetsøvinger. Bra jobba!"
    }
}

//lager meldinger øverst på forsiden og på øvingssiden ang. neste øving
function nesteoving(neste) {
    "use strict";
    var ovinger = JSON.parse(localStorage.getItem('ovinger'));
	var antall = JSON.parse(localStorage.getItem('antall'));
	var lydklipp = JSON.parse(localStorage.getItem('lydklipp'));
    //console.log(antall);
	var dag = "";
    var tid = "";
    var dato = "";
    var sted = "";
    var idag = new Date();
	var knapptekstoving = "";
	var ovingmeny=document.getElementsByClassName("oving-menyknapp");
	var planknapptid=document.getElementsByClassName("tid-midt-klokke");
	var planknappdato=document.getElementsByClassName("tid-top-neste");
	var tilgjknapp=JSON.parse(localStorage.getItem('tilgjknapp'));
	var ikketilgjknapp=JSON.parse(localStorage.getItem('ikketilgjknapp'));
	
	

	
   for (var i = 0; i < ovinger.length; i++) {
        //hvis dette er neste øving i rekken...
        if (ovinger[i].dag === (parseInt(neste) + 1)) {
            dag = ovinger[i].dag;
            var aktivert = ovinger[i].aktivert;
            var m = ovinger[i].datomnd;
            var mnd = talltilmnd(parseInt(m));
            var y = ovinger[i].datoaar;
            var d = ovinger[i].datodag;
            var dg = d;
			
            if (d < 10) {
                d = "0" + d;
            }
            if (+y === +idag.getFullYear) {
                dato = d + ". " + mnd;
            } else {
                dato = d + ". " + mnd + " " + y;
            }
            var t = ovinger[i].datotime;
            var time = t;
            if (t < 10) {
                t = "0" + t;
            }
            var minutt = ovinger[i].datominutter;
            var minu = minutt;
            if (minutt < 10) {
                minutt = "0" + minutt;
            }
            tid = t + ":" + minutt;
            sted = ovinger[i].sted;

            //hvis en øving er aktivert og ikke fullført enda
            if (+aktivert === 1 && +antall < 7) {
				if(tilgjknapp===0){
				knapptekstoving = "<a href='#introside'>"
					+ "<img class='imgbakgr' src='images/illustrasjon/start.jpg'>"
					+ "<div class='imgteksttopp'>"
					+ "<h2><i class='fa fa-check' aria-hidden='true'></i> Øving dag " + ovinger[i].dag + "</h2>"
					+ "<p>Jeg har en ny øving som venter.</p></div>"
					+ "<p class='imgtekstbunn'><strong>Start øving <i class='fa fa-chevron-circle-right'> </i></strong></p>"
					+ "</a>";
				document.getElementById("ov-tilgj").style.display = 'block';
				document.getElementById("lydvalg-oss").style.display = 'block';
				document.getElementById("lydvalg-avbryt").style.display = 'block';				
				document.getElementById("ov-ikke-tilgj").style.display = 'none';
				document.getElementById("startovingpop").innerHTML = "<a href='#ovingpopup' class='ui-btn ui-corner-all ui-shadow ui-btn-a ui-mini' onClick='lagovingspopup(" + ovinger[i].dag + ")'>Ja</a><a href='#' class='ui-btn ui-corner-all ui-shadow ui-btn-e ui-mini' data-rel='back'>Nei</a>";
				document.getElementById("valgetterovingpop").innerHTML="<a href='#' class='ui-btn ui-corner-all ui-shadow ui-btn-a ui-mini' onclick='lagreOving(" + ovinger[i].dag + ")'>Ja</a><a href='#' class='ui-btn ui-corner-all ui-shadow ui-btn-e ui-mini' data-rel='back'>Nei</a>";
				
				for (i = 0; i < ovingmeny.length; i++) {
					ovingmeny[i].innerHTML = knapptekstoving;
				}
				
				for (i = 0; i < planknapptid.length; i++) {
					planknapptid[i].innerHTML = "Neste øving er klar nå";
				}
				
				for (i = 0; i < planknappdato.length; i++) {
					planknappdato[i].innerHTML = " ";
				}
				antalldager();
				tilgjknapp=1;
				ikketilgjknapp=0;
				localStorage.setItem('tilgjknapp',JSON.stringify(tilgjknapp));
				localStorage.setItem('ikketilgjknapp',JSON.stringify(ikketilgjknapp));
				}
                            
				//document.getElementById("ovingside-nesteoving").innerHTML = " Du har en ny øving som venter på deg:";
                lagovingliste();
            }
            //hvis neste øving er i dag, og øvingen ikke er aktivert enda
            else if (+m === +idag.getMonth() && +y === +idag.getFullYear() && +dg === +idag.getDate() && +aktivert === 0 && +antall < 7) {
				if(ikketilgjknapp===0){
				knapptekstoving = "<a href='#introside'>"
					+ "<img class='imgbakgr' src='images/illustrasjon/vent.jpg'>"
					+ "<div class='imgteksttopp'>"
					+ "<h2><i class='fa fa-spinner' aria-hidden='true'></i> Øvingen er ikke klar.</h2>"
					+ "<p> Fortsett å øve i dag kl: " + tid + "</p>"
					+"</div>"
					+ "</a>";
				document.getElementById("ov-tilgj").style.display = 'none';
				document.getElementById("lydvalg-oss").style.display = 'none';
				document.getElementById("lydvalg-avbryt").style.display = 'none';				
				document.getElementById("ov-ikke-tilgj").style.display = 'block';
				
				
				for (i = 0; i < ovingmeny.length; i++) {
					ovingmeny[i].innerHTML = knapptekstoving;
				}
				
				for (i = 0; i < planknapptid.length; i++) {
					planknapptid[i].innerHTML = "Min neste øving er klar i dag kl." + tid;
				}
				
				for (i = 0; i < planknappdato.length; i++) {
					planknappdato[i].innerHTML = " i dag kl.";
				}
				ikketilgjknapp=1;
				tilgjknapp=0;
				localStorage.setItem('tilgjknapp',JSON.stringify(tilgjknapp));
				localStorage.setItem('ikketilgjknapp',JSON.stringify(ikketilgjknapp));
				}
                //document.getElementById("ovingside-nesteoving").innerHTML = " ";
				document.getElementById("dlg-ov-dato-tid").innerHTML = " i dag kl: " + tid;
                //document.getElementById("sisteaktivitet-forside").innerHTML = "Neste øving:<br/> i dag kl: " + tid + " " + sted;
                lagovingliste();
            }
			//hvis alle øvingene er fullført
            else if(+aktivert === 0 && +antall === 7){
				if(ikketilgjknapp===0){
				knapptekstoving = "<a href='#introside' class='ui-btn ui-btn-d knappetekst'>"
							+ "<img class='imgbakgr' src='images/illustrasjon/ferdig.jpg'>"
							+ "<div class='imgteksttopp'>"
							+ "<h2><i class='fa fa-spinner' aria-hidden='true'></i> Gratulerer! </h2>"
							+ "<p> Du har fullført alle 7 øvingene.</p>"
							+"</div>"
							+ "</a>";
			
				document.getElementById("ov-tilgj").style.display = 'none';
				document.getElementById("lydvalg-oss").style.display = 'none';
				document.getElementById("lydvalg-avbryt").style.display = 'none';				
				document.getElementById("ov-ikke-tilgj").style.display = 'none';
				document.getElementById("alle-ov-ferdig").style.display = 'block';
				
				for (i = 0; i < ovingmeny.length; i++) {
					ovingmeny[i].innerHTML = knapptekstoving;
				}
				
				for (i = 0; i < planknapptid.length; i++) {
					planknapptid[i].innerHTML = "Ingen planlagte øvinger " ;
				}
				
				for (i = 0; i < planknappdato.length; i++) {
					planknappdato[i].innerHTML = " ";
				}
				ikketilgjknapp=1;
				tilgjknapp=0;
				localStorage.setItem('tilgjknapp',JSON.stringify(tilgjknapp));
				localStorage.setItem('ikketilgjknapp',JSON.stringify(ikketilgjknapp));
				}
                document.getElementById("ovingside-nesteoving").innerHTML = " ";
				document.getElementById("dlg-ov-dato-tid").innerHTML = " ";
                //document.getElementById("sisteaktivitet-forside").innerHTML = "Neste øving:<br/> i dag kl: " + tid + " " + sted;
                lagovingliste();
			}
			
			//hvis neste øving er lenger frem i tid
            else {
				if(ikketilgjknapp===0){
				knapptekstoving = "<a href='#introside'>"
					+ "<img class='imgbakgr' src='images/illustrasjon/vent.jpg'>"
					+ "<div class='imgteksttopp'>"
					+ "<h2><i class='fa fa-spinner' aria-hidden='true'></i> Øvingen er ikke klar.</h2>"
					+ "<p>Fortsett å øve " + d + ". " + mnd + " kl." + tid + "</p>"
					+ "</div>"
					+ "</a>";
				
				document.getElementById("ov-tilgj").style.display = 'none';
				document.getElementById("lydvalg-oss").style.display = 'none';
				document.getElementById("lydvalg-avbryt").style.display = 'none';				
				document.getElementById("ov-ikke-tilgj").style.display = 'block';
				
				for (i = 0; i < ovingmeny.length; i++) {
					ovingmeny[i].innerHTML = knapptekstoving;
				}
				
				for (i = 0; i < planknapptid.length; i++) {
					planknapptid[i].innerHTML = "Neste øving er klar " + d + ". " + mnd + " kl." + tid;
				}
				
				for (i = 0; i < planknappdato.length; i++) {
					planknappdato[i].innerHTML = " i morgen kl.";
				}
				ikketilgjknapp=1;
				tilgjknapp=0;
				localStorage.setItem('tilgjknapp',JSON.stringify(tilgjknapp));
				localStorage.setItem('ikketilgjknapp',JSON.stringify(ikketilgjknapp));
				}
                //document.getElementById("ovingside-nesteoving").innerHTML = "";
				document.getElementById("dlg-ov-dato-tid").innerHTML = dato + " kl: " + tid;
                //document.getElementById("sisteaktivitet-forside").innerHTML = "Neste øving:<br/> " + dato + " kl: " + tid + " " + sted;
                lagovingliste();
            }
			    
            break;
        }
		
    }
}

//sjekker om dato og tidspunkt for å aktivere en ny øving er nådd	
function sjekkstatus() {
    "use strict";
    var alarm = JSON.parse(localStorage.getItem('alarm'));
    var forste = JSON.parse(localStorage.getItem('forste'));
    var ovinger = JSON.parse(localStorage.getItem('ovinger'));
    var neste = JSON.parse(localStorage.getItem('neste'));
    var idag = new Date();
    var d = idag.getDate();
    var m = idag.getMonth();
    var y = idag.getFullYear();
    var t = idag.getHours();
    var minutt = idag.getMinutes();

    for (var i = 0; i < ovinger.length; i++) {
        var dag = ovinger[i].datodag;
        var utfort = ovinger[i].utfort;
        var mnd = ovinger[i].datomnd;
        var aar = ovinger[i].datoaar;
        var time = ovinger[i].datotime;
        var minu = ovinger[i].datominutter;
        var aktivert = ovinger[i].aktivert;

        //aktiverer øvinger hvis tidspunkt er nådd i dag
        if (+dag === +d && +mnd === +m && +aar === +y && ((+time === +t && +minu <= +minutt) || +time < +t) && +aktivert === 0 && +utfort === 0) {
            ovinger[i].aktivert = 1;
            nesteoving(neste);
            lagovingliste();
            lagplanliste();
            localStorage.setItem('ovinger', JSON.stringify(ovinger));
        }
        //aktiverer øvinger hvis tidspunkt er forbi og brukeren ikke hadde appen åpen da det skjedde
        //hvis brukeren åpner appen i samme mnd.
        else if (+dag < +d && +mnd === +m && +aar === +y && +aktivert === 0 && +utfort === 0) {
            ovinger[i].aktivert = 1;
            lagovingliste();
            lagplanliste();
            localStorage.setItem('ovinger', JSON.stringify(ovinger));
            nesteoving(neste);
        }
        //hvis månedsskifte før brukeren åpner appen igjen
        else if (+mnd < +m && +aar === +y && +aktivert === 0 && +utfort === 0) {
            ovinger[i].aktivert = 1;
            lagovingliste();
            lagplanliste();
            localStorage.setItem('ovinger', JSON.stringify(ovinger));
            nesteoving(neste);
        }
        //hvis årskifte før brukeren åpner appen igjen
        else if (+aar < +y && +aktivert === 0 && +utfort === 0) {
            ovinger[i].aktivert = 1;
            lagovingliste();
            lagplanliste();
            localStorage.setItem('ovinger', JSON.stringify(ovinger));
            nesteoving(neste);
        } else {
            nesteoving(neste);
        }
    }
}

//Oppmerksomhets-graf
//tegner graf basert på brukerens egenevaluering av fokus for oppmerksomhet før og etter øvingene
function graf() {
    $("body").on("pagecontainershow", function (event, ui) {
		var antall = JSON.parse(localStorage.getItem('antall'));
        if (ui.toPage.prop("id") == "fremdrift" && antall > 0) {
            //grafen lages v.h.a. chart.js Dokumentasjon: http://www.chartjs.org/docs/
			document.getElementById("ingenfullfort").innerHTML="<p class='tomt-tekst'>Grafen under viser hvordan fokuset for oppmerksomheten din (før og etter øvingen) endrer seg over tid. Grafen fylles opp etterhvert som du gjør øvinger. De grå søylene viser oppmerksomheten din før øvinger og de blå søylene viser oppmerksomheten etter øvinger.</p>";
            var ovinger = JSON.parse(localStorage.getItem('ovinger'));
            //data som skal være med i grafen 
            var data = {			
                labels: [],
                datasets: [{
					label: "Min oppmerksomhet før øving",
                    fillColor: "rgba(100,100,100,0.7)",
                    strokeColor: "rgba(100,100,100,0.5)",
                    highlightFill: "rgba(178,232,178,0.9)",
                    highlightStroke: "rgba(178,232,178,0.7)",
                    data: []
                }, {
					label: "Min oppmerksomhet etter øving",
                    fillColor: "rgba(7,178,220,0.7)",
                    strokeColor: "rgba(7,178,220,0.5)",
                    highlightFill: "rgba(178,232,178,0.9)",
                    highlightStroke: "rgba(178,232,178,0.7)",
                    data: []
                }]

            }
            //lager canvas for grafen
            var gdiv = document.getElementById("grafdiv");
            gdiv.innerHTML = "";
            gdiv.innerHTML = "<canvas id='popupgraf' class='grafpopup' width='400' height='400'></canvas>";

            //instillinger for str osv på graf
            var ctx = document.getElementById("popupgraf").getContext("2d");
            ctx.clearRect(0, 0, 400, 400);
            var nygraf = new Chart(ctx).Bar(data, {
                scaleOverride: true,
                scaleSteps: 6,
                scaleStepWidth: 1,
                scaleStartValue: -3,
                scaleLabel: "<%= evaltalltiltekst(Number(value)) %>",
                scaleBeginAtZero: false,
                responsive: true
            });
            //tekst på horisontal akse
            for (var i = 0; i < antall; i++) {
                nygraf.addData([ovinger[i].evalfor, ovinger[i].evaletter], "Dag " + (i + 1));
            }
		}
		else {
			var tomtinnhold="<p class='tomt-tekst'>Du har ikke fullført noen øvinger enda. Grafen vil vises og fylles med innhold etterhvert som du gjør øvingene.</p>";
			document.getElementById("ingenfullfort").innerHTML=tomtinnhold;
		}
    });
}
//tekst som skal være på vertikal akse på grafen
function evaltalltiltekst(tall) {
    "use strict";
    var evaltekst = "";
    switch (tall) {
        case -3:
            evaltekst = "Egne tanker";
            break;
        case -2:
            evaltekst = "-";
            break;
        case -1:
            evaltekst = "-";
            break;
        case 0:
            evaltekst = "Jevnt fordelt";
            break;
        case 1:
            evaltekst = "-";
            break;
        case 2:
            evaltekst = "-";
            break;
        case 3:
            evaltekst = "Omgivelsene";
            break;
    }
    return evaltekst;
}

//*******************************************************************************************	
//******************************** Navigasjonsrelatert **************************************
//*******************************************************************************************

//skjekker om brukeren er online når de starter øvingen. Hvis de ikke er online, vil ikke øvingen med lyd være tilgjengelig	
function erbrukeronline() {
    if (navigator.onLine) {
        document.getElementById("online-feilmelding").innerHTML = "";
        document.getElementById("spillavlydklipp").disabled = false;
        document.getElementById("lydvalg0").disabled = false;
    } else {
        document.getElementById("online-feilmelding").innerHTML = "<span class='spantekstfeil'><i class='fa fa-times-circle'></i> Øvingen med lyd er ikke tilgjengelig fordi du ikke er koblet til Internett. Du kan enten gjøre den visuelle versjonen av øvingen, eller gjøre øvingen med lyd senere når du er tilkoblet til Internett. </span>";
        document.getElementById("spillavlydklipp").disabled = true;
        document.getElementById("lydvalg0").disabled = true;
        document.getElementById("ovingvalg1").style.display = 'block';
        document.getElementById("ovingvalg0").style.display = 'none';
    }
}

function rulltilelement(t){
     document.getElementById(t).scrollIntoView(true);
}


//tooltip popup om startdato
$.mobile.document.on("click", "#omdato", function (evt) {
    $("#popup-omdato").popup("open", {
        x: evt.pageX,
        y: evt.pageY
    });
    evt.preventDefault();
});

//Pauser øvingen hvis brukeren lukker øvingsdialog med X knappen
$(document).delegate("#ovingpopup", "pagehide", function () {
    var lyd = JSON.parse(localStorage.getItem('lydklipp'));
    if (parseInt(lyd) === 1) {
		stoppoving();
        tabreset();
    } else {
	   document.getElementById("lydklipp1").pause();
       tabreset();
    }
});

function avbrytov() {
	tabreset();
	$( "#avbryteoving" ).popup( "close" );
	setforste();
	setTimeout(function(){
		tvingOmlasting();
	},1)
}

function tvingOmlasting(){
	location.replace("index.html");
}

$(function () {
    "use strict";
    $("[data-role=panel]").panel().enhanceWithin();
});

$(function () {
    "use strict";
    $("#fortsettoving").enhanceWithin().popup();
    $("#fortsettoving").popup({
        history: false
    });
});

$(function () {
    "use strict";
    $("#starteoving").enhanceWithin().popup();
    $("#starteoving").popup({
        history: false
    });
});

$(function () {
    "use strict";
    $("#avbryteoving").enhanceWithin().popup();
    $("#avbryteoving").popup({
        history: false
    });
});

//popupmenyen for små skjermer	
$(function () {
    "use strict";
    $("#popup-meny-top").enhanceWithin().popup();
    $("#popup-meny-top").popup({
        history: false
    });
});

$(function () {
    "use strict";
    $("#oss").enhanceWithin().popup();
    $("#oss").popup({
        history: false
    });
});

$(function () {
    "use strict";
    $("#kontakt").enhanceWithin().popup();
    $("#kontakt").popup({
        history: false
    });
});

//tilbakestiller tabvisningen og setter lydklipp på pause i øvings-dialogen
function tabreset() {
    "use strict";
    document.getElementById("blokk0").innerHTML = "<div class='ui-bar ui-bar-b' style='height:25px;text-align:center;background-color:#ffffff;color:#0C2D82;' id='visdel0'>Intro</div>";
	document.getElementById("blokk1").innerHTML = "<div class='ui-bar ui-bar-b' style='height:25px;text-align:center;background-color:#E9F1F9;color:#333333;' id='visdel1'>Før</div>";
    document.getElementById("blokk2").innerHTML = "<div class='ui-bar ui-bar-b' style='height:25px;text-align:center;background-color:#E9F1F9;color:#333333;' id='visdel2'>Øving</div>";
    document.getElementById("blokk3").innerHTML = "<div class='ui-bar ui-bar-b' style='height:25px;text-align:center;background-color:#E9F1F9;color:#333333;' id='visdel3'>Etter</div>";
    document.getElementById("tab0").style.display = 'block';
	document.getElementById("tab1").style.display = 'none';
    document.getElementById("tab2").style.display = 'none';
    document.getElementById("tab3").style.display = 'none';    
}

$( function()
{
    var targets = $( '[rel~=tooltip]' ),
        target  = false,
        tooltip = false,
        title   = false;
 
    targets.bind( 'mouseenter', function()
    {
        target  = $( this );
        tip     = target.attr( 'title' );
        tooltip = $( '<div id="tooltip"></div>' );
 
        if( !tip || tip == '' )
            return false;
 
        target.removeAttr( 'title' );
        tooltip.css( 'opacity', 0 )
               .html( tip )
               .appendTo( 'body' );
 
        var init_tooltip = function()
        {
            if( $( window ).width() < tooltip.outerWidth() * 1.5 )
                tooltip.css( 'max-width', $( window ).width() / 2 );
            else
                tooltip.css( 'max-width', 340 );
 
            var pos_left = target.offset().left + ( target.outerWidth() / 2 ) - ( tooltip.outerWidth() / 2 ),
                pos_top  = target.offset().top - tooltip.outerHeight() - 20;
 
            if( pos_left < 0 )
            {
                pos_left = target.offset().left + target.outerWidth() / 2 - 20;
                tooltip.addClass( 'left' );
            }
            else
                tooltip.removeClass( 'left' );
 
            if( pos_left + tooltip.outerWidth() > $( window ).width() )
            {
                pos_left = target.offset().left - tooltip.outerWidth() + target.outerWidth() / 2 + 20;
                tooltip.addClass( 'right' );
            }
            else
                tooltip.removeClass( 'right' );
 
            if( pos_top < 0 )
            {
                var pos_top  = target.offset().top + target.outerHeight();
                tooltip.addClass( 'top' );
            }
            else
                tooltip.removeClass( 'top' );
 
            tooltip.css( { left: pos_left, top: pos_top } )
                   .animate( { top: '+=10', opacity: 1 }, 50 );
        };
 
        init_tooltip();
        $( window ).resize( init_tooltip );
 
        var remove_tooltip = function()
        {
            tooltip.animate( { top: '-=10', opacity: 0 }, 50, function()
            {
                $( this ).remove();
            });
 
            target.attr( 'title', tip );
        };
 
        target.bind( 'mouseleave', remove_tooltip );
        tooltip.bind( 'click', remove_tooltip );
    });
});


//DEAKTIVERT PGA PROBLEMER I FIREFOX
//hvilke sider hvor det skal være lov å sveipe mot høyre/venstre

/*<--FJERN DENNE KOMMENTAREN FOR Å BRUKE 1/2
$(document).on('swipeleft', '.ui-page', function (event) {
    if (event.handled !== true) {
		//om det er første gang brukeren er på siden
        var forste = JSON.parse(localStorage.getItem('forste'));
		//hva som er neste side
        var nesteside = $.mobile.activePage.next('[data-role="page"]');
		//hvilken side brukeren er på akkurat nå
        var aktiv = $.mobile.pageContainer.pagecontainer("getActivePage");
        var aktivId = aktiv[0].id;
		//vindu størrelse
		var bredde=$(document).width();
        var side;
		//hvis introduksjonen ikke er ferdig blir sveiping deaktivert på forsiden
        if (+forste === 1) {
            side = 'tittelside';
        } else {
            side = 'ingen';
        }

        if (nesteside.length > 0 && aktivId !== 'introside' && aktivId !== 'starteoving' && aktivId !== 'fortsettoving' && aktivId !== 'avbryteoving' && aktivId !== 'kontakt' && aktivId !== 'oss' && aktivId !== 'popup-om-appen' && aktivId !== 'grafpop' && aktivId !== 'evalpopup' && aktivId !== 'planpopup' && aktivId !== 'ovingpopup' && bredde <=800) {
            $.mobile.changePage(nesteside, {
                transition: "slidefade",
                reverse: false
            }, true, true);
        }
        event.handled = true;
    }
    return false;
});

//Sveiping bakover
$(document).on('swiperight', '.ui-page', function (event) {
    if (event.handled !== true) {
        var forrigeside = $(this).prev('[data-role="page"]');
        var aktiv = $.mobile.pageContainer.pagecontainer("getActivePage");
        var aktivId = aktiv[0].id;
		var bredde=$(document).width();
		
        if (forrigeside.length > 0 && aktivId !== 'introside' && aktivId !== 'starteoving' && aktivId !== 'fortsettoving' && aktivId !== 'avbryteoving' && aktivId !== 'kontakt' && aktivId !== 'oss' && aktivId !== 'popup-om-appen' && aktivId !== 'grafpop' && aktivId !== 'evalpopup' && aktivId !== 'planpopup' && aktivId !== 'ovingpopup' && bredde <=800) {
            $.mobile.changePage(forrigeside, {
                transition: "slidefade",
                reverse: true
            }, true, true);
        }
        event.handled = true;
    }
    return false;
}); 
 FJERN DENNE KOMMENTAREN FOR Å BRUKE 2/2 --> */