window.onload = function (e) {
    //sjekker om local storage er tilgjengelig i nettleseren
    if (window.localStorage !== 'undefined') {
        document.body.style.backgroundColor = '#07b2dc';
        //hvis øvingsobjektene ikke er lagret i local storage vil det si at det er første gang brukeren besøker siden (hvis ikke lagringen er deaktivert...)
        //og funksjoner for å lagre innhold, skjule/vise første gang osv. kjøres
        if (localStorage.getItem('ovinger') === null) {
            forstegang();
            settinnheader();
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
            setTimeout(lagdagliste("plan-dag", "plan-mnd", "plan-aar", 0), 900);
            opphavsrettdato();
            skjulforstegang();
            $('div[data-role="page"]').bind('pageshow', function () {
                document.title = "Sosialapp"
            });
        } else {
            //hvis øvingsobjektet finnes, hentes innhold i local storage og funksjoner for å oppdatere innstillinger, lister osv. kjøres
            //localStorage.clear();
            $('div[data-role="page"]').bind('pageshow', function () {
                document.title = "Sosialapp"
            });
            var ovingsinstillinger = JSON.parse(localStorage.getItem('ovingsinstillinger'));
            settinnheader();
            var neste = JSON.parse(localStorage.getItem('neste'));
            var forste = JSON.parse(localStorage.getItem('forste'));

            setverdi("velgsammetid", ovingsinstillinger);
            if (parseInt(ovingsinstillinger) === 0) {
                document.getElementById("plan-sammetid").style.display = 'block';
            } else {
                document.getElementById("plan-sammetid").style.display = 'none';
            }

            var lydklipp = document.getElementById("lydklipp1");
            lydklipp.addEventListener("timeupdate", fremdriftLyd, false);
            lydklipp.addEventListener("ended", klippSlutt, false);

            var lyd = JSON.parse(localStorage.getItem('lydklipp'));
            if (parseInt(lyd) === 1) {
                document.getElementById("ovingvalg1").style.display = 'block';
                document.getElementById("ovingvalg0").style.display = 'none';
                setverdi("velg-lyd", lyd);
            } else {
                document.getElementById("ovingvalg0").style.display = 'block';
                document.getElementById("ovingvalg1").style.display = 'none';
                setverdi("velg-lyd", lyd);
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
            lagtimeliste("plan-time", 'n');
            lagminuttliste("plan-minutt", 'n');
            lagtimeliste("plan-time-oving", 'n');
            setTimeout(lagminuttliste("plan-minutt-oving", 'n'), 100);
            setTimeout(lagaarliste("plan-aar", 0), 200);
            setTimeout(lagmndliste("plan-mnd", "plan-aar", 0), 500);
            setTimeout(lagdagliste("plan-dag", "plan-mnd", "plan-aar", 0), 900);
            opphavsrettdato();
            nesteoving(neste);
            sendtilphp();
            if (+forste === 1) {
                skjulforstegang();
            } else {
                visetterforstegang();
            }
            console.log(forste);
            window.applicationCache.addEventListener('updateready', onUpdateReady);
            if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
                onUpdateReady();
            }

        }

    } else {
        alert("Sosialapp vil ikke virke i denne nettleseren. Oppgrader nettleseren eller bruk en annen nettleser");
    }
};

//******************************************************************************************	
//*********************************** Førstegangs visning av forside ***********************
//******************************************************************************************
//hvis sosapp.appcache er endret siden sist gang brukeren åpnet appen,vises en meldingsboks om at en oppdatert versjon av appen er tilgjengelig.
function onUpdateReady() {
    alert("Sosialapp vil oppdateres neste gang du laster om siden");

}

//registrerer at brukeren er ferdig med førstegangs-introduksjonen	
function setforste() {
    var forste = 0;
    localStorage.setItem('forste', JSON.stringify(forste));
    visetterforstegang();
}

//hva som skal vises og skjules når brukeren ser tittelsiden for første gang
function skjulforstegang() {
    "use strict";
    document.getElementById("sisteaktivitet-forside").style.display = 'none';
    document.getElementById("antdag-forside").style.display = 'none';
    document.getElementById("status-dager-forside-overskrift").style.display = 'none';
    document.getElementById("status-graf-forside-overskrift").style.display = 'none';
    document.getElementById("status-graf-forside").style.display = 'none';
    document.getElementById("antdag").style.display = 'none';
    document.getElementById("status-dager-eval-overskrift").style.display = 'none';
    document.getElementById("status-graf-eval-overskrift").style.display = 'none';
    document.getElementById("status-graf-eval").style.display = 'none';
    document.getElementById("ovingside-utforte").style.display = 'none';
    document.getElementById("ovingside-nesteoving").style.display = 'none';
    document.getElementById("forside-menyknapp").style.display = 'none';
    lagvelkomst();
    document.getElementById("forside-startknapp").style.display = 'block';
    document.getElementById("velkomsttekst1").style.display = 'block';
    document.getElementById("velkomsttekst2").style.display = 'block';
    document.getElementById("forside-neste-link").style.display = 'none';
}

