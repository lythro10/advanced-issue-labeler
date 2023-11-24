import { Octokit } from '@octokit/core';
import { config } from '@probot/octokit-plugin-config';
import { fetch } from '@node-fetch';

const CustomOctokit = Octokit.plugin(config);

export type CustomOctokit = InstanceType<typeof CustomOctokit>;

export function getOctokit(token: string) {
  return new CustomOctokit({
    request: {
      fetch: node-fetch,
    },
    auth: token,
    baseUrl: process.env.GITHUB_API_URL ?? 'https://api.github.com',
  });
}
