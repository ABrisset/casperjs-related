// on instancie Casper
var casper = require('casper').create({
    verbose: true,
});

// on récupère l'argument
var query  = casper.cli.get(0);


// on crée la fonction de scrape
function getRelated() {
    var queries = document.querySelectorAll('.msrl a');
    return Array.prototype.map.call(queries, function(e) {
        return e.text;
    });
}

// on quitte si aucun argument n'est fourni
if (!query) {
    casper.echo('Tu as oublié le mot-clé !').exit(1);
}

// on recherche le mot-clé sur Google
casper.start('http://www.google.fr/', function() {
    this.fillSelectors('form[action="/search"]', {
        'input[name="q"]': query,
    }, true);
});

// on attend une seconde puis on lance le scrape
casper.wait(1000, function() {
    queries = this.evaluate(getRelated);
});

// on affiche les résultats en console
casper.run(function() {
    this.echo(queries.length + ' recherches associées à ' + '"' + query + '"');
    if (queries.length > 1) {
        this.echo(' • ' + queries.join('\n • ')).exit();
    }
    else {
        this.echo('Essaie un autre mot-clé !').exit();
    }
});