"use strict"

process.on("unhandledRejection", error => {
	console.error(error)
	process.exit(1)
})

async function main() {
	const sodium = require("tweetsodium")
	const {Octokit} = require("@octokit/rest")

	const REPO = process.env.REPO
	const OWNER = process.env.OWNER
	const SECRET_NAME = process.env.SECRET_NAME
	const SECRET_VALUE = process.env.SECRET_VALUE
	const GITHUB_TOKEN = proce.env.GITHUB_TOKEN
	const override_existing_secret = process.env.OVERRIDE === "true"

	if (!REPO) {
		console.error(
			`Environment variable REPO is missing. Set the environment variable REPO to the name of the GitHub repository you want to add the secret to and run the command again.`
		)
		process.exit(1)
	}

	if (!OWNER) {
		console.error(
			`Environment variable OWNER is missing. Set the environment variable OWNER to the name of the GitHub owner of the repository you want to add the secret to and run the command again.`
		)
		process.exit(1)
	}

	if (!SECRET_NAME) {
		console.error(
			`Environment variable SECRET_NAME is missing. Set the environment variable SECRET_NAME to the name of the secret you want to add to and run the command again.`
		)
		process.exit(1)
	}

	if (!SECRET_VALUE) {
		console.error(
			`Environment variable SECRET_VALUE is missing. Set the environment variable SECRET_VALUE to the value of the secret you want to add to and run the command again.`
		)
		process.exit(1)
	}

	if (!GITHUB_TOKEN) {
		console.error(
			`Environment variable GITHUB_TOKEN is missing. Set the environment variable GITHUB_TOKEN with a GitHub token which has write access to the repo you are adding the secret to and run the command again.`
		)
		process.exit(1)
	}

	const octokit = new Octokit({
		auth: process.env.GITHUB_TOKEN,
	})

	let has_secret
	if (override_existing_secret) {
		try {
			has_secret = await octokit.actions.getSecret({
				owner: OWNER,
				repo: REPO,
				name: SECRET_NAME,
			})
			console.log(
				`${repo} already has a secret named ${SECRET_NAME}. If you want to override the secret, set the environment variable OVERRIDE to "true" andrun the command again.`
			)
		} catch (e) {}
	}

	if (!has_secret) {
		const {
			data: {key_id, key},
		} = await octokit.actions.getPublicKey({
			owner: OWNER,
			repo: REPO,
		})

		// Convert the message and key to Uint8Array's (Buffer implements that interface)
		const messageBytes = Buffer.from(SECRET_VALUE)
		const keyBytes = Buffer.from(key, "base64")

		// Encrypt using LibSodium.
		const encryptedBytes = sodium.seal(messageBytes, keyBytes)

		// Base64 the encrypted secret
		const encrypted = Buffer.from(encryptedBytes).toString("base64")

		octokit.actions.createOrUpdateSecretForRepo({
			owner: OWNER,
			repo: REPO,
			name,
			encrypted_value: encrypted,
			key_id,
		})

		console.log(`Added GitHub secret ${name} to ${REPO}.`)
	}
}

main()
