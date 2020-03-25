# Origami project board action

Automatically add all new issues and pull requests to the Origami Project Board!

## Usage

See [./example.yml](./example.yml)

### 1. Adding the secret

#### Manual approach:

1. Get the secret from [Vault](https://vault.in.ft.com:8080/ui/vault/secrets/secret/show/teams/origami/github.com/origamiserviceuser). It is named `ORIGAMI_FOX_ACCESS_TOKEN`.
2. Browse to the repository's `settings/secrets` page. For example, `o-colors` secret page is: https://github.com/Financial-Times/o-colors/settings/secrets
3. If there is already a key called `ORIGAMI_FOX_ACCESS_TOKEN`, remove it. (If not, that's good)
4. Add a new key called `ORIGAMI_FOX_ACCESS_TOKEN` with the value you got from LastPass

#### Automated approach:

1. Get the secret from [Vault](https://vault.in.ft.com:8080/ui/vault/secrets/secret/show/teams/origami/github.com/origamiserviceuser). It is named `ORIGAMI_FOX_ACCESS_TOKEN`.
2. Get a [GitHub token](https://github.com/settings/tokens/new) with write access for the repositories you want to add the secret to.
3. Clone this repository and run this shell command below, replace example with the name of the repository you want to add the secret to:

```sh
git clone git@github.com:Financial-Times/origami-project-board-action.git
cd origami-project-board-action
GITHUB_TOKEN="<GITHUB_TOKEN>" SECRET_NAME="ORIGAMI_FOX_ACCESS_TOKEN" SECRET_VALUE="example secret value" OWNER="Financial-Times" REPO="example" node ./add-secret-to-repo.js
```

### 2. Adding the workflow
1. In your project, make the directory `.github/workflows/` if it does not exist
2. Add [this file](./example.yml) to the `.github/workflows/` directory as `add-new-issues-and-pull-requests-to-origami-project-board.yml`
3. Branch, commit, push, pr, enjoy

```sh
mkdir -p .github/workflows
curl -Lso .github/workflows/add-new-issues-and-pull-requests-to-origami-project-board.yml https://raw.githubusercontent.com/Financial-Times/origami-project-board-action/v1/example.yml
git checkout -b "origami-project-board-workflow"
git add .github
git commit -m "Add origami project board workflow"
git push
```

## Development

If your changes are not breaking, feel free to push them to the v1 branch, and they'll be picked up by every repo running v1.

If your changes __*ARE*__ breaking, then you should create a v2 branch and update your chosen components to use the new workflow.
