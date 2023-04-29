/* eslint-disable prefer-rest-params */
"use strict";
import { Package, JSONService, Service, logger } from "qcobjects";

type Project = {
  id: string;
  description: string;
  name: string;
  html_url: string;
  owner: { avatar_url: string },
  forks_count:number,
  stargazers_count:number,
  watchers_count:number,
  size:number
}

type StandardResponse = { 
  request: XMLHttpRequest;
  service: Service; 
};

type GitHubTagServiceResponse = {
  total_count:number;
  incomplete_results: boolean;
  items:Array<Project>
};
type ItemProject = {
  id:string;
  description:string;
  title:string;
  url:string;
  image:string;
};
type ItemsProject = Array<ItemProject>;

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
    done({ request, service }: StandardResponse) {

      const result:ItemsProject = (JSON.parse(service.template) as Array<Project>)
      .reverse().map(function (project: Project) {
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
      return super.done({ request, service });
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

    done({ request, service }: StandardResponse) {
      logger.debug(request);
      const result:ItemsProject = (JSON.parse(service.template) as GitHubTagServiceResponse)
        .items.map(function (project: Project) {
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
      return super.done({ request, service });
    }
  },

  class QCObjectsVersionService extends Service {
    name = "qcobjects_version_service";
    external = true;
    cached = false;
    method = "GET";
    headers = { "Content-Type": "application/json" };
    url = "https://api.github.com/repos/QuickCorp/QCObjects/tags";
    withCredentials = false;

    done({ service }: StandardResponse) {
      const latest = JSON.parse(service.template)[0];
      service.template = {
        version: latest.name
      };
    }

  },

  class QCObjectsStarsForksService extends Service {
    name = "qcobjects_stars_forks_service";
    external = true;
    cached = false;
    method = "GET";
    headers = { "Content-Type": "application/json" };
    url = "https://api.github.com/repos/QuickCorp/QCObjects";
    withCredentials = false;

    done({ service }: StandardResponse) {
      const repo:Project = (JSON.parse(service.template) as Project);
      service.template = {
        forks: repo.forks_count,
        stars: repo.stargazers_count,
        watchers: repo.watchers_count,
        size: Math.round(repo.size / 1000)
      };
    }

  }
]);
