import numpy as np
from datetime import datetime, timedelta
import pandas as pd
import torch
from ultralytics import YOLO
from PIL import Image, ImageEnhance
import pytesseract
import cv2

pytesseract.pytesseract.tesseract_cmd = r"/opt/homebrew/bin/tesseract" 
#function that passes the image through the yolo model 
#we are passing in the image
#confidence score is also extracted to determine the most accurate bounding box if more than one is detected (can happen in some cases)
#output should be the bounding box coordinates of the detected text with the highest confidence score
def detect_text_bounding_box(image, model_path, target_class):
    model = YOLO(model_path)  #load the YOLO model
    output = model(image)  #run inference on the image
    boxes = [] #local list to store detected boxes
    bounding_box = [] 

    result = output[0] #get the result from output list

    for box in result.boxes: 
        conf = float(box.conf) #get confidence score
        if int(box.cls) == target_class: #check if the detected class matches the target class, in this case, expiry date
            x1, y1, x2, y2 = box.xyxy[0].tolist() #get box coordinates for the expiry date class
            boxes.append((conf, [x1, y1, x2, y2])) #append coordinates to the coerresponding confidence score
            #list in tuple format, conf is immutable
    if boxes:
        #pick the box with the highest confidence
        boxes.sort(reverse=True)  #sort by confidence descending, so highest confidence is first
        bounding_box = [boxes[0][1]] #get the coordinates [x1, y1, x2, y2] of the box with highest confidence
    else:
        bounding_box = [] #no boxes detected
        
    return bounding_box


#function that extracts expiry dates from images using OCR technology
#we are passsing in the bounding box coordinates from the previous function
#output should be the extracted text in string format within a list
def extract_expiry_date(bounding_box, image):
    extracted_texts = []

    for box in bounding_box:
        x1, y1, x2, y2 = map(int, box)  #mapping the box coordinates to integers
        cropped_img = image.crop((x1, y1, x2, y2))  #crop the region based on the bounding box
        cropped_img = cropped_img.convert("RGB") #convert to RGB
        cropped_img = np.array(cropped_img)  #convert to numpy array for OpenCV processing
        cropped_img = np.array(cropped_img) #convert PIL image to numpy array
        cropped_img = cv2.cvtColor(cropped_img, cv2.COLOR_RGB2GRAY)  #convert to grayscale
        cropped_img = cv2.normalize(cropped_img, None, alpha=0, beta=255, norm_type=cv2.NORM_MINMAX) #normalise to enhance contrast

        thresh = cv2.adaptiveThreshold(cropped_img,255,cv2.ADAPTIVE_THRESH_GAUSSIAN_C,cv2.THRESH_BINARY,51,8) #adaptive thresholding to binarize the image
        if np.mean(thresh) < 127: 
            thresh = cv2.bitwise_not(thresh)  #invert colors if background is darker than text

        h, w = thresh.shape #adapt scale based on width
        scale = 2 if w < 300 else 1 
        if scale > 1: 
            thresh = cv2.resize(thresh, None, fx=scale, fy=scale, interpolation=cv2.INTER_CUBIC)

        whitelist = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789/.- " #defining whitelist characters for OCR
        configs = [f"--psm 7 -c tessedit_char_whitelist={whitelist}",f"--psm 6 -c tessedit_char_whitelist={whitelist}"] #list of different psm configs to try
        best_text = ""

        for cfg in configs: #try each config and pick the best result
            text = pytesseract.image_to_string(thresh, config=cfg).strip() #using pytesseract to extract text from the cropped image
            if len(text) > len(best_text):
                best_text = text

        #TODO: remove debugging lines later        
        print(thresh.shape) #debugging line to check size of processed image
        print(f"Best OCR text for expiry date:", repr(best_text)) #debugging line to check best OCR text
        cv2.imwrite("debug_thresh.png", thresh) #save processed image for debugging purposes

        extracted_texts.append(best_text) #append the best extracted text to the list
    return extracted_texts


#function that makes sure extracted text is all numerical format
def convert_to_numerical(extracted_texts):
    converted_dates = []

    month_mappings = {
        'JAN': '01', 'JANUARY': '01',
        'FEB': '02', 'FEBRUARY': '02',
        'MAR': '03', 'MARCH': '03',
        'APR': '04', 'APRIL': '04',
        'MAY': '05',
        'JUN': '06', 'JUNE': '06',
        'JUL': '07', 'JULY': '07',
        'AUG': '08', 'AUGUST': '08',
        'SEP': '09', 'SEPT': '09', 'SEPTEMBER': '09',
        'OCT': '10', 'OCTOBER': '10',
        'NOV': '11', 'NOVEMBER': '11',
        'DEC': '12', 'DECEMBER': '12'
    }

    for text in extracted_texts:
        #get rid of all spaces or symbols ". - / , etc  in the text"
        cleaned_text = ''.join(c for c in text if c.isalnum()).upper()
        month_found = None #setting default
        month_num = None
        placeholder = cleaned_text #in case no month text is found, we will use the original cleaned text

        for month_text in month_mappings:
            if month_text in cleaned_text.upper():
                start_idx = cleaned_text.upper().find(month_text) #find the starting index using month text
                end_idx = start_idx + len(month_text) #find the ending index using month text
                month_num = month_mappings[month_text] #get month number
                month_found = month_text #set month found

                placeholder = cleaned_text[:start_idx] + 'M' + cleaned_text[end_idx:] #replace month text with 'M' as a placeholder
                numeric_text = cleaned_text[:start_idx] + month_num + cleaned_text[end_idx:] #replace month text with its numerical equivalent
                print(numeric_text)
                break

        else:
            numeric_text = cleaned_text
            print(numeric_text)

        converted_dates.append({
            'extracted': month_found,
            'month': month_num,
            'placeholder': placeholder,
            'text': numeric_text
        })

    return converted_dates


