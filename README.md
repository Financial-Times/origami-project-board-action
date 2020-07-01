# Origami project board action

Automatically add all new issues and pull requests to the Origami Project Board!

## Usage

See [./example.yml](./example.yml)

### 1. Adding the secret

1. Add the repository to the organisation wide secrets: https://github.com/organizations/Financial-Times/settings/secrets for `ORIGAMI_FOX_ACCESS_TOKEN`.

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
