import api from "./api";
class App {
  constructor() {
    this.repositories = [];
    this.inputEl = document.querySelector("input[name=repository]");
    this.formEl = document.getElementById("repo-form");
    this.listEl = document.getElementById("repo-list");

    this.registerHandlers();
  }

  registerHandlers() {
    this.formEl.onsubmit = e => this.addRepository(e);
  }
  setLoading(loading = true) {
    if (loading === true) {
      let loadingEl = document.createElement("span");
      loadingEl.appendChild(document.createTextNode("Carregando..."));
      loadingEl.setAttribute("id", "loading");
      this.formEl.appendChild(loadingEl);
    } else {
      document.getElementById("loading").remove();
    }
  }
  async addRepository(e) {
    e.preventDefault();

    const repoInput = this.inputEl.value;

    if (repoInput.length === 0) return;
    this.setLoading(true);
    try {
      const response = await api.get(`/repos/${repoInput}`);

      const {
        name,
        description,
        html_url,
        owner: { avatar_url }
      } = response.data;

      console.log(response);

      this.repositories.push({
        name,
        description,
        avatar_url,
        html_url
      });

      this.inputEl.value = "";
      this.render();
    } catch (err) {
      console.log(`Repositório inexistente! ${err}`);
    }
    this.setLoading(false);
  }

  render() {
    this.listEl.innerHTML = "";
    this.repositories.forEach(repo => {
      let imgEl = document.createElement("img");
      imgEl.setAttribute("src", repo.avatar_url);

      let titleEl = document.createElement("strong");
      titleEl.appendChild(document.createTextNode(repo.name));

      let descriptionEl = document.createElement("p");
      descriptionEl.appendChild(document.createTextNode(repo.description));

      let avatarEl = document.createElement("img");
      avatarEl.appendChild(document.createTextNode(repo.avatar_url));

      let linkEl = document.createElement("a");
      linkEl.setAttribute("target", "_blank");
      linkEl.setAttribute("href", repo.html_url);
      linkEl.appendChild(document.createTextNode("Acessar"));

      let listItemEl = document.createElement("li");
      listItemEl.appendChild(imgEl);
      listItemEl.appendChild(titleEl);
      listItemEl.appendChild(descriptionEl);
      listItemEl.appendChild(linkEl);

      this.listEl.appendChild(listItemEl);
    });
  }
}

new App();
