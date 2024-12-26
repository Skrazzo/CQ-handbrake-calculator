
# QC-calc
## Problem

If you're encoding media in handbrake, and you want to achieve the same file size per hour ratio there are two options:
1. Set average bitrate
2. Set Constant quality factor

Both of these methods have their cons, for example setting average bitrate will provide wanted file size per hour, but in places where scene changes a lot, you will start seeing a lot of pixels which can be avoided with constant quality factor.

But with constant quality factor, you lose ability to get desired file size per hour without manually re-transcoding media file. For example, if you have different media files like 3GB and 7GB movie, the same constant quality factor will provide different quality outputs.

That's why I made an app.
## How it works

App takes start CQ factor and transcodes 1 minute of media file, then based on the output predicts full media file size, if the full file size is bigger than needed, then adjusts CQ and transcodes another 1 minute until preferred file size is found.

And then displays the results in a report table in your terminal. So simple :)

![[Pasted image 20241226144409.png]]

## How to use it

1. Clone project
2. Adjust your preferences in `var.ts`
3. run deno script and pass your video file
	1. `deno run dev --i path-to-video.mp4`
4. Transcode in handbrake and enjoy

## Requirements

You will need to download ffmpeg.exe and ffprobe.exe and put them in `bin` folder.
Or you can specify locally installed versions in `var.ts` file.

- ffmpeg
- ffprobe