//lager velkomsttekst og knapp som vises første gang brukeren åpner appen
function lagvelkomst() {
    var vt1 = '<p style="font-size:1.5em">Velkommen til <span class="spantekst">Sosialapp</span>!</p>' + '<p style="float:left;word-wrap:break-word">En app for å øve <span class="spantekst">oppmerksomhet</span>' + ' laget for deg som har <span class="spantekst">sosial angst</span> og som mottar behandling ved ' + '<span class="spantekst">eMeistring</span>.</p>';

    var vt2 = '<p style="font-size:1.5em">Tilgjengelig der du er</p>' + '<p style="float:left;word-wrap:break-word">Med denne appen har du øvelsen tilgjengelig på din ' + '<span class="spantekst">mobil, nettbrett eller PC</span>. Trykk på <span class="spantekst">knappen over </span>for å starte!</p>';

    var startknapp = '<a href="#turslide1" data-role="button" class="ui-btn ui-btn-b"><i class="fa fa-play fa-inverse fa-4x"></i></a>';

    document.getElementById("velkomsttekst1").innerHTML = vt1;
    document.getElementById("velkomsttekst2").innerHTML = vt2;
    document.getElementById("forside-startknapp").innerHTML = startknapp;
}

//fjerner velkomsttekst og knapp som vises første gang brukeren åpner appen
function fjernvelkomst() {
    var vt1 = '';
    var vt2 = '';
    var startknapp = '';

    document.getElementById("forside-startknapp").innerHTML = vt1;
    document.getElementById("velkomsttekst1").innerHTML = vt2;
    document.getElementById("velkomsttekst2").innerHTML = startknapp;
}

