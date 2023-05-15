import pytube, time, ffmpeg, os, sys, argparse

#Add the command line arguments to be passed in
parser = argparse.ArgumentParser()
parser.add_argument('-u', '--url', type=str)
parser.add_argument('-t', '--type', type=str, choices=['audio', 'video', 'both'], default='both')
args = parser.parse_args()

print("Download starting")

#Create the Youtube object
youtube = pytube.YouTube(args.url)
video = youtube.streams.filter(file_extension='mp4').order_by('resolution')
audio = youtube.streams.filter(only_audio=True)
desire_vid = video[len(video)-1]
desire_audio = audio[0]

print("Video file: " + str(desire_vid))
print("Audio file: " + str(desire_audio))

if (args.type == 'audio'):
    desire_audio.download(filename=(youtube.title+'.mp3'))

elif (args.type == 'video'):
    desire_vid.download(filename=(youtube.title+'.mp4'))

else:
    desire_vid.download(filename=('Video.mp4'))
    desire_audio.download(filename=('Audio.mp3'))
    video = ffmpeg.input('Video.mp4')
    audio = ffmpeg.input('Audio.mp3')

    time.sleep(5)

    out = ffmpeg.output(video, audio, (youtube.title+'.mp4'), vcodec='copy', acodec='aac', strict='experimental')
    out.run()
    os.remove('Video.mp4')
    os.remove('Audio.mp3')

print("Finished")