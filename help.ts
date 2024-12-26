export function displayHelp() {
	console.log("This app will help you find the right CQ for your video file.");
	console.log("Usage:\n\tdeno main.ts --i <path-to-file>");
	Deno.exit();
}
