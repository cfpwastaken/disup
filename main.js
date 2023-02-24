#!/usr/bin/env -S deno run --allow-net --allow-write --allow-read --allow-env --allow-run
const DISCORD_DOWNLOAD_URL = "https://discord.com/api/download/$channel?platform=linux&format=deb";

const channel = Deno.args[0] || "";

const VALID_CHANNELS = ["", "ptb", "canary", "development"]; // Empty string is stable

if(!VALID_CHANNELS.includes(channel)) {
	console.error("Invalid channel: " + channel);
	console.error("Valid channels: " + VALID_CHANNELS.join(", "));
	Deno.exit(1);
}

console.log("Installing Discord from " + (channel ? channel : "stable") + " channel");

fetch(DISCORD_DOWNLOAD_URL.replace("$channel", channel)).then(async (res) => {
	const data = await res.arrayBuffer();
	const tempFile = await Deno.makeTempFile();
	await Deno.writeFile(tempFile, new Uint8Array(data));

	// Install
	const p = Deno.run({
		cmd: ["sudo", "dpkg", "-i", tempFile],
		stdout: "piped",
		stderr: "piped",
	});

	p.close();

	// Remove temp file
	Deno.remove(tempFile);
});