"use strict";
Package("com.qcobjects.services.github", [
  class GitHubService extends JSONService {
    name = "myservice";
    external = true;
    cached = false;
    method = "GET";
    headers = { "Content-Type": "application/json" };
    url = "https://api.github.com/orgs/QuickCorp/repos";
    withCredentials = false;

    done ({ request, service }) {
      logger.debug(request);
      const result = JSON.parse(service.template).reverse().map(function (project) {
        return {
          id: project.id,
          description: project.description,
          title: project.name,
          url: project.html_url,
          image: `https://via.placeholder.com/150/000000/FFFFFF?text=${encodeURI(project.name)}`
        };
      });

      service.template = JSON.stringify({
        result
      });
      return super.done(...arguments);
    }
  },

  class GitHubTagService extends JSONService {
    name = "myservice";
    external = true;
    cached = false;
    method = "GET";
    headers = { "Content-Type": "application/json" };
    url = "https://api.github.com/search/repositories?q=qcobjects";
    withCredentials = false;

    done ({ request, service }) {
      logger.debug(request);
      const result = JSON.parse(service.template).items.map(function (project) {
        return {
          id: project.id,
          description: project.description,
          title: project.name,
          url: project.html_url,
          image: `https://via.placeholder.com/150/000000/FFFFFF?text=${encodeURI(project.name)}`
        };
      });

      service.template = JSON.stringify({
        result
      });
      return super.done(...arguments);
    }
  },

  Class("QCObjectsVersionService", Service, {
    name: "qcobjects_version_service",
    external: true,
    cached: false,
    method: "GET",
    headers: { "Content-Type": "application/json" },
    url: "https://api.github.com/repos/QuickCorp/QCObjects/tags",
    withCredentials: false,
    _new_: () => {
      // service instantiated
    },
    done: ({ service }) => {
      const latest = JSON.parse(service.template)[0];
      service.template = {
        version: latest.name
      };
    }
  }),
  Class("QCObjectsStarsForksService", Service, {
    name: "qcobjects_stars_forks_service",
    external: true,
    cached: false,
    method: "GET",
    headers: { "Content-Type": "application/json" },
    url: "https://api.github.com/repos/QuickCorp/QCObjects",
    withCredentials: false,
    _new_: () => {
      // service instantiated
    },
    done: ({ service }) => {
      const repo = JSON.parse(service.template);
      service.template = {
        forks: repo.forks_count,
        stars: repo.stargazers_count,
        watchers: repo.watchers_count,
        size: Math.round(repo.size / 1000)
      };
    }
  })

]);
