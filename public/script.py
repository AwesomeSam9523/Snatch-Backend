import os

counter = 1
for file in os.listdir():
	if file == "script.py": continue
	os.rename(file, f"{counter}.svg")
	counter += 1
