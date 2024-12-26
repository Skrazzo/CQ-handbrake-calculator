import { cfg, paths } from "./var.ts";

/**
 * Rounds up a number based on specified decimal places
 * @param num Number to round
 * @param decimal Decimal places after comma
 * @returns rounded number
 */
export function round(num: number, decimal: number): number {
	return Math.round(num * Math.pow(10, decimal)) / Math.pow(10, decimal);
}

export interface VideoStats {
	size: number;
	duration: number;
}

export async function getVideoStats(videoPath: string): Promise<VideoStats> {
	const cmd = new Deno.Command(paths.ffprobe, {
		args: [
			"-v",
			"quiet",
			"-print_format",
			"json",
			"-show_format",
			"-show_streams",
			videoPath,
		],
	});

	try {
		const output = await cmd.output();
		const info = JSON.parse(new TextDecoder().decode(output.stdout));

		return {
			size: round(Number(info.format.size) / 1024 / 1024, 0), // MB,
			duration: round(Number(info.format.duration) / 60, 2), // minutes
		};
	} catch (error) {
		console.error("Error getting video info:", error);
		Deno.exit(1);
	}
}

interface runFFmpegProps {
	input: string;
	output: string;
	cq: number;
}

export async function runFFmpeg(props: runFFmpegProps): Promise<string> {
	const cmd = new Deno.Command(paths.ffmpeg, {
		args: [
			"-y",
			"-ss",
			`00:${cfg.skip}:00`,
			"-i",
			props.input, // Remove quotes here
			"-t",
			`00:${cfg.length}:00`,
			"-c:v",
			cfg.codec,
			"-cq",
			props.cq.toString(),
			"-vf",
			`scale=${cfg.scale}`,
			props.output,
		],
	});

	// SHow progress
	console.log([
		paths.ffmpeg,
		"-y",
		"-ss",
		`00:${cfg.skip}:00`,
		"-i",
		props.input, // Remove quotes here
		"-t",
		`00:${cfg.length}:00`,
		"-c:v",
		cfg.codec,
		"-cq",
		props.cq.toString(),
		"-vf",
		`scale=${cfg.scale}`,
		props.output,
	].join(" "));

	try {
		const output = await cmd.output();
		return new TextDecoder().decode(output.stdout);
	} catch (error) {
		console.error("Error transcoding tmp video:", error);
		Deno.exit(1);
	}
}
