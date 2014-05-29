var casper = require('casper').create({
    verbose: true,
});
var query  = casper.cli.get(0);

function getRelated() {
    var queries = document.querySelectorAll('.msrl a');
    return Array.prototype.map.call(queries, function(e) {
        return e.text;
    });
}

if (!query) {
    casper.echo('Tu as oublié le mot-clé !').exit(1);
}

casper.start('http://www.google.fr/', function() {
    this.fillSelectors('form[action="/search"]', {
        'input[name="q"]': query,
    }, true);
});

casper.wait(1000, function() {
    queries = this.evaluate(getRelated);
});


casper.run(function() {
    this.echo(queries.length + ' recherches associées à ' + '"' + query + '"');
    if (queries.length > 1) {
        this.echo(' • ' + queries.join('\n • ')).exit();
    }
    else {
        this.echo('Essaie un autre mot-clé !').exit();
    }
});