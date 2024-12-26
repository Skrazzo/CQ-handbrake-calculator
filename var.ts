export const paths = {
	ffmpeg: "./bin/ffmpeg.exe",
	ffprobe: "./bin/ffprobe.exe",
};
export const cfg = { // Config
	sizePerHour: 1000, // Wanted size per hour in MB
	skip: 30, // Take somewhere in the middle of the movie -> skip n minutes
	length: 1, // Create tmp video of 1 minute long
	startCQ: 29, // Start constant quality, smaller CQ -> bigger file size
	codec: "h264_nvenc", // You can see all available ones in ffmpeg --codecs
	scale: "1920:1080",
};

interface CalculationRow {
	CQ: number;
	smallSize: number; // Size of 1 minute long clip
	fullSize: number; // Predicted size of full movie
	[key: string]: number;
}

export interface Report {
	originalSize: number;
	duration: number;
	neededSize: number;
	sizePerHour: number;
	calculations: CalculationRow[];
}
