function getContributors(){
let article = document.querySelector(".sc-cxNHIi.gBgWTN");
let editPage = document.querySelector(".sc-bdnxRM.keyIxl");
let filepath = editPage.getAttribute('href');
filepath = filepath.substr(filepath.indexOf('main/') + 5);

fetch("https://api.github.com/repos/mcjava-wiki/mcjava-wiki/commits?path=" + filepath)
    .then(response => response.json())
    .then(commits => {
        let contributors = [];
        for (let i = 0; i < commits.length; i++) {
            if (commits[i].author && commits[i].author.login && contributors.filter(value => value.login === commits[i].author.login).length === 0) {
                contributors.push(commits[i].author);
            }
        }

        if (contributors.length > 0) {
            let contrib = document.createElement("div");
            contrib.id = "contrib-title";
            let title = document.createElement('h3');
            title.innerText = "Page contributors";
            contrib.append(title);
            contrib.setAttribute("style", "margin-top:48px;")
            let grid = document.createElement("div");
            grid.id = "contributors";
            grid.setAttribute("style", "margin-top:8px;display:flex;flex-direction:row;")
            for (const contributor of contributors) {
                let cont = document.createElement("img");
                cont.setAttribute("src", contributor.avatar_url);
                cont.setAttribute("alt", contributor.login);
                cont.setAttribute("style", "height:2.5rem;")
                let a = document.createElement("a");
                a.setAttribute("href", contributor.html_url);
                a.setAttribute("alt", contributor.login);
                a.setAttribute("target", "_blank");
                a.append(cont);
                grid.append(a);
            }
            article.append(contrib);
            article.append(grid);
        }
    })
}

if (document.querySelector(".sc-cxNHIi.gBgWTN") && document.querySelector(".sc-bdnxRM.keyIxl")) {
    getContributors();
    console.log("Update contribs!")
}

(function(history){
    var pushState = history.pushState;
    history.pushState = function(state) {
        if (document.querySelector(".sc-cxNHIi.gBgWTN") && document.querySelector(".sc-bdnxRM.keyIxl")) {
            var ctitle = document.getElementById( 'contrib-title' );
            ctitle.parentNode.removeChild( ctitle );
            var ctrib = document.getElementById( 'contributors' );
            ctrib.parentNode.removeChild( ctrib );
            getContributors();
            console.log("Update contribs and remove old!")
        }
      return pushState.apply(history, arguments);
    };
})(window.history);