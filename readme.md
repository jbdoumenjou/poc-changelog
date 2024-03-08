# POC Repository: Changelog Automation with GitHub Actions

Welcome to the Proof of Concept (POC) repository for automating changelog generation and releases using GitHub Actions.
This repository serves as a demonstration of best practices for implementing automated changelog workflows,
focusing on the usage of conventional commits, semantic pull requests, and the release-please action.

## Table of Contents
- [Introduction](#introduction)
- [Getting Started](#getting-started)
- [Conventional Commits](#conventional-commits)
- [Semantic Pull Request Action](#semantic-pull-request-action)
- [Release Please Action](#release-please-action)
- [How to Use This Repository](#how-to-use-this-repository)
- [Suggestions and Discussions](#suggestions-and-discussions)

## Introduction

This repository aims to showcase a streamlined and automated approach to managing changelogs and releases in a software project.
By adhering to conventional commits and leveraging GitHub Actions, we can ensure a standardized and efficient release process.

## Getting Started

To use the automated changelog and release workflows demonstrated in this repository, follow these steps:

1. **Conventional Commits**: Familiarize yourself with the [Conventional Commits Specification](https://www.conventionalcommits.org/).
This specification helps standardize commit messages and facilitates automated versioning.

2. **Semantic Pull Request Action**: Integrate the [Semantic Pull Request Action](https://github.com/marketplace/actions/semantic-pull-request) into your GitHub Actions workflow.
This action automatically labels pull requests based on conventional commits.

3. **Release Please Action**: Explore the [Release Please Action](https://github.com/googleapis/release-please) to automate the generation of release notes and version bumps based on pull requests and commit history.

## Conventional Commits

Conventional commits are a standardized way of writing commit messages, enabling automated versioning and changelog generation.
Ensure that your commit messages follow the [conventional commits format](https://www.conventionalcommits.org/en/v1.0.0/#specification).

Example:

```shell
feat: add new feature
feat(lang): add Polish language
fix: resolve a bug
docs: update documentation
chore!: drop support for Node 6
```

## Semantic Pull Request Action

The Semantic Pull Request Action analyzes pull request titles and labels them based on conventional commits.
This action helps maintain a consistent commit message format across the project.

Follow the [Semantic Pull Request Action documentation](https://github.com/marketplace/actions/semantic-pull-request#installation)

### Configure the Semantic Pull Request Action

The action needs a token to access the repository.
* Create a fine grain token https://github.com/settings/personal-access-tokens/new
  * In the `New fine-grained personal access token` form: 
    * Define a name for the token
    * Define an expiration date (the shorter, the safer)
    * Set a description
  * In `Repository access`:
    * Select the specific repository
  * In `Permissions`->`Repository Permissions`:
    * Add Pull Request ReadOnly
    * It will add the Metadata Read-Only
  * Click on `Generate token`
  * Copy the token
* Add it to your repository secrets
  * Go to your repository
  * Click on `Settings`
  * Click on the  `Secrets and variables`->`Actions` left menu
  * Click on `New repository secret`
  * Set the secret Name, in our example `PR_READ_TOKEN`
  * Paste the token in the `Secret` field
  * Click on `Add secret`
* Now the secret can be referenced in the workflow file

```yaml
jobs:
  main:
    name: Validate PR title
    runs-on: ubuntu-latest
    steps:
      - uses: amannn/action-semantic-pull-request@v5
        env:
          GITHUB_TOKEN: ${{ secrets.PR_READ_TOKEN }}
```

## Release Please

[Release-please](https://github.com/googleapis/release-please) can be used as a [CLI]() or as a [GitHub Action](https://github.com/google-github-actions/release-please-action).

In both cases, we need to create a token to access the repository, write content and pull request.

### Create a token to access the repository

The action needs a token to access the repository.
* Create a fine grain token https://github.com/settings/personal-access-tokens/new
  * In the `New fine-grained personal access token` form:
    * Define a name for the token
    * Define an expiration date (the shorter, the safer)
    * Set a description
  * In `Repository access`:
    * Select the specific repository
  * In `Permissions`->`Repository Permissions`:
    * Add Contents Read-Write
    * Add Pull Request Read-Write
    * It will add the Metadata Read-Only
  * Click on `Generate token`
  * Copy the token
* Add it to your repository secrets
  * Go to your repository
  * Click on `Settings`
  * Click on the  `Secrets and variables`->`Actions` left menu
  * Click on `New repository secret`
  * Set the secret Name, in our example `MY_RELEASE_PLEASE_TOKEN`
  * Paste the token in the `Secret` field
  * Click on `Add secret`
* Now the secret can be referenced in the workflow file

### Test the Release Please Action

If you use a commit label like:
* `chore(something): text`, this commit will not be taken into account for the release (TODO: configure).
* `fix(something): text`, the next version will be a patch.
* `feat(something): text`, the next version will be a minor.
* `[action]!: something`, the `̀!` indicates a breaking change, the next version will be a major.  

The release-please PR will be updated each time a new commit is pushed to the target branch (main in our repo).
The version will be updated accordingly to the commit labels.
If the first commit is merge with a patch label, the next version will be a patch.
Then, if you add a new commit is added with a minor label, the version of the PR will be set to minor as well.

The release-please action will keep only the commit content to generate the changelog.

Let's try several commits with different labels and see the result.
Add the following commit messages to a commit on a branch and merge it to the main branch.

```shell
feat(api): add new feature

feature(f36): add new feature2

fix(api): resolve a bug

perf(computing): improve performance

revert(api): revert a change

docs(api): update documentation

style(api): improve style

chore(api): drop support for Node 6

refactor(api): refactor code

test(integration): add tests

build(backend): improve build

ci(t42): improve
 ```

This will generate a changelog like:

```markdown
### Features

* **api:** add new feature ([#15](https://github.com/jbdoumenjou/poc-changelog/issues/15)) ([855c471](https://github.com/jbdoumenjou/poc-changelog/commit/855c4718a66168734719e37d9c2684362df5cba7))
* **f36:** add new feature2 ([855c471](https://github.com/jbdoumenjou/poc-changelog/commit/855c4718a66168734719e37d9c2684362df5cba7))


### Bug Fixes

* **api:** resolve a bug ([855c471](https://github.com/jbdoumenjou/poc-changelog/commit/855c4718a66168734719e37d9c2684362df5cba7))


### Performance Improvements

* **computing:** improve performance ([855c471](https://github.com/jbdoumenjou/poc-changelog/commit/855c4718a66168734719e37d9c2684362df5cba7))


### Reverts

* **api:** revert a change ([855c471](https://github.com/jbdoumenjou/poc-changelog/commit/855c4718a66168734719e37d9c2684362df5cba7))
```

All the configuration is done in the `.github/workflows/release-please.yml` file.
For advanced configuration, please check the [configfile doc](https://github.com/googleapis/release-please/blob/main/docs/manifest-releaser.md#configfile)

### Limitations

The Changelog content is re-generated at each commit on target branch.
That means that we need to made manual modification just before merging this PR. 

### Troubleshooting

If you encounter issues with the Release Please Action,
ensure that the token has the necessary permissions to create pull requests and write to the repository.

If the action fails to create a pull request, verify
* That a previous PR with a label `autorelease: pending` is not open
* That the commit label follows the semantic versioning rules

## How to Use This Repository

Clone this repository and experiment with the provided GitHub Actions workflows.
Adapt them to fit your project's needs and customize the release process according to your versioning strategy.

## Suggestions and Discussions

Feel free to open issues or pull requests to suggest improvements,
discuss alternative approaches, or share your experiences with changelog automation.
This repository serves as a collaborative space for exploring best practices.

