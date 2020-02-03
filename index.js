var core = require("@actions/core")
var github = require("@actions/github")
var createObjectWithDefaultValue = require("object-with-default-value")

var success = () => process.exit(0)

var eventHandlers = createObjectWithDefaultValue({}, function () {
	throw new Error(
		`
The Origami project board action should only be run on \`pull_request\` or
\`issues\`, \`${github.context.eventName}\`.
See https://github.com/Financial-Times/origami-project-board-action#usage`
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
	var action = github.context.payload.action
	if (action != "opened") {
		core.info(`it's a pull request, but i only care about "opened", not "${action}", so i'll ignore it:)`)
		return
	}

	var id = github.context.payload.pull_request.id

	core.info("creating card for pr ${id}")

	return octo.projects.createCard({
		column_id: incomingColumnId,
		content_id: id,
		content_type: contentTypes.pr
	})
		.then(handleCreateCardResponse)
		.catch(handleCreateCardResponse)
}

eventHandlers.issues = async function issues (octo, {incomingColumnId}) {
	var action = github.context.payload.action
	if (action != "opened") {
		core.info(`it's an issue, but i only care about "opened", not "${action}", so i'll ignore it:)`)
		return
	}

	if (github.context.payload.pull_request) {
		core.info("it's an issue, but it's also a PR i'll let the PR action handle it:)")
		return
	}

	var id = github.context.payload.issue.id

	core.info("creating card for issue ${id}")

	return octo.projects.createCard({
		column_id: incomingColumnId,
		content_id: id,
		content_type: contentTypes.issue
	})
		.then(handleCreateCardResponse)
		.catch(handleCreateCardResponse)
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
