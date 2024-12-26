import { parseArgs } from "jsr:@std/cli/parse-args";
import { displayHelp } from "./help.ts";
// ==== Import variables ====
import { cfg, Report } from "./var.ts";
import { getVideoStats, round, runFFmpeg, VideoStats } from "./utils.ts";
import { Table } from "jsr:@cliffy/table@1.0.0-rc.7";

const args = parseArgs(Deno.args, {
	boolean: ["help"],
	string: ["i"],
});

if (args.help || !args.i) {
	displayHelp();
}

if (args.i === undefined) {
	console.log("Input file cannot be undefined");
	Deno.exit(1);
}

// Get file size
const videoPath: string = args.i;
// Get original video stats
const originalStats = await getVideoStats(videoPath);
// Create report
const report: Report = {
	originalSize: originalStats.size,
	duration: originalStats.duration,
	neededSize: round(originalStats.duration * (cfg.sizePerHour / 60), 0),
	sizePerHour: cfg.sizePerHour,
	calculations: [],
};

// Start bruteforcing needed CQ
if (report.originalSize < report.neededSize) {
	console.log("No transcoding needed");
	Deno.exit();
}

// Check if inut file exists
if (!Deno.statSync(videoPath)) {
	console.log("Input file does not exist!");
	Deno.exit(1);
}

let tmpVideoStats: VideoStats;
const tmpVideoPart: number = originalStats.duration / cfg.length; // How many tmp videos are needed for full movie
let cq: number = cfg.startCQ;

do {
	await runFFmpeg({ input: videoPath, output: "tmp.mp4", cq });
	tmpVideoStats = await getVideoStats("tmp.mp4");

	// Add to the report
	report.calculations.push({
		CQ: cq,
		smallSize: tmpVideoStats.size,
		fullSize: tmpVideoStats.size * tmpVideoPart,
	});

	cq++;
} while ((tmpVideoStats.size * tmpVideoPart) > report.neededSize);

// Display report
if (report.calculations.length < 1) {
	console.log("Did ffmpeg run?");
	Deno.exit(1);
}

console.clear();

console.log("Original data");
Table.fromJson([{ "Original size": report.originalSize + " MB", "Needed size": report.neededSize + " MB" }])
	.padding(1)
	.indent(2)
	.border()
	.render();

console.log("Calculated sizes");
Table.fromJson(report.calculations)
	.padding(1)
	.indent(2)
	.border()
	.render();