#function that converts output to correct date format
#we are passing in the extracted text from the previous function
#output should be the date in datetime format
#date formats can vary so we need to create if statemtns to check and convert accordingly to the preferred format
def convert_to_date(converted_dates):
    results = []
    
    for item in converted_dates:
        text = item['text']
        placeholder = item['placeholder']
        day, month, year = 1, 1, None  # default values

        try:
            if len(text) == 6:  # DDMMYY or MMDDYY or YYMMDD // MMYYYY or YYYYMM
                if placeholder[0] == 'M': #if MDDYY or MYYYY
                    if text[2:6] in ['2025', '2024', '2023', '2026', '2027', '2028', '2029','2030']:
                        month = int(text[0:2]) #assume the first two digits are a month
                        year = int(text[2:6])
                        day = 30
                    else:
                        month = int(text[0:2]) #assume the first two digits are a month
                        day = int(text[2:4])
                        year = int(text[4:6]) + 2000

                elif placeholder[2] == 'M': #if DDMYY or YYMDD
                    if text[0:2] in ['25', '26', '27', '28', '29', '30']: #determines if the first two digits are a day or year
                        year = int(text[0:2]) + 2000 #assume the first two digits are a year
                        month = int(text[2:4])
                        day = int(text[4:6])
                    elif text[5:7] in ['25', '26', '27', '28', '29', '30']: #determines if the last two digits are a day or year
                        day = int(text[0:2]) #assume the first two digits are a day
                        month = int(text[2:4])
                        year = int(text[4:6]) + 2000

                elif placeholder[4] == 'M': #if YYYYM
                    year = int(text[0:4]) #assume the first four digits are a year
                    month = int(text[4:6])
                    day = 30

                elif text[0:4] in ['2023', '2024', '2025', '2026', '2027', '2028', '2029','2030']:
                    year = int(text[0:4])
                    month = int(text[4:6])
                    day = 30

                elif text[2:6] in ['2023', '2024', '2025', '2026', '2027', '2028', '2029','2030']:
                    month = int(text[0:2])
                    year = int(text[2:6])
                    day = 30

                else: #assume DDMMYY
                    day = int(text[0:2])
                    month = int(text[2:4]) #assume the middle two digits are a month
                    year = int(text[4:6]) + 2000
                
            elif len(text) == 8:  # DDMMYYYY or MMDDYYYY YYYYMMDD
                if placeholder[0] == 'M':
                    month = int(text[0:2])
                    day = int(text[2:4])
                    year = int(text[4:8])

                elif placeholder[2] == 'M':
                    if text[0:4] in ['2023', '2024', '2025', '2026', '2027', '2028', '2029','2030']: #determines if the first four digits are a year
                        year = int(text[0:4])
                        month = int(text[4:6])
                        day = int(text[6:8])
                    elif text[4:8] in ['2023', '2024', '2025', '2026', '2027', '2028', '2029','2030']: #determines if the last four digits are a year
                        day = int(text[0:2])
                        month = int(text[2:4])
                        year = int(text[4:8])

                elif text[0:4] in ['2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029','2030']:
                    year = int(text[0:4])
                    month = int(text[4:6])
                    day = int(text[6:8])

                elif text[4:8] in ['2021', '2023', '2024', '2025', '2026', '2027', '2028', '2029','2030']:
                    day = int(text[0:2])
                    month = int(text[2:4])
                    year = int(text[4:8])


            elif len(text) == 4: #MMYY or YYMM
                if placeholder[0] == 'M': #if MYY
                    month = int(text[0:2])
                    year = int(text[2:4]) + 2000
                    day = 30

                elif placeholder[2] == 'M': #if YYM
                    year = int(text[0:2]) + 2000
                    month = int(text[2:4])
                    day = 30

                else: #assumes MM/YY
                    month = int(text[0:2])
                    year = int(text[2:4]) + 2000
                    day = 30

            else:  # any other length fallback
                results.append(text)
                continue

            results.append(f"{year}-{month:02d}-{day:02d}")

        except Exception as e:
            results.append(text)

    return results


#main function calling on sub functions to process expiry dates
#here the image is retrieved from the frontend and passed to the first function
def process_expiry_date(image_path):

    #first we need to load the YOLO model
    model_path = "yolo_s/runs/expiry_train/weights/best.pt" # Path to the trained YOLO model
    target_class = 0
    image = Image.open(image_path)

    #calling the first function to detect text bounding boxes using YOLO
    bounding_box = detect_text_bounding_box(image, model_path, target_class)
    print("Bounding boxes:", bounding_box)
    #calling the second function to extract expiry dates using OCR
    extracted_texts = extract_expiry_date(bounding_box, image)

    #callign he third function to convert extracted text to numerical format
    converted_dates = convert_to_numerical(extracted_texts)

    #calling the fouth function to convert extracted text to date format
    results = convert_to_date(converted_dates)

    return results

results = process_expiry_date("temp_image.jpg")
print("Final extracted expiry dates:", results)