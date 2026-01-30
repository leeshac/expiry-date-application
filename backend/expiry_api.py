from fastapi import FastAPI, UploadFile, File, Form,Header, Query, HTTPException
from fastapi.responses import JSONResponse
from expiry_process import process_expiry_date
from PIL import Image
import io
from db import add_item_script, get_item_script, del_item_script
import psycopg2
import os
import requests
from jose import jwt

app = FastAPI()

JWKS_URL = "https://skilled-tuna-58.clerk.accounts.dev/.well-known/jwks.json"

def verify_jwt(token: str):
    try:
        #get the data from the url
        jwks = requests.get(JWKS_URL).json()
        #get header from the token
        headers = jwt.get_unverified_header(token)
        #get key id from header
        kid = headers["kid"]

        #set key default value
        key = None

        #find the jwks kid that matches the tokens kid, equal to k once found and stop
        for k in jwks["keys"]:
            if k["kid"] == kid:
                key = k 
                break

        if key is None:
            raise HTTPException(status_code=401, detail="Invalid token")

        #decode and verify the token
        payload = jwt.decode(token, key, algorithms=["RS256"], audience=None)
        #return the user id (sub)
        return payload["sub"]
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {e}")

#process the image and returns the expiry date
@app.post("/process-expiry-date")
#async makes function asynchronous so can handle multiple requests at the same time
async def process_expiry_date_endpoint(file: UploadFile = File(...)): #file upload being passed
    try:
        #reads the image file
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data))

        #temporarily saves
        temp_path = "temp_image.jpg"
        image.save(temp_path)

        #call on main func
        results = process_expiry_date(temp_path)

        #return result in JSON
        return JSONResponse(content={"results": results})

    #if fails then return error
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
    
#adds item to db
@app.post("/add-item")
async def add_item(item: dict, authorization: str = Header(...)):
    try:
        token = authorization.split(" ")[1]
        clerk_user_id = verify_jwt(token)

        name = item.get("name")
        expiry_date = item.get("expiry_date")
        image_url = item.get("image_url")

        #insert item into DB
        add_item_script(clerk_user_id, name, expiry_date, image_url)

        return JSONResponse(content={"status": "success"})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

#gets items from db
@app.get("/items")
async def get_items(authorization: str = Header(...)):
    try: 
        token = authorization.split(" ")[1]
        clerk_user_id = verify_jwt(token)

        #run script to get items
        items = get_item_script(clerk_user_id)

        return JSONResponse(content={"status": "success", "items" : items})
    except Exception as e:
        return JSONResponse(content={"error":str(e)},status_code=500)

#delete items from db
#user selects item, clicks taps delete, the item id gets sent to backend
@app.delete("/del-item")
async def del_item(id: int = Query(...), authorization: str = Header(...)):
    try:
        #we need to first validate the JWT and we do this by verifying the token against the jwt link
        token = authorization.split(" ")[1]
        clerk_user_id = verify_jwt(token)

        #defines the item id
        #id = int.get("id")

        del_item_script(id)
        return JSONResponse(content={"status": "success"})
    except Exception as e:
        return JSONResponse(content={"error":str(e)},status_code=500)