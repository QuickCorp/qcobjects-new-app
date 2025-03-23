/* eslint-disable prefer-rest-params */
"use strict";
import QCObjects from "qcobjects";
import type { ServiceResponse } from '../../types/shared.d.ts';

const { Package, JSONService, Service, logger } = QCObjects;

type Project = {
  id: string;
  description: string;
  name: string;
  html_url: string;
  owner: { avatar_url: string },
  forks_count: number,
  stargazers_count: number,
  watchers_count: number,
  size: number
}

type GitHubTagServiceResponse = {
  total_count: number;
  incomplete_results: boolean;
  items: Array<Project>
};

type ItemProject = {
  id: string;
  description: string;
  title: string;
  url: string;
  image: string;
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
    async done(args?: ServiceResponse): Promise<unknown> {
      if (!args) return;

      const result: ItemsProject = (JSON.parse(args.template as string) as Array<Project>)
        .reverse().map(function (project: Project) {
          return {
            id: project.id,
            description: project.description,
            title: project.name,
            url: project.html_url,
            image: `https://via.placeholder.com/170/000000/FFFFFF?text=${encodeURI(project.name)}`
          };
        });

      args.template = JSON.stringify({
        result
      });
      return super.done(args);
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

    async done(args?: ServiceResponse): Promise<unknown> {
      if (!args) return;
      logger.debug(args);

      const result: ItemsProject = (JSON.parse(args.template as string) as GitHubTagServiceResponse)
        .items.map(function (project: Project) {
          return {
            id: project.id,
            description: project.description,
            title: project.name,
            url: project.html_url,
            image: `https://via.placeholder.com/170/000000/FFFFFF?text=${encodeURI(project.name)}`
          };
        });

      args.template = JSON.stringify({
        result
      });
      return super.done(args);
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

    async done(args?: ServiceResponse): Promise<unknown> {
      if (!args) return;
      const latest = JSON.parse(args.template as string)[0];
      args.template = JSON.stringify({
        version: latest.name
      });
      return args;
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

    async done(args?: ServiceResponse): Promise<unknown> {
      if (!args) return;
      const repo: Project = (JSON.parse(args.template as string) as Project);
      args.template = JSON.stringify({
        forks: repo.forks_count,
        stars: repo.stargazers_count,
        watchers: repo.watchers_count,
        size: Math.round(repo.size / 1000)
      });
      return args;
    }
  }
]);
