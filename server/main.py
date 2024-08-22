import cv2
import json
import os
import numpy as np
import sys
import urllib.request

# Check if the download URL is provided
if len(sys.argv) < 2:
    print("Error: No video URL provided.")
    exit()

download_url = sys.argv[1]
video_filename = 'downloaded_video.mp4'

# Download the video from the URL
urllib.request.urlretrieve(download_url, video_filename)

# Define the folder to save frames
frames_folder = '../public/frames'

# Create the folder if it doesn't exist
if not os.path.exists(frames_folder):
    os.makedirs(frames_folder)
else:
    # Clear the folder if it already exists
    for filename in os.listdir(frames_folder):
        file_path = os.path.join(frames_folder, filename)
        if os.path.isfile(file_path):
            os.unlink(file_path)

# Open the video file
video_capture = cv2.VideoCapture(video_filename)

# Check if video opened successfully
if not video_capture.isOpened():
    print(json.dumps({"error": "Could not open video."}))
    exit()

# Get the frame rate of the video
fps = video_capture.get(cv2.CAP_PROP_FPS)
desired_fps = 0.25  # Change this value to capture more frames per second

# Frame capture interval
frame_interval = int(fps / desired_fps)

# Parameters for ShiTomasi corner detection
feature_params = dict(maxCorners=1, qualityLevel=0.01, minDistance=10, blockSize=7)

# Parameters for Lucas-Kanade optical flow
lk_params = dict(winSize=(15, 15), maxLevel=2, criteria=(cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 10, 0.03))

# Frame count
frame_count = 0
panorama_images = []
frame_points = []
index = 0

# Initial z value
z_value = -500

# Read the first frame
ret, old_frame = video_capture.read()
if not ret:
    print(json.dumps({"error": "Could not read the first frame."}))
    exit()

# Convert the frame to grayscale
old_gray = cv2.cvtColor(old_frame, cv2.COLOR_BGR2GRAY)

# Detect initial corners
p0 = cv2.goodFeaturesToTrack(old_gray, mask=None, **feature_params)

while video_capture.isOpened():
    ret, frame = video_capture.read()
    
    if not ret:
        break
    
    if frame_count % frame_interval == 0:
        # Get frame dimensions and center point
        height, width, _ = frame.shape
        center_x, center_y = width // 2, height // 2

        # # Draw a dot at the center point
        # cv2.circle(frame, (center_x, center_y), 5, (0, 0, 255), -1)

        # Save frame as image in the specified folder
        frame_filename = os.path.join(frames_folder, f'frame_{index}.jpg')
        cv2.imwrite(frame_filename, frame)
        panorama_images.append(frame_filename)
        index += 1

        # Convert frame to grayscale
        frame_gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Calculate optical flow
        p1, st, err = cv2.calcOpticalFlowPyrLK(old_gray, frame_gray, p0, None, **lk_params)

        if p1 is not None and st is not None:
            # Select good points
            good_new = p1[st == 1]
            good_old = p0[st == 1]

            # Store frame capture point
            if len(good_new) > 0:
                x, y = good_new[0].ravel()
                frame_point = {'x': int(center_x), 'y': int(center_y), 'z': int(-1500), 'panorama_path': frame_filename}
                frame_points.append(frame_point)
            else:
                # Use center of frame if no points detected
                frame_point = {'x': int(center_x), 'y': int(center_y), 'z': int(-1500), 'panorama_path': frame_filename}
                frame_points.append(frame_point)
        else:
            # Use center of frame if optical flow calculation fails
            frame_point = {'x': int(center_x), 'y': int(center_y), 'z': int(-1500), 'panorama_path': frame_filename}
            frame_points.append(frame_point)

        # Update z_value for the next point
        z_value -= 500

        # Update previous frame and points
        old_gray = frame_gray.copy()
        p0 = good_new.reshape(-1, 1, 2) if p1 is not None else p0
    
    frame_count += 1

# Release the video capture object
video_capture.release()

# Save the points to a JSON file
with open(os.path.join(frames_folder, 'frame_points.json'), 'w') as file:
    json.dump(frame_points, file, indent=4)

print(json.dumps(frame_points))
