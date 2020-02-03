var core = require("@actions/core")
var github = require("@actions/github")
var createObjectWithDefaultValue = require("object-with-default-value")

var success = () => process.exit(0)

var eventHandlers = createObjectWithDefaultValue({}, function () {
	throw new Error(
		"The Origami project board action should only be run on `pull_request` or `issue`. See https://github.com/Financial-Times/origami-project-board-action#usage"
	)
})

var contentTypes = {
	pr: "PullRequest",
	issue: "Issue"
}

function handleCreateCardResponse (response) {
	if (response.status >= 200 && response.status <= 299) {
		core.info("done!!")
		return
	}

	if (response.status == 422) {
		core.warn("That item is already on the board!")
		return
	}

	throw new Error(JSON.stringify(response))
}

eventHandlers.pull_request = async function pullRequest (octo, {incomingColumnId}) {
	if (github.context.payload.action != "opened") {
		core.info("it's a pull request, but it hasn't just opened so i'll ignore it:)")
		return
	}

	octo.projects.createCard({
		column_id: incomingColumnId,
		content_id: github.context.payload.pull_request.id,
		content_type: contentTypes.pr
	}).then(handleCreateCardResponse)
}

eventHandlers.issue = async function issue (octo, {incomingColumnId}) {
	if (github.context.payload.action != "opened") {
		core.info("it's an issue, but it hasn't just opened so i'll ignore it:)")
		return
	}

	if (github.context.payload.pull_request) {
		core.info("it's an issue, but it's also a PR i'll let the PR action handle it:)")
		return
	}

	octo.projects.createCard({
		column_id: incomingColumnId,
		content_id: github.context.payload.issue.id,
		content_type: contentTypes.issue
	}).then(handleCreateCardResponse)
}

void async function () {
	try {
		var origamiFoxAccessToken = core.getInput("origami-fox-access-token")
		var incomingColumnId = core.getInput("incoming-column-id")
		var octo = new github.GitHub(origamiFoxAccessToken, {
			previews: ["inertia-preview"]
		})
		await eventHandlers[github.context.eventName](octo, {incomingColumnId})
		return success()
	} catch (error) {
		core.setFailed(error.message)
		process.exit(1)
	}
}()