//hva som skal vises og skjules når brukeren er ferdig med førstegangs-introduksjonen
//skjulte elementer som skal vises	
function visetterforstegang() {
    "use strict";
    lagforsideinnhold();
    document.getElementById("sisteaktivitet-forside").style.display = 'block';
    document.getElementById("antdag-forside").style.display = 'block';
    document.getElementById("status-dager-forside-overskrift").style.display = 'block';
    document.getElementById("status-graf-forside-overskrift").style.display = 'block';
    document.getElementById("status-graf-forside").style.display = 'block';
    document.getElementById("antdag").style.display = 'block';
    document.getElementById("status-dager-eval-overskrift").style.display = 'block';
    document.getElementById("status-graf-eval-overskrift").style.display = 'block';
    document.getElementById("status-graf-eval").style.display = 'block';
    document.getElementById("ovingside-utforte").style.display = 'block';
    document.getElementById("ovingside-nesteoving").style.display = 'block';
    document.getElementById("forside-menyknapp").style.display = 'block';
    fjernvelkomst();
    document.getElementById("forside-startknapp").style.display = 'none';
    document.getElementById("velkomsttekst1").style.display = 'none';
    document.getElementById("velkomsttekst2").style.display = 'none';
    document.getElementById("forsidemenystor").style.display = 'block';
    document.getElementById("forside-neste-link").style.display = 'block';
    statustimer();
}
//nye elementer
function lagforsideinnhold() {
    var knapp = '<a href="#menypanel" id="storforsideknapp" class="ui-btn ui-btn-b"><i class="fa fa-bars fa-inverse fa-4x"></i></a>';
    var dager = 'Antall dager';
    var oppmtekst = 'Oppmerksomhet';
    var oppmgraf = '<a href="#grafpop" data-transition="pop" class="statusgraf" data-role="none" onClick="graf()"><i class="fa fa-bar-chart statusgraf"></i></a>';
    document.getElementById("forside-menyknapp").innerHTML = knapp;
    document.getElementById("status-dager-forside-overskrift").innerHTML = dager;
    document.getElementById("status-graf-forside-overskrift").innerHTML = oppmtekst;
    document.getElementById("status-graf-forside").innerHTML = oppmgraf;
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
    console.log(JSON.parse(localStorage.getItem('ovinger')));
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
//******************************** Introduksjonsanimasjon ***********************************
//*******************************************************************************************
//variabler som brukes av introduksjonen
var intropause = 0;
var introfremdrift = 0;

function startintro() {
    document.getElementById("intro0").style.display = 'none';
    introvent(1);
}

function introvent(x) {
    if (x > 20 && +intropause === 0) {
        document.getElementById("intro0").style.display = 'block';
        $("#intro0").fadeIn();
        $("#intro20").fadeOut();
        document.getElementById("intro20").style.display = 'none';
        document.getElementById("intro-fremdrift").value = "0";
        document.getElementById("turslideslutt").disabled = false;
    } else if (+intropause === 0) {
        document.getElementById("intro" + x).style.display = 'block';
        $("#intro" + x).fadeIn();
        $("#intro" + (x - 1)).fadeOut();
        document.getElementById("intro" + (x - 1)).style.display = 'none';
        setTimeout(function () {
            fortsettintro(+x + 1);
        }, 10000);
    }
}

function fortsettintro(y) {
    for (var i = y; i < 22; i++) {
        introfremdrift = ((i - 1) / 20) * 100;
        document.getElementById("intro-fremdrift").value = introfremdrift;
        introvent(i);
        break;
    }
}

function pauseintro(z) {
    document.getElementById("intro" + z).style.display = 'none';
    $("#intro-sekvens").append("<img id='intropausebilde' src='images/oving-gif/pause.png' onClick='introetterpause(" + z + ")' />");
    intropause = 1;
}

function introetterpause(z) {
    $("#intropausebilde").remove();
    intropause = 0;
    fortsettintro(z);
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
    var valg = document.getElementById("velg-lyd").value;
    localStorage.setItem('lydklipp', JSON.stringify(valg));
    if (parseInt(valg) === 1) {
        document.getElementById("ovingvalg1").style.display = 'block';
        document.getElementById("ovingvalg0").style.display = 'none';
    } else {
        document.getElementById("ovingvalg0").style.display = 'block';
        document.getElementById("ovingvalg1").style.display = 'none';
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

    for (var i = 0; i < 5; i++) {
        document.getElementById("footerside" + (i + 1)).innerHTML = "<a href='#popup-om-appen' data-transition='pop' style='color:#666666;text-decoration:none;' data-role='none'>" + "<i class='fa fa-copyright' style='font-size:1.3em'></i> <span class='elogo1' style='padding-right:0.1em'>  e</span><span class='elogo2'>Meistring  </span>" + "<span style='font-size:1.3em'>" + aarnaa + "</span></a>";
        document.getElementById("footerside" + (i + 1) + "alt").innerHTML = "<a href='#popup-om-appen' data-transition='pop' style='color:#666666;text-decoration:none;' data-role='none'>" + "<i class='fa fa-copyright' style='font-size:1.3em'></i><span class='elogo1' style='padding-right:0.1em'>  e</span><span class='elogo2'>Meistring  </span>" + "<span style='font-size:1.3em'>" + aarnaa + "</span></a>";
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
        feilbakgr = '2px solid #f18b78';
    } else if (+mnd < +idag.getMonth() && +aar === +idag.getFullYear()) {
        feiltekst = "<i class='fa fa-times-circle'></i> Datoen er tilbake i tid. Vennligst velg en annen dato.";
        feilbakgr = '2px solid #f18b78';
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
    var timeliste = "";

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
    var minuttliste = "";

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

//*******************************************************************************************	
//*********************************** Dialogbokser ******************************************
//*******************************************************************************************

//setter inn innhold i planleggingsdialog-boksen	
function lagplanleggingspopup(knappid) {
    "use strict";
    var ovinger = JSON.parse(localStorage.getItem('ovinger'));
    lagtimeliste("plan-time-oving", 'n');
    lagminuttliste("plan-minutt-oving", 'n');
    document.getElementById("plandagoverskrift").innerHTML = "Planlegg dag " + knappid;
    document.getElementById("plan-oving-dag-knapp").innerHTML = '<a href="#" id="plan-dag' + knappid + '-send" class="ui-btn uit-corner-all ui-shadow ui-btn-c ui-btn-icon-left ui-icon-check" onClick="lagreenplan(' + knappid + ')">Lagre instillinger</a>';
    document.getElementById("plan-dialg-tekstfelt").innerHTML = "<input class='ui-bar ui-body-e' name='plan-sted-oving" + knappid + "' id='plan-sted-oving" + knappid + "' value='" + ovinger[knappid - 1].sted + "' onkeypress='{if (event.keyCode==13)lagreenplan(" + knappid + ")}' type='text' placeholder='f.eks. hjemme...'>";
}

//setter inn innhold i øvingsdialog-boksen	
function lagovingspopup(knappid) {
    $("body").on("pagecontainershow", function (event, ui) {
        if (ui.toPage.prop("id") == "ovingpopup") {
            erbrukeronline();
            document.getElementById("ovingoverskrift").innerHTML = "Øvelse dag " + knappid;
            document.getElementById("ferdigknappoving").innerHTML = '<a href="#" data-rel="back" id="ovingferdig' + knappid + '" class="ui-btn uit-corner-all ui-shadow ui-btn-b ui-btn-icon-right ui-icon-check" onClick="lagreOving(' + knappid + ')">Lagre</a>';
        }
    });
}

//setter inn innhold i evalueringsdialog-boksen	
function lagevalpopup(knappid) {
    "use strict";
    var ovinger = JSON.parse(localStorage.getItem('ovinger'));
    document.getElementById("evaloverskrift").innerHTML = "Evaluering dag " + knappid;
    document.getElementById("visevalfor").value = parseInt(ovinger[knappid - 1].evalfor) + 3;
    //document.getElementById("visevalnrfor").innerHTML = ovinger[knappid - 1].evalfor;
    document.getElementById("visevaletter").value = parseInt(ovinger[knappid - 1].evaletter) + 3;
    //document.getElementById("visevalnretter").innerHTML = ovinger[knappid - 1].evaletter;
}

//*******************************************************************************************	
//*********************************** Øving med lyd *****************************************
//*******************************************************************************************

//hva som skal skje når en trykker på 'neste' knappene i øvingsdialogen
function ovingnesteknapp(knappnr) {
    "use strict";
    var lydklipp = document.getElementById("lydklipp1");
    if (knappnr === 1) {
        document.getElementById("blokk1").innerHTML = "<div class='ui-bar ui-bar-b' style='height:25px;text-align:center;background-color:#f18b78;' id='visdel1'>Før</div>";
        document.getElementById("blokk2").innerHTML = "<div class='ui-bar ui-bar-b' style='height:25px;text-align:center;background-color:#f18b78;' id='visdel2'>Øvelse</div>";
        document.getElementById("tab2").style.display = 'block';
        document.getElementById("tab1").style.display = 'none';
        document.getElementById("tab3").style.display = 'none';
    } else {
        document.getElementById("blokk2").innerHTML = "<div class='ui-bar ui-bar-b' style='height:25px;text-align:center;background-color:#f18b78;' id='visdel2'>Øvelse</div>";
        document.getElementById("blokk3").innerHTML = "<div class='ui-bar ui-bar-b' style='height:25px;text-align:center;background-color:#f18b78;' id='visdel3'>Etter</div>";
        document.getElementById("tab3").style.display = 'block';
        document.getElementById("tab2").style.display = 'none';
        document.getElementById("tab1").style.display = 'none';
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
    $("#velg-lyd").flipswitch("disable");
    var lydklipp = document.getElementById("lydklipp1");
    //hvis klippet står på pause setter neste klikk på knappen i gang avspilling
    if (lydklipp.paused) {
        document.getElementById("spillav").innerHTML = "<button class='ui-btn ui-btn-b' id='spillavlydklipp' onClick='spillavLyd()'><i class='fa fa-pause fa-2x'></i></button>";
        lydklipp.play();
    }
    //hvis klippet spiller setter neste klikk på knappen klippet på pause
    else {
        document.getElementById("spillav").innerHTML = "<button class='ui-btn ui-btn-b' id='spillavlydklipp' onClick='spillavLyd()'><i class='fa fa-play fa-2x'></i></button>";
        lydklipp.pause();
    }
}

//hva som skal skje når et lydklipp er ferdig (aktiverer 'neste' knapp, og velgeren for lydklipp)
function klippSlutt() {
    "use strict";
    document.getElementById("spillav").innerHTML = "<button class='ui-btn ui-btn-b'><i class='fa fa-play fa-2x'></i></button>";
    document.getElementById("nesteknapp2").disabled = false;
    $("#velg-lyd").flipswitch("enable");
    document.getElementById("spillerfremdrift").value = 0;
    document.getElementById("spillerfremdrift-etter").innerHTML = "";
}


//lager fremdriftslinje for avspilling av lydklipp
function fremdriftLyd() {
    "use strict";
    var lydklipp = document.getElementById("lydklipp1");
    var verdi = 0;

    if (lydklipp.currentTime > 0) {
        verdi = Math.floor((100 / lydklipp.duration) * lydklipp.currentTime);
    }
    var lydtotal = (lydklipp.duration / 60).toFixed(2);
    var lydnaa = (lydklipp.currentTime / 60).toFixed(2);
    document.getElementById("spillerfremdrift").value = verdi;
    document.getElementById("spillerfremdrift-etter").innerHTML = "Spiller av " + lydnaa + " av " + lydtotal + " minutt";
}

//*******************************************************************************************	
//*********************************** Øving med bilde ***************************************
//*******************************************************************************************
//variabler som brukes av bilde-øvingen
var pause = 0;
var fremdrift = 0;
var symbolsynlig = 0;

//Øvingen starter når brukeren klikker på start-bildet
function startoving() {
    document.getElementById("sosoving0").style.display = 'none';
    bildevent(1);
}

//Sjekker om øving er ferdig eller satt på pause, viser gif-bildene i 12 sekund hver
function bildevent(x) {
    if (x > 43 && +pause === 0) {
        document.getElementById("sosoving0").style.display = 'block';
        $("#sosoving0").fadeIn();
        $("#sosoving43").fadeOut();
        document.getElementById("sosoving43").style.display = 'none';
        document.getElementById("hjelp").innerHTML = "Øvingen er ferdig";
        document.getElementById("ov-fremdrift").value = "0";
    } else if (+pause === 0) {
        document.getElementById("sosoving" + x).style.display = 'block';
        $("#sosoving" + x).fadeIn();
        $("#sosoving" + (x - 1)).fadeOut();
        document.getElementById("sosoving" + (x - 1)).style.display = 'none';
        hjelpetekst(x);
        setTimeout(function () {
            fortsettoving(+x + 1);
        }, 12000);
    }
}

//fortsette etter pause 
function fortsettoving(y) {
    for (var i = y; i < 45; i++) {
        fremdrift = ((i - 1) / 43) * 100;
        document.getElementById("ov-fremdrift").value = fremdrift;
        bildevent(i);
        break;
    }
}

//øving satt på pause når brukeren trykker på animasjonen
function pauseoving(z) {
    document.getElementById("sosoving" + z).style.display = 'none';
    $("#oving-sekvens").append("<img id='pausebilde' src='images/oving-gif/pause.png' onClick='startetterpause(" + z + ")' />");
    document.getElementById("hjelp").innerHTML = "Øvelsen er satt på pause. Trykk på bildet over for å fortsette.";
    pause = 1;
}

//stopper øvingen når brukeren går vekk fra skjermbildet
function stoppoving() {
    for (var i = 0; i < 44; i++) {
        if (document.getElementById("sosoving" + i).style.display === 'block') {
            document.getElementById("sosoving" + i).style.display = 'none';
        }
    }
    document.getElementById("sosoving0").style.display = 'block';
    document.getElementById("hjelp").innerHTML = "Trykk på bildet over for å starte øvingen";
    pause = 0;
    fremdrift = 0;
}

//når bruker trykker på pausebildet
function startetterpause(z) {
    $("#pausebilde").remove();
    pause = 0;
    fortsettoving(z);
    hjelpetekst(z);
}

//hjelpeteksten som vises under øvingsanimasjon
function hjelpetekst(z) {
    tekst = "";
    if (z === 1) {
        tekst = "";
        $("#velg-lyd").flipswitch("disable");
    }
    if (z === 2) {
        tekst = "(Gjør deg klar til å starte øvingen)";
    }
    if (z === 3 || z === 23) {
        tekst = "Fokuser på alle typer lyder foran deg";
    } else if (z === 4 || z === 24) {
        tekst = "Fokuser på alle typer lyder til høyre for deg";
    } else if (z === 5 || z === 25) {
        tekst = "Fokuser på alle typer lyder til venstre for deg";
    } else if (z === 6 || z === 26) {
        tekst = "Fokuser på alle typer lyder bak deg";
    } else if (z === 7 || z === 27) {
        tekst = "Fokuser på alle typer lyder i alle retninger rundt deg";
    } else if (z === 8 || z === 28) {
        tekst = "Fokuser på lyder fra natur foran deg (dyr, vind, regn...)";
    } else if (z === 9 || z === 29) {
        tekst = "Fokuser på lyder fra natur til høyre for deg (dyr, vind, regn...)";
    } else if (z === 10 || z === 30) {
        tekst = "Fokuser på lyder fra natur til venstre for deg (dyr, vind, regn...)";
    } else if (z === 11 || z === 31) {
        tekst = "Fokuser på lyder fra natur bak deg (dyr, vind, regn...)";
    } else if (z === 12 || z === 32) {
        tekst = "Fokuser på lyder fra natur i alle retninger rundt deg (dyr, vind, regn...)";
    } else if (z === 13 || z === 33) {
        tekst = "Fokuser på mekaniske lyder foran deg (biler, maskiner...)";
    } else if (z === 14 || z === 34) {
        tekst = "Fokuser på mekaniske lyder til høyre for deg (biler, maskiner...)";
    } else if (z === 15 || z === 35) {
        tekst = "Fokuser på mekaniske lyder til venstre for deg (biler, maskiner...)";
    } else if (z === 16 || z === 36) {
        tekst = "Fokuser på mekaniske lyder bak deg (biler, maskiner...)";
    } else if (z === 17 || z === 37) {
        tekst = "Fokuser på mekaniske lyder i alle retninger rundt deg (biler, maskiner...)";
    } else if (z === 18 || z === 38) {
        tekst = "Fokuser på lyder fra andre mennesker foran deg (stemmer, fottrinn..)";
    } else if (z === 19 || z === 39) {
        tekst = "Fokuser på lyder fra andre mennesker til høyre for deg (stemmer, fottrinn..)";
    } else if (z === 20 || z === 40) {
        tekst = "Fokuser på lyder fra andre mennesker til venstre for deg (stemmer, fottrinn..)";
    } else if (z === 21 || z === 41) {
        tekst = "Fokuser på lyder fra andre mennesker bak deg (stemmer, fottrinn..)";
    } else if (z === 22 || z === 42) {
        tekst = "Fokuser på lyder fra andre mennesker i alle retninger rundt deg (stemmer, fottrinn..)";
    } else if (z === 43) {
        tekst = "( Øvelsen er ferdig. Trykk på 'Neste' knappen under for å fortsette. )";
        document.getElementById("nesteknapp2").disabled = false;
        $("#velg-lyd").flipswitch("enable");
    }
    document.getElementById("hjelp").innerHTML = tekst;
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
    for (var i = 0; i < ovinger.length; i++) {
        var m = ovinger[i].datomnd;
        var mnd = talltilmnd(parseInt(m));
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

        //legger til øvinger i listen dersom de ikke er utførte og brukeren har valgt å planlegge øvingene individuelt
        if (ovinger[i].utfort === 0 && ovingsinstillinger === 1) {
            planliste1 += "<li><a href='#planpopup' onClick='lagplanleggingspopup(" + ovinger[i].dag + ")' id='popup-planlegg" + ovinger[i].dag + "' data-transition='pop' class='ui-btn ui-btn-c ui-icon-carat-r ui-btn-icon-right'><div class='ovingdag'><div class='dag'>Dag</div><div class='dagnr'>" + ovinger[i].dag + "</div></div><div class='ovinginfo'><div class='ovinginfo-oppe'>" + dato + " kl: " + tid + " " + ovinger[i].sted + "</div><div class='ovinginfo-nede'>Planlegg øving</div></div></a></li>";
            planliste2 += "";
        }
        //legger til øvinger som deaktiverte i listen dersom de ikke er utførte og brukeren har valgt å planlegge alle øvinger samtidig
        else if (ovinger[i].utfort === 0 && ovingsinstillinger === 0) {
            planliste1 += "<li><a href='#planpopup' id='popup-planlegg" + ovinger[i].dag + "' class='ui-btn ui-btn-c ui-icon-carat-r ui-btn-icon-right ui-state-disabled'><div class='ovingdag'><div class='dag'>Dag</div><div class='dagnr'>" + ovinger[i].dag + "</div></div><div class='ovinginfo'><div class='ovinginfo-oppe'> " + dato + " kl: " + tid + " " + ovinger[i].sted + "</div><div class='ovinginfo-nede'>Planlegg øving</div></div></a></li>";
            planliste2 += "";
        }
        //legger til øvinger som deaktiverte nederst i listen dersom de er utførte
        else if (ovinger[i].utfort === 1) {
            planliste2 += "<li><a href='' id='popup-planlegg" + ovinger[i].dag + "' class='ui-btn ui-btn-d ui-icon-? ui-nodisc-icon ui-state-disabled''><div class='ovingdag'><div class='dag'>Dag</div><div class='dagnr'>" + ovinger[i].dag + "</div></div><div class='ovinginfo'>  <div class='ovinginfo-oppe'></div><div class='ovinginfo-nede'>Fullført øvelse</div></div></a></li>";
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
        if (ovinger[i].dag > 1) {
            forrigeovingferdig = ovinger[i - 1].utfort;
        } else {
            forrigeovingferdig = 1;
        }

        //legger til øving i listen dersom øvingen er aktivert og forrige øving er ferdig	
        if (+aktivert === 1 && +forrigeovingferdig === 1 && ovinger[i].utfort === 0) {
            ovingliste1 += "<li><a href='#ovingpopup' onClick='lagovingspopup(" + ovinger[i].dag + ")' id='popup-oving" + ovinger[i].dag + "' data-transition='pop' class='ui-btn ui-btn-b ui-icon-carat-r ui-btn-icon-right'><div class='ovingdag'><div class='dag'>Dag</div><div class='dagnr'>" + ovinger[i].dag + "</div></div><div class='ovinginfo'><div class='ovinginfo-oppe'> " + dato + " kl: " + tid + " " + ovinger[i].sted + "</div><div class='ovinginfo-nede'>Start øvelse</div></div></a></li>";
        }
        //legger til øving som deaktivert punkt i listen dersom den er utført
        else if (ovinger[i].utfort === 1) {
            ovingliste2 += "<li><a href='#' id='popup-oving" + ovinger[i].dag + "' class='ui-btn ui-btn-d ui-icon-? ui-nodisc-icon ui-state-disabled'><div class='ovingdag'><div class='dag'>Dag</div><div class='dagnr'>" + ovinger[i].dag + "</div></div><div class='ovinginfo'><div class='ovinginfo-oppe'></div><div class='ovinginfo-nede'>Fullført øvelse</div></div></a></li>";

        } else {
            ovingliste1 += "";
            ovingliste2 += "";
        }
    }
    document.getElementById("ovingsliste").innerHTML = ovingliste1 + ovingliste2;

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
            evalliste += "<li><a href='#evalpopup' onClick='lagevalpopup(" + ovinger[i].dag + ")' id='popup-eval" + ovinger[i].dag + "' data-transition='pop' class='ui-btn ui-btn-c ui-icon-? ui-nodisc-icon ui-btn-icon-right'><div class='ovingdag'><div class='dag'>Dag</div><div class='dagnr'>" + ovinger[i].dag + "</div></div><div class='ovinginfo'><div class='ovinginfo-oppe'></div><div class='ovinginfo-nede'>Se evaluering</div></div></a></li>";
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
            ovinger[i].datotime = time;
            ovinger[i].datominutter = minutter;
            ovinger[i].tid = time + ":" + minutter;
            ovinger[i].sted = sted;
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
            ovinger[i].datotime = time;
            ovinger[i].datominutter = minutter;
            ovinger[i].tid = time + ":" + minutter;
            ovinger[i].sted = sted;
            ovinger[i].planlagt = 1;
            ovinger[i].aktivert = 0;
            document.getElementById("feildato").innerHTML = "";
            localStorage.setItem('ovinger', JSON.stringify(ovinger));
            document.getElementById("erlagret").innerHTML = "<p>Endringene er lagret.</p>";
            lagplanliste();
            lagovingliste();
        } else if (+antall === 0 && +feild > 0) {
            document.getElementById("feildato").innerHTML = "Datoen er tilbake i tid. Vennligst velg en annen dato.";
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

    ovinger[knappid - 1].datotime = time;
    ovinger[knappid - 1].datominutter = minutter;
    ovinger[knappid - 1].tid = time + ":" + minutter;
    ovinger[knappid - 1].sted = sted;
    ovinger[knappid - 1].planlagt = 1;
    ovinger[knappid - 1].aktivert = 0;
    localStorage.setItem('ovinger', JSON.stringify(ovinger));
    /*document.getElementById("feiltid2").innerHTML = "";*/
    lagplanliste();
    lagovingliste();
    nesteoving(neste);
    document.getElementById("erlagret2").innerHTML = "<p>Endringene er lagret.</p>";
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
            ovinger[i].evalfor = document.getElementById("ovingevalfor").value;
            ovinger[i].evaletter = document.getElementById("ovingevaletter").value;
            ovinger[i].utfort = 1;
            ovinger[i].aktivert = 0;
            neste = i + 1;
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
    tabreset();
    sendtilphp();
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

    for (var i = 0; i < ovinger.length; i++) {
        if (ovinger[i].utfort === 1) {
            dager += 1;

        }
    }
    localStorage.setItem('antall', JSON.stringify(dager));
    document.getElementById("antdag").innerHTML = dager;
    document.getElementById("antdag-forside").innerHTML = dager;
    document.getElementById("ovingside-utforte").innerHTML = "Du har gjennomført <span class='spantekst'>" + dager + "</span> av <span class='spantekst'>7</span> dager.";
    if (+dager === 7) {
        document.getElementById("7dagerferdig").innerHTML = "Du har nå gjennomført 7 dager med oppmerksomhetsøvelser. Bra jobba!"
    }
}

//lager meldinger øverst på forsiden og på øvingssiden ang. neste øving
function nesteoving(neste) {
    "use strict";
    var ovinger = JSON.parse(localStorage.getItem('ovinger'));
    var dag = "";
    var tid = "";
    var dato = "";
    var sted = "";
    var idag = new Date();

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
            if (+aktivert === 1) {
                document.getElementById("sisteaktivitet-forside").innerHTML = "<a href='#ovingpopup' onClick='lagovingspopup(" + ovinger[i].dag + ")' data-role='none' style='color:#ffffff;text-decoration:none'><i class='fa fa-chevron-circle-right fa-2x' style='font-size:1em;'></i> En ny øvelse er tilgjengelig nå. <i class='fa fa-chevron-circle-right fa-2x' style='font-size:1em;'></i></a>";
                document.getElementById("ovingside-nesteoving").innerHTML = "Du har en planlagt øvelse som er tilgjengelig nå:";
                lagovingliste();
            }
            //hvis neste øving er i dag, og øvingen ikke er aktivert enda
            else if (+m === +idag.getMonth() && +y === +idag.getFullYear() && +dg === +idag.getDate() && +aktivert === 0) {
                document.getElementById("ovingside-nesteoving").innerHTML = "Neste øvelse: i dag kl: " + tid + " " + sted;
                document.getElementById("sisteaktivitet-forside").innerHTML = "Neste øvelse:<br/> i dag kl: " + tid + " " + sted;
                lagovingliste();
            }
            //hvis neste øving er lenger frem i tid
            else {
                document.getElementById("ovingside-nesteoving").innerHTML = "Neste øvelse: " + dato + " kl: " + tid + " " + sted;
                document.getElementById("sisteaktivitet-forside").innerHTML = "Neste øvelse:<br/> " + dato + " kl: " + tid + " " + sted;
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
        if (ui.toPage.prop("id") == "grafpop") {
            //grafen lages v.h.a. chart.js
            var ovinger = JSON.parse(localStorage.getItem('ovinger'));
            var antall = JSON.parse(localStorage.getItem('antall'));
            //data som skal være med i grafen 
            var data = {
                labels: [],
                datasets: [{
                    fillColor: "rgba(100,100,100,0.7)",
                    strokeColor: "rgba(100,100,100,0.5)",
                    highlightFill: "rgba(178,232,178,0.9)",
                    highlightStroke: "rgba(178,232,178,0.7)",
                    data: []
                }, {
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
    });
}
//tekst som skal være på vertikal akse på grafen
function evaltalltiltekst(tall) {
    "use strict";
    var evaltekst = "";
    switch (tall) {
        case -3:
            evaltekst = "Internt";
            break;
        case -2:
            evaltekst = "-";
            break;
        case -1:
            evaltekst = "-";
            break;
        case 0:
            evaltekst = "Nøytral";
            break;
        case 1:
            evaltekst = "-";
            break;
        case 2:
            evaltekst = "-";
            break;
        case 3:
            evaltekst = "Eksternt";
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
        $("#velg-lyd").flipswitch("enable");
    } else {
        document.getElementById("online-feilmelding").innerHTML = "<span class='spantekstfeil'><i class='fa fa-times-circle'></i> Øvelsen med lyd er ikke tilgjengelig fordi du ikke er koblet til Internett. Du kan enten gjøre den visuelle versjonen av øvelsen, eller gjøre øvelsen med lyd senere når du er tilkoblet til Internett. </span>";
        document.getElementById("spillavlydklipp").disabled = true;
        $("#velg-lyd").flipswitch("disable");
        document.getElementById("ovingvalg1").style.display = 'block';
        document.getElementById("ovingvalg0").style.display = 'none';
    }
}

//Setter inn header del med navigeringsmeny for større skjermer
function settinnheader() {
    var header = '<div class="ui-grid-b"><div class="ui-block-a"><div class="ui-bar ui-bar-a">' + '<div class="logotop">' + '<object type="image/svg+xml" data="images/soslogosvg.svg"><img src="images/soslogopng.png" alt="Sosialapp logo" />' + '</object>' + '</div></div></div>' + '<div class="ui-block-b"><div class="ui-bar ui-bar-a"></div></div>' + '<div class="ui-block-c"><div class="ui-bar ui-bar-a" style="padding-top:1em;">' + '<div class="menyside"><a href="#menypanel" style="text-decoration:none;" data-role="none"><i class="fa fa-bars fa-inverse fa-2x"></i></a></div>' + '</div></div></div>' + '<div data-role="navbar" data-theme="b" data-grid="d" class="meny-storskjerm">' + '<ul class="ui-body-b">' + '<li><a href="#tittelside" data-transition="fade" class="show-page-loading-msg" data-textonly="false" data-textvisible="true" data-msgtext="Laster siden" data-inline="true"><i class="fa fa-home fa-inverse fa-2x"></i><br/>Sosialapp</a></li>' + '<li><a href="#oss" data-transition="fade" class="show-page-loading-msg" data-textonly="false" data-textvisible="true" data-msgtext="Laster siden" data-inline="true"><i class="fa fa-info-circle fa-inverse fa-2x"></i><br/>Ofte stilte spørsmål</a></li>' + '<li><a href="#planlegging" data-transition="fade" class="show-page-loading-msg" data-textonly="false" data-textvisible="true" data-msgtext="Laster siden" data-inline="true" onClick="lagplanliste()"><i class="fa fa-clock-o fa-inverse fa-2x"></i><br/>Planlegging</a></li>' + '<li><a href="#ovelse" data-transition="fade" class="show-page-loading-msg" data-textonly="false" data-textvisible="true" data-msgtext="Laster siden" data-inline="true"><i class="fa fa-volume-up fa-inverse fa-2x"></i><br/>Øvelse</a></li>' + '<li><a href="#evaluering" data-transition="fade" class="show-page-loading-msg" data-textonly="false" data-textvisible="true" data-msgtext="Laster siden" data-inline="true"><i class="fa fa-check fa-inverse fa-2x"></i><br/>Evaluering</a></li>' + '</ul></div>';
    document.getElementById('header-intro').innerHTML = header;
    document.getElementById('header-plan').innerHTML = header;
    document.getElementById('header-ovelse').innerHTML = header;
    document.getElementById('header-eval').innerHTML = header;
    $("[data-role='navbar']").navbar();
}

// Oppdaterer navigeringsmeny for større skjermer når en bytter side
$(document).on("pageshow", "[data-role='page']", function () {
    var current = $(this).jqmData("title");
    $("[data-role='navbar'] a.ui-btn-active").removeClass("ui-btn-active");
    $("[data-role='navbar'] a").each(function () {
        if ($(this).text() === current) {
            $(this).addClass("ui-btn-active");
        }
    });
});

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
        /*stoppoving();*/
        tabreset();
    } else {
        document.getElementById("lydklipp1").pause();
        tabreset();
    }

});

//panelmenyen for små skjermer	
$(function () {
    "use strict";
    $("[data-role=panel]").panel().enhanceWithin();
});

//tilbakestiller tabvisningen og setter lydklipp på pause i øvings-dialogen
function tabreset() {
    "use strict";
    document.getElementById("blokk1").innerHTML = "<div class='ui-bar ui-bar-b' style='height:25px;text-align:center;background-color:#f18b78;' id='visdel1'>Før</div>";
    document.getElementById("blokk2").innerHTML = "<div class='ui-bar ui-bar-b' style='height:25px;text-align:center' id='visdel2'>Øvelse</div>";
    document.getElementById("blokk3").innerHTML = "<div class='ui-bar ui-bar-b' style='height:25px;text-align:center' id='visdel3'>Etter</div>";
    document.getElementById("tab1").style.display = 'block';
    document.getElementById("tab2").style.display = 'none';
    document.getElementById("tab3").style.display = 'none';
    document.getElementById("nesteknapp2").disabled = true;
}

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

        if (nesteside.length > 0 && aktivId !== 'evaluering' && aktivId !== 'turslide3' && aktivId !== 'turslide2' && aktivId !== 'turslide1' && aktivId !== 'popup-om-appen' && aktivId !== 'grafpop' && aktivId !== 'evalpopup' && aktivId !== 'planpopup' && aktivId !== 'ovingpopup' && aktivId !== side && bredde <=800) {
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
		
        if (forrigeside.length > 0 && aktivId !== 'turslide1' && aktivId !== 'turslide2' && aktivId !== 'turslide3' && aktivId !== 'popup-om-appen' && aktivId !== 'grafpop' && aktivId !== 'evalpopup' && aktivId !== 'planpopup' && aktivId !== 'ovingpopup' && bredde <=800) {
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