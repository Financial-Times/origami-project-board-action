# Origami project board action

Automatically add all new issues and pull requests to the Origami Project Board!

## Usage

See [./example.yml](./example.yml)

### 1. Adding the secret
1. Get the secret from LastPass. It's in a Shared-Origami note called `Origami fox issue and pull request workflow secret`.
2. Browse to the repository's `settings/secrets` page. For example, `o-colors` secret page is: https://github.com/Financial-Times/o-colors/settings/secrets
3. If there is already a key called `ORIGAMI_FOX_ACCESS_TOKEN`, remove it. (If not, that's good)
4. Add a new key called `ORIGAMI_FOX_ACCESS_TOKEN` with the value you got from LastPass

### 2. Adding the workflow
1. In your project, make the directory `.github/workflows/` if it does not exist
2. Add [this file](./example.yml) to the `.github/workflows/` directory as `add-new-issues-and-pull-requests-to-origami-project-board.yml`
3. Branch, commit, push, pr, enjoy
