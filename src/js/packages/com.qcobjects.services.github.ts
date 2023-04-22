/* eslint-disable prefer-rest-params */
"use strict";
import { Package, JSONService, Service, logger, Class } from "qcobjects";

Package("com.qcobjects.services.github", [
  class GitHubService extends JSONService {
    /**
     * Name of the service
     * @date 18/04/2023 - 22:30:07
     *
     * @type {string}
     */
    name = "myservice";

    /**
     * It specifies if the service has a external url. If true, you can pass absolute urls in url property
     * @date 18/04/2023 - 22:30:37
     *
     * @type {boolean}
     */
    external = true;

    /**
     * If it is true, the service call will be cached
     * @date 18/04/2023 - 22:31:41
     *
     * @type {boolean}
     */
    cached = false;

    /**
     * It can be GET, POST, PUT
     * @date 18/04/2023 - 22:32:29
     *
     * @type {string}
     */
    method = "GET";

    /**
     * You can add special headers using this property
     * @date 18/04/2023 - 22:33:20
     *
     * @type {{ "Content-Type": string; }}
     */
    headers = { "Content-Type": "application/json" };

    /**
     * URL for the service call
     * @date 18/04/2023 - 22:34:09
     *
     * @type {string}
     */
    url = "https://api.github.com/orgs/QuickCorp/repos";

    /**
     * This is used internally for XHR requests. Default value is false.
     * @date 18/04/2023 - 22:34:29
     *
     * @type {boolean}
     */
    withCredentials = false;

    /**
     * It is called once the service call is done
     * @param param0 this param has two properties, one is the native request call (XHR or Fetch object). The second property is the service object.
     * @returns Promise
     */
    done ({ request, service }: { request: XMLHttpRequest, service: Service }) {
      logger.debug(request);
      const result = JSON.parse(service.template).reverse().map(function (project: { id: string, description: string, name: string, html_url: string }) {
        return {
          id: project.id,
          description: project.description,
          title: project.name,
          url: project.html_url,
          image: `https://via.placeholder.com/170/000000/FFFFFF?text=${encodeURI(project.name)}`
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

    done ({ request, service }: { request: XMLHttpRequest, service: Service }) {
      logger.debug(request);
      const result = JSON.parse(service.template).items.map(function (project: { id: string, description: string, name: string, html_url: string }) {
        return {
          id: project.id,
          description: project.description,
          title: project.name,
          url: project.html_url,
          image: `https://via.placeholder.com/170/000000/FFFFFF?text=${encodeURI(project.name)}`
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
    done: ({ service }: { service: Service }) => {
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
    done: ({ service }: { service: Service }) => {
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